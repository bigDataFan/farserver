package net.gqu.service;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.RhinoException;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.WrapFactory;
import org.mozilla.javascript.WrappedException;

import net.gqu.exception.HttpStatusExceptionImpl;
import net.gqu.webscript.CounteredContextFactory;
import net.gqu.webscript.ValueConverter;
import net.gqu.webscript.WebScript;

public class ScriptExecService {

	public static final String ECMA_ERROR = "EcmaError";

	private static final Log logger = LogFactory.getLog(ScriptExecService.class);

	/** Wrap Factory */
	private static final WrapFactory wrapFactory = new RhinoWrapFactory();

	/** Pre initialized secure scope object. */
	private Scriptable secureScope;
	
	private Map<String, Object> serviceObjects = new HashMap<String, Object>();

	/** Pre initialized non secure scope object. */
	private Scriptable nonSecureScope;
	
	private static final ThreadLocal<Object> error = new ThreadLocal<Object>();
	
    private Map<String, String> config = new HashMap<String, String>();

    
	public Map<String, String> getConfig() {
		return config;
	}
	
	public void setServiceObjects(Map<String, Object> serviceObjects) {
		this.serviceObjects = serviceObjects;
		this.serviceObjects.put("logger", this.logger);
	}

	
	/**
	 * Execute the supplied script content. Adds the default data model and
	 * custom configured root objects into the root scope for access by the
	 * script.
	 * 
	 * @param script
	 *            The script to execute.
	 * @param model
	 *            Data model containing objects to be added to the root scope.
	 * @param secure
	 *            True if the script is considered secure and may access java.*
	 *            libs directly
	 * 
	 * @return result of the script execution, can be null.
	 * 
	 * @throws AlfrescoRuntimeException
	 */
	public Object executeScript(WebScript webScript, Map<String, Object> model,
			boolean secure) {
		long b = System.nanoTime();
		
		// check that rhino script engine is available
		Context cx = Context.enter();
		try {
			cx.setInstructionObserverThreshold(CounteredContextFactory.COUNTER_INTERVAL);
			// Create a thread-specific scope from one of the shared scopes.
			// See http://www.mozilla.org/rhino/scopes.html
			cx.setWrapFactory(wrapFactory);
			Scriptable sharedScope = secure ? this.nonSecureScope
					: this.secureScope;
			Scriptable scope = cx.newObject(sharedScope);
			scope.setPrototype(sharedScope);
			scope.setParentScope(null);

			// there's always a model, if only to hold the util objects
			if (model == null) {
				model = new HashMap<String, Object>();
			}
			
			model.putAll(serviceObjects);
			// insert supplied object model into root of the default scope
			for (String key : model.keySet()) {
				// set the root scope on appropriate objects
				// this is used to allow native JS object creation etc.
				Object obj = model.get(key);
				// convert/wrap each object to JavaScript compatible
				Object jsObject = Context.javaToJS(obj, scope);

				// insert into the root scope ready for access by the script
				ScriptableObject.putProperty(scope, key, jsObject);
			}
			Object result = webScript.getScript().exec(cx, scope);
			//return result; 
			logger.debug("Webscript exec " + (System.nanoTime()-b));
			
			if (result instanceof Serializable) {
				return ValueConverter.convertValueForRepo((Serializable) result);
			} else {
				return result;
			}
		} catch (WrappedException w) {
			if (w.getCause() instanceof RuntimeException) {
				throw (RuntimeException) w.getCause();
			}
		} catch (RhinoException re) {
			throw re;
		} catch (ClassCastException e) {
			e.printStackTrace();
		}
		catch (Throwable err) {
			if (err instanceof RuntimeException) {
				throw (RuntimeException) err;
			}
		} finally {
			Context.exit();
		}
		return null;
	}

	/**
	 * Rhino script value wraper
	 */
	private static class RhinoWrapFactory extends WrapFactory {
		/*
		 * (non-Javadoc)
		 * 
		 * @seeorg.mozilla.javascript.WrapFactory#wrapAsJavaObject(org.mozilla.
		 * javascript.Context, org.mozilla.javascript.Scriptable,
		 * java.lang.Object, java.lang.Class)
		 */
		public Scriptable wrapAsJavaObject(Context cx, Scriptable scope,
				Object javaObject, Class staticType) {
			/*
			 * if (javaObject instanceof Map && !(javaObject instanceof
			 * ScriptableHashMap)) { return new NativeMap(scope,
			 * (Map)javaObject); }
			 */
			return super.wrapAsJavaObject(cx, scope, javaObject, staticType);
		}
	}

	/**
	 * Pre initializes two scope objects (one secure and one not) with the
	 * standard objects preinitialised. This saves on very expensive calls to
	 * reinitialize a new scope on every web script execution. See
	 * http://www.mozilla.org/rhino/scopes.html
	 * 
	 * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet()
	 */
	public void init() {
		// Initialise the secure scope
		Context cx = Context.enter();
		try {
			cx.setWrapFactory(wrapFactory);
			this.secureScope = cx.initStandardObjects();

			// remove security issue related objects - this ensures the script
			// may not access
			// unsecure java.* libraries or import any other classes for direct
			// access - only
			// the configured root host objects will be available to the script
			// writer
			this.secureScope.delete("Packages");
			this.secureScope.delete("getClass");
			this.secureScope.delete("java");
		} finally {
			Context.exit();
		}

		// Initialise the non-secure scope
		cx = Context.enter();
		try {
			cx.setWrapFactory(wrapFactory);

			// allow access to all libraries and objects, including the importer
			// @see http://www.mozilla.org/rhino/ScriptingJava.html
			this.nonSecureScope = new ImporterTopLevel(cx);
		} finally {
			Context.exit();
		}
	}
		
	public void compile(WebScript webScript) {
		
		 // compile the script and cache the result
        Context cx = Context.enter();
        try
        {
        	cx.setInstructionObserverThreshold(100);
        	//System.out.println("compile..." );
        	//System.out.println(webScript.getScriptContent());
            Script script = cx.compileString(webScript.getScriptContent(), "gscript", 1, null);
            
            // We do not worry about more than one user thread compiling the same script.
            // If more than one request thread compiles the same script and adds it to the
            // cache that does not matter - the results will be the same. Therefore we
            // rely on the ConcurrentHashMap impl to both deal with ensuring the safety of the
            // underlying structure with asynchronous get/put operations and for fast
            // multi-threaded access to the common cache.
            webScript.setScript(script);
        } catch (Exception e) {
        	if (e instanceof RuntimeException) {
        		throw (RuntimeException) e;
        	} else {
        		throw new HttpStatusExceptionImpl(408);
        	}
        	// if compile fail, the script is not right
		}
        finally
        {
            Context.exit();
        }
	}

	public static Object getError() {
		return error.get();
	}
	
	public static void setError(Object o) {
		error.set(o);
	}
	

}
