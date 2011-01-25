package net.gqu.webscript;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketException;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.application.ApplicationService;
import net.gqu.application.InstalledApplication;
import net.gqu.cache.EhCacheService;
import net.gqu.content.ContentService;
import net.gqu.freemarker.GQuFreemarkerExceptionHandler;
import net.gqu.freemarker.RepositoryTemplateLoader;
import net.gqu.logging.LoggingService;
import net.gqu.mongodb.MongoDBProvider;
import net.gqu.repository.LoadResult;
import net.gqu.repository.RepositoryService;
import net.gqu.security.AuthenticationUtil;
import net.gqu.security.BasicUserService;
import net.gqu.security.Role;
import net.gqu.security.User;
import net.gqu.utils.FileCopyUtils;
import net.gqu.utils.JSONUtils;
import net.gqu.utils.MimeTypeUtils;
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

import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapper;
import freemarker.template.Template;
import freemarker.template.TemplateException;

/**
 * Servlet implementation class GQServlet
 */
public class GQServlet extends HttpServlet {
	
	private static final String ACCESS_CONTROL_REQUEST_HEADERS = "Access-Control-Request-Headers";
	private static final String ACCESS_CONTROL_ALLOW_HEADERS = "Access-Control-Allow-Headers";

	private static final long serialVersionUID = 1L;
	private Log logger = LogFactory.getLog(GQServlet.class);

	private static final String ACCESS_CONTROL_ALLOW_CREDENTIALS = "Access-Control-Allow-Credentials";
	private static final String ACCESS_CONTROL_ALLOW_METHODS = "Access-Control-Allow-Methods";
	private static final String ACCESS_CONTROL_ALLOW_ORIGIN = "Access-Control-Allow-Origin";
	private static final String ACCESS_CONTROL_MAX_AGE = "Access-Control-Max-Age";
	
	public static final String JSON_CONTENT_TYPE = "application/json; charset=UTF-8";
	public static final String HTML_TYPE = "text/html; charset=UTF-8";
	public static final String FTL_END_FIX = ".ftl";
	
	
	public static ThreadLocal<GQRequest> threadlocalRequest = new ThreadLocal<GQRequest>();
	
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
    public GQServlet() {
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
			GQRequest gqRequest = new GQRequest(request);
			
			threadlocalRequest.set(gqRequest);
			
			AuthenticationUtil.setContextUser(gqRequest.getInstalledApplication().getUser());
			
			if (gqRequest.isScript()) {
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
			} else {
				handleStaticPage(request, response, gqRequest);
			}
		} catch (Exception e) {
			handleException(request, response, e);
		}
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	

	private void handleStaticPage(HttpServletRequest request,
			HttpServletResponse response, GQRequest gqrequest) throws IOException {
		Cache applicationCache = cacheService.getApplicationCache((String)gqrequest.getApprovedApplication().get(ApplicationService.APP_CONFIG_NAME));
		String staticFilePath = gqrequest.getFilePath();
		String key = "resouce." + staticFilePath;
		PageInfo pageInfo = null;
		Element element = applicationCache.get(key);
		if (element == null) {
			LoadResult lr = repositoryService.getRaw(gqrequest.getApprovedApplication(), staticFilePath);
			if (lr.getStatus()==404) {
				logger.debug("Request ressource not found: " + gqrequest.getApprovedApplication().get(ApplicationService.APP_CONFIG_NAME) + "  "  + staticFilePath);
				throw new HttpStatusExceptionImpl(404);
			} else {
				ByteArrayOutputStream outstr = new ByteArrayOutputStream();
				FileCopyUtils.copy(lr.getInputStream(), outstr);
				long timeToLiveSeconds = applicationCache.getCacheConfiguration().getTimeToLiveSeconds();
				pageInfo = new PageInfo(200, MimeTypeUtils.guess(staticFilePath), null, null,
						outstr.toByteArray(), true, timeToLiveSeconds);
			}
			applicationCache.put(new Element(key, pageInfo));
		} else {
			pageInfo = (PageInfo) element.getObjectValue();
		}
		responsePageInfo(request, response, pageInfo);
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
		scriptRequest.setRemainPath(gqrequest.getTailPath());
		scriptRequest.setFileSizeMax(gqrequest.getRole().getContentSize());
		scriptRequest.setFactory(fileItemFactory);
		
		params.put("params", scriptObjectGenerator.createRequestParams(gqrequest.getRequest(), gqrequest.getTailPath()));
		params.put("request", scriptRequest);
		params.put("response", new ScriptResponse(response));
		params.put("session", new ScriptSession(gqrequest.getRequest().getSession()));
		//params.put("context", scriptObjectGenerator.createContextObject(gqrequest, gqrequest.getInstalledApplication(), gqrequest.getTailPath()));
		params.put("application",RhinoUtils.mapToNativeObject(gqrequest.getApprovedApplication()));
		params.put("db", new ScriptMongoDB(dbProvider, gqrequest.getContextUser().getDb(), gqrequest.getInstalledApplication().getApp()));
		params.put("content", new ScriptContent(contentService,userService));
		
		params.put("system", new ScriptSystem(applicationService, userService));
		
		params.put("user", new ScriptUser(AuthenticationUtil.getCurrentUser(),userService));
		params.put("owner", new ScriptUser(AuthenticationUtil.getContextUser(),userService));
		params.put("utils", ScriptUtils.getInstance());
		params.put("logger", loggingService.getScriptLogger());
		params.put("google", scriptObjectGenerator.createGoogleServiceObject(gqrequest.getInstalledApplication().getUser()));
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
	

	private void responsePageInfo(HttpServletRequest request,
			HttpServletResponse response, PageInfo pageInfo) throws IOException {
		if (pageInfo==null) {
			response.setStatus(404);
			return;
		}
		response.setStatus(pageInfo.getStatusCode());
		String contentType = pageInfo.getContentType();
		if (contentType != null && contentType.length() > 0) {
			response.setContentType(contentType);
		}
		final Collection headers = pageInfo.getResponseHeaders();
		final int header = 0;
		final int value = 1;

		for (Iterator iterator = headers.iterator(); iterator.hasNext();) {
		    final String[] headerPair = (String[]) iterator.next();
		    response.setHeader(headerPair[header], headerPair[value]);
		}
		
		byte[] body;
		if (acceptsGzipEncoding(request)) {
			response.setHeader("Content-Encoding", GZIP);
		    body = pageInfo.getGzippedBody();
		} else {
		    body = pageInfo.getUngzippedBody();
		}
		response.setContentLength(body.length);
		OutputStream out = new BufferedOutputStream(response.getOutputStream());
		out.write(body);
		out.flush();
	}

	
	private static final String GZIP = "gzip";
	private boolean acceptsGzipEncoding(HttpServletRequest request) {
		return acceptsEncoding(request, GZIP);
	}
	
	 /**
     * Checks if request accepts the named encoding.
     */
	private static final String ACCEPT_ENCODING = "Accept-Encoding";
    protected boolean acceptsEncoding(final HttpServletRequest request, final String name) {
        final boolean accepts = headerContains(request, ACCEPT_ENCODING, name);
        return accepts;
    }

    /**
     * Checks if request contains the header value.
     */
    private boolean headerContains(final HttpServletRequest request, final String header, final String value) {

        final Enumeration accepted = request.getHeaders(header);
        while (accepted.hasMoreElements()) {
            final String headerValue = (String) accepted.nextElement();
            if (headerValue.indexOf(value) != -1) {
                return true;
            }
        }
        return false;
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
    
    public static GQRequest getThreadlocalRequest() {
		return threadlocalRequest.get();
	}



	public class GQRequest {
    	private HttpServletRequest request;
    	private Map<String, Object> approvedApplication;
    	private String[] pathList;
    	private boolean isScript;
		private String jspath;
		private String basePath;
		private String ftlpath;
		private String remainPath;
		private InstalledApplication installedApplication;
		private String[] pathArray;
    	private User contextUser;
    	private Role role;
    	
		public GQRequest(HttpServletRequest request) {
			super();
			this.request = request;

			pathList = getPathList(request);
			if (pathList.length<2) {
				throw new HttpStatusExceptionImpl(400);
			}
			
			contextUser = userService.getUser(pathList[0]);
			if (contextUser.isDisabled()) {
				throw new HttpStatusExceptionImpl(410); //gone
			}
			role = userService.getRole(contextUser.getRole()); 
			if (role==null || !role.isEnabled()) {
				throw new HttpStatusExceptionImpl(410); //gone
			}
			
			Map<String, Object> map = applicationService.getInstalledByMapping(pathList[0], pathList[1]);
			if (map==null) {
				if (applicationService.getApplication(pathList[1])==null) {
					throw new HttpStatusExceptionImpl(404, null);
				} else {
					map = applicationService.install(pathList[0], pathList[1], pathList[1]);
				}
			} 
			
			installedApplication = new InstalledApplication();
			installedApplication.setApp((String) map.get(ApplicationService.KEY_APPLICATION));
			installedApplication.setMapping((String) map.get(ApplicationService.KEY_MAPPING));
			installedApplication.setUser((String)map.get(ApplicationService.KEY_USER));
		
			
			basePath = "/user/" + pathList[0] + "/" + pathList[1];
			approvedApplication = applicationService.getApplication(installedApplication.getApp());
			
			if (approvedApplication==null) {
				throw new HttpStatusExceptionImpl(404, null);
			}
			
			
			int pos = -1;
			isScript = false;
			
			if (pathList.length==2 || (pathList.length==3&&pathList[2].equals(""))) {
				if (approvedApplication.get(ApplicationService.APP_CONFIG_START)==null) {
					throw new HttpStatusExceptionImpl(404);
				} else {
					throw new HttpStatusExceptionImpl(307, (String)approvedApplication.get(ApplicationService.APP_CONFIG_START));
				}
			} else {
				pathArray = StringUtils.subArray(pathList, 2);
			}
			
			
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < pathArray.length; i++) {
				if(pathArray[i].endsWith(WebScript.FILE_END_FIX)) {
					pos = i;
					isScript = true;
					break;
				}
				sb.append("/" + pathArray[i]);
			}
			
			if (isScript) {
				jspath  = sb.toString() + "/" + request.getMethod().toLowerCase() + "." + pathArray[pos].substring(0,pathArray[pos].length()-3) + ".js";
				ftlpath = sb.toString() + "/" + request.getMethod().toLowerCase() + "." + pathArray[pos].substring(0,pathArray[pos].length()-3) + ".ftl";
				remainPath = StringUtils.cancatStringArray(pathArray, pos+1, '/');
			}
		}

		
		
		public String getBasePath() {
			return basePath;
		}



		public boolean isScript() {
			return isScript;
		}
	    	
		public String getFilePath() {
			String staticFilePath = StringUtils.cancatStringArray(pathArray, 0, '/');
			return staticFilePath;
		}
		
		public String[] getPathArray() {
			return pathArray;
		}

		public Map<String, Object> getApprovedApplication() {
			return approvedApplication;
		}

		public InstalledApplication getInstalledApplication() {
			return installedApplication;
		}

		public String getTailPath() {
			return remainPath;
		}
		
		
		public String getJsPath() {
			return jspath;
		}
		public String getFtlPath() {
			return ftlpath;
		}
		
		
		
		public HttpServletRequest getRequest() {
			return request;
		}

		public User getContextUser() {
			return contextUser;
		}

		public Role getRole() {
			return role;
		}

		private String[] getPathList(HttpServletRequest request) {
			String pathInfo = request.getPathInfo();
			if (pathInfo.charAt(0)=='/') {
				pathInfo = pathInfo.substring(1);
			}
			String[] pathLists = pathInfo.split("/");
			return pathLists;
		}
    	
    }
}
