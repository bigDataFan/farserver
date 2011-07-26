package net.gqu.webscript;

import java.io.IOException;
import java.io.InputStream;
import java.net.SocketException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.application.ApplicationService;
import net.gqu.cache.EhCacheService;
import net.gqu.content.ContentService;
import net.gqu.freemarker.GQuFreemarkerExceptionHandler;
import net.gqu.freemarker.RepositoryTemplateLoader;
import net.gqu.logging.LoggingService;
import net.gqu.repository.LoadResult;
import net.gqu.repository.RepositoryService;
import net.gqu.utils.FileCopyUtils;
import net.gqu.utils.JSONUtils;
import net.gqu.utils.RhinoUtils;
import net.gqu.utils.StringUtils;
import net.gqu.webscript.object.ContentFile;
import net.gqu.webscript.object.ScriptContent;
import net.gqu.webscript.object.ScriptMongoDB;
import net.gqu.webscript.object.ScriptObjectGenerator;
import net.gqu.webscript.object.ScriptRequest;
import net.gqu.webscript.object.ScriptResponse;
import net.gqu.webscript.object.ScriptSession;
import net.gqu.webscript.object.ScriptSystem;
import net.gqu.webscript.object.ScriptUser;
import net.gqu.webscript.object.ScriptUtils;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.RhinoException;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.ever365.collections.mongodb.MongoDBProvider;
import com.ever365.security.AuthenticationUtil;
import com.ever365.security.BasicUserService;

import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapper;
import freemarker.template.Template;
import freemarker.template.TemplateException;

/**
 * Servlet implementation class GQServlet
 */
public class PersonalGQServlet extends HttpServlet {
	
	private static final String ACCESS_CONTROL_REQUEST_HEADERS = "Access-Control-Request-Headers";
	private static final String ACCESS_CONTROL_ALLOW_HEADERS = "Access-Control-Allow-Headers";

	private static final long serialVersionUID = 1L;
	private Log logger = LogFactory.getLog(PersonalGQServlet.class);

	private static final String ACCESS_CONTROL_ALLOW_CREDENTIALS = "Access-Control-Allow-Credentials";
	private static final String ACCESS_CONTROL_ALLOW_METHODS = "Access-Control-Allow-Methods";
	private static final String ACCESS_CONTROL_ALLOW_ORIGIN = "Access-Control-Allow-Origin";
	private static final String ACCESS_CONTROL_MAX_AGE = "Access-Control-Max-Age";
	
	public static final String JSON_CONTENT_TYPE = "application/json; charset=UTF-8";
	public static final String HTML_TYPE = "text/html; charset=UTF-8";
	public static final String FTL_END_FIX = ".ftl";
	
	private ApplicationService applicationService;
	private RepositoryService repositoryService;
	private ScriptExecService scriptExecService;
	private EhCacheService cacheService;
	private MongoDBProvider dbProvider;
	private BasicUserService userService;
	private LoggingService loggingService;
	private ScriptObjectGenerator scriptObjectGenerator;
	
	
	private Configuration freemarkerConfiguration;
	private DiskFileItemFactory  fileItemFactory;
	private ContentService contentService;
	
	
	
	
	/**
     * @see HttpServlet#HttpServlet()
     */
    public PersonalGQServlet() {
        super();
    }

	@Override
	protected void doOptions(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		String requestHeader = request.getHeader(ACCESS_CONTROL_REQUEST_HEADERS);
		if (requestHeader!=null) {
			response.setHeader(ACCESS_CONTROL_ALLOW_HEADERS, requestHeader);
		}
		response.setHeader(ACCESS_CONTROL_ALLOW_ORIGIN, "*");
		response.setHeader(ACCESS_CONTROL_ALLOW_METHODS, "POST, GET, OPTIONS");
		response.setHeader(ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
		response.setHeader(ACCESS_CONTROL_MAX_AGE, "1728000");
	}

	@Override
	public void init(ServletConfig config) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
    	repositoryService = (RepositoryService) ctx.getBean("repositoryService");
		cacheService = (EhCacheService) ctx.getBean("cacheService");
    	scriptExecService =  (ScriptExecService) ctx.getBean("scriptService");
    	applicationService = (ApplicationService)ctx.getBean("applicationService");
    	dbProvider = (MongoDBProvider) ctx.getBean("dbProvider");
    	userService = (BasicUserService) ctx.getBean("userService");
    	contentService = (ContentService) ctx.getBean("contentService");
    	scriptObjectGenerator = (ScriptObjectGenerator) ctx.getBean("script.object.generator");
    	loggingService = (LoggingService) ctx.getBean("loggingService");
    	
    	freemarkerConfiguration = new Configuration();
		freemarkerConfiguration.setObjectWrapper(new DefaultObjectWrapper());
		freemarkerConfiguration.setLocale(Locale.ENGLISH);
		freemarkerConfiguration.setDefaultEncoding("UTF-8");
		freemarkerConfiguration.setTemplateLoader(new RepositoryTemplateLoader(repositoryService,applicationService));
		freemarkerConfiguration.setTemplateExceptionHandler(new GQuFreemarkerExceptionHandler());
		freemarkerConfiguration.setLocalizedLookup(false);
		
		fileItemFactory = new DiskFileItemFactory();
	}
	
	
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			GQRequest gqRequest = GQRequest.parse(request, applicationService);
			WebScript webScript = getWebscript(gqRequest.getApprovedApplication(), gqRequest.getJsPath());
			Template template = getFreeMarkerTemplate(gqRequest.getApprovedApplication(), gqRequest.getFtlPath());
			if (webScript==null && template==null){
				throw new HttpStatusExceptionImpl(404);
			}
				
			Map<String, Object> params = createScriptParameters(gqRequest, response);
				
			Object wsresult = null;
			if (webScript!=null) {
				wsresult = scriptExecService.executeScript(webScript, params, false);
				params.put("model", wsresult);
			}
			
			if (template!=null) {
				params = getFtlParameters(params);
				response.setContentType(HTML_TYPE);
				template.process(params, response.getWriter());
			} else {
				if (!response.isCommitted()) {
					if (wsresult instanceof ContentFile) {
						handleFileDownLoad(request, response, (ContentFile)wsresult);
					} else {
						response.setContentType(HTML_TYPE);
						response.getWriter().println(JSONUtils.toJSONString(wsresult));
					}
				}
			}
			
		} catch (Exception e) {
			handleException(request, response, e);
		}
	}


	private void handleException(HttpServletRequest request, HttpServletResponse response, Exception e) throws IOException {
		if (e instanceof HttpStatusExceptionImpl) {
			if (((HttpStatusExceptionImpl) e).getCode() == 307) {
				response.sendRedirect(((HttpStatusExceptionImpl) e).getDescription());
			} else {
				loggingService.getSystemLogger().debug("HttpStatusExceptionImpl code=" + ((HttpStatusExceptionImpl) e).getCode());
				response.setStatus(((HttpStatusExceptionImpl)e).getCode());
			}
			return;
		} else if (e instanceof RhinoException) {
			e.printStackTrace();
			RhinoException re = (RhinoException)e;
			System.out.println(re.columnNumber());
			response.sendError(422, e.getClass().getCanonicalName() + "  " + e.getMessage());
			return;
		} else if (e instanceof TemplateException) {
			response.sendError(422, ((TemplateException)e).getMessage());
			return;
		} else {
			e.printStackTrace();
			response.setStatus(500);
		}
	}

	
	private WebScript getWebscript(Map<String, Object> application, String path) {
		Cache appcache = cacheService.getApplicationCache((String)application.get(ApplicationService.APP_CONFIG_NAME));
		String key = "webscript." + path;
		Element element = appcache.get(key);
		if (element==null) {
			WebScript webscript;
			try {
				webscript = loadWebScript(application, path);
				element = new Element(key, webscript);
				appcache.put(element);
			} catch (IOException e) {
				logger.debug("script not found " + (String)application.get(ApplicationService.APP_CONFIG_NAME) + " " + path);
				return null;
			}
		}
		return (element==null||element.getObjectValue()==null)?null:(WebScript) element.getObjectValue();
	}

	private WebScript loadWebScript(Map<String, Object> application,String path) throws IOException {
		LoadResult lr = repositoryService.getRaw(application, path);
		if (lr.getStatus()==404) {
			return null;
		}
		String content = StringUtils.getText(lr.getInputStream());
		WebScript webScript = new WebScript(content);
		scriptExecService.compile(webScript);
		return webScript;
	}

	protected Map<String, Object> createScriptParameters(GQRequest gqrequest,HttpServletResponse response) {
		Map<String, Object> params = new HashMap<String, Object>(32, 1.0f);
		// add web script parameters
		ScriptRequest scriptRequest = new ScriptRequest(gqrequest.getRequest());
		scriptRequest.setFactory(fileItemFactory);
		
		/**the http request params for quick access*/
		params.put("params", scriptObjectGenerator.createRequestParams(gqrequest.getRequest()));
		
		/**the http request*/
		params.put("request", scriptRequest);
		
		/**the http response*/
		params.put("response", new ScriptResponse(response));
		
		/**the http session*/
		params.put("session", new ScriptSession(gqrequest.getRequest().getSession()));

		/**the context applications*/
		params.put("application",RhinoUtils.mapToNativeObject(gqrequest.getApprovedApplication()));

		/**assign the role db for current user*/
		params.put("db", new ScriptMongoDB(userService.getUserDB(AuthenticationUtil.getContextUser())));
		
		
		/**the content service for saving steam */
		params.put("content", new ScriptContent(contentService,userService));
		
		/**the current user*/
		//params.put("user", new ScriptUser(AuthenticationUtil.getCurrentUser(),userService));
		
		/**the user who owns the collection*/
		params.put("owner", new ScriptUser(AuthenticationUtil.getContextUser(),userService));
		
		/**utils */
		params.put("utils", ScriptUtils.getInstance());
		
		/**the system object for dashboard application*/
		params.put("system", new ScriptSystem(applicationService, userService));
		//params.put("logger", loggingService.getScriptLogger());
		//params.put("google", scriptObjectGenerator.createGoogleServiceObject(gqrequest.getInstalledApplication().getUser()));
		return params;
	}
	
	
	protected Map<String, Object> getFtlParameters(Map<String, Object> scriptObjects) {
		scriptObjects.put("params", RhinoUtils.nativeObjectToMap((NativeObject) scriptObjects.get("params")));
		//scriptObjects.put("context", RhinoUtils.nativeObjectToMap((NativeObject) scriptObjects.get("context")));
		
		return scriptObjects;
	}
	
	

	private Template getFreeMarkerTemplate(Map<String, Object> application,
			String path) {
		Cache appcache = cacheService.getApplicationCache((String)application.get(ApplicationService.APP_CONFIG_NAME));
		String key = "ftl." + path;
		Element element = appcache.get(key);
		
		if (element == null) {
			try {
				Template template = freemarkerConfiguration.getTemplate(application.get(ApplicationService.APP_CONFIG_NAME) + "." + path);
				element = new Element(key, template);
				appcache.put(element);
			} catch (IOException e) {
				appcache.put(new Element(key, null));
				return null;
			}
		} 
		return (element==null||element.getObjectValue()==null)?null:(Template)element.getObjectValue();
	}
	

	
    
    private void handleFileDownLoad(HttpServletRequest request, HttpServletResponse response, ContentFile downloadFile) {
    	if (downloadFile.getModified()!=null) {
    		response.setDateHeader("Last-Modified", downloadFile.getModified().getTime());
    		response.setHeader("ETag", "\"" + Long.toString(downloadFile.getModified().getTime()) + "\"");
    	}
    	response.setHeader("Cache-Control", "must-revalidate");
    	
    	
    	response.setHeader("Content-Disposition", "attachment; filename=\"" + downloadFile.getFileName() + "\";");
    	
    	if (downloadFile.getMimetype()!=null) {
    		response.setContentType(downloadFile.getMimetype());
    	}
    	
    	try {
    		boolean processedRange = false;
    		String range = request.getHeader("Content-Range");
    		if (range == null) {
    			range = request.getHeader("Range");
    		} 
    		
    		if (range != null) {
    			// return the specific set of bytes as requested in the content-range header
	             /* Examples of byte-content-range-spec values, assuming that the entity contains total of 1234 bytes:
	                   The first 500 bytes:
	                    bytes 0-499/1234
	
	                   The second 500 bytes:
	                    bytes 500-999/1234
	
	                   All except for the first 500 bytes:
	                    bytes 500-1233/1234 */
	             /* 'Range' header example:
	                    bytes=10485760-20971519 */
          	
          	
    			response.reset();
    			response.setHeader("Accept-Ranges", "bytes");
    			response.setStatus(javax.servlet.http.HttpServletResponse.SC_PARTIAL_CONTENT);

    			long l = downloadFile.getSize(); //get the length

          		String length = range.substring("bytes=".length());
          		
          		if (length.endsWith("-")) {
          			length = length.substring(0,length.length()-1);
          		}
          		
          		long p = Long.parseLong(length);
          		response.setHeader("Content-Length", new Long(downloadFile.getSize() - p).toString());
          		
          		if (p != 0) {
          		response.setHeader("Content-Range","bytes " + new Long(p).toString() + "-" + new Long(l -1).toString() + "/" + new Long(l).toString());
          	}
          		
          	long k =0;
          	int ibuffer=65536;
          	byte[] bytes=new byte[ibuffer];
          	InputStream fileinputstream = downloadFile.getInputStream();
          	try{
          		if (p!=0) fileinputstream.skip(p);
          		while (k<l){
          			int j=fileinputstream.read(bytes,0,ibuffer);
          			response.getOutputStream().write(bytes,0,j);
          			response.getOutputStream().flush();
          			k +=j;
          		}
	            processedRange = true;
          	} catch (Exception e) {
          		System.err.println(e.getMessage());
          	} finally {
          		try {
					fileinputstream.close();
				} catch (IOException e) {
				}
          	}
          }
          if (processedRange == false)
          {
             // As per the spec:
             //  If the server ignores a byte-range-spec because it is syntactically
             //  invalid, the server SHOULD treat the request as if the invalid Range
             //  header field did not exist.
             long size = downloadFile.getSize();
             response.setHeader("Content-Range", "bytes 0-" + Long.toString(size-1L) + "/" + Long.toString(size));
             response.setHeader("Content-Length", Long.toString(size));
             
             
             FileCopyUtils.copy(downloadFile.getInputStream(), response.getOutputStream());
          }
       }
       catch (SocketException e1)
       {
          // the client cut the connection - our mission was accomplished apart from a little error message
       } catch (IOException e) {
		e.printStackTrace();
	}
       
    }


	
}
