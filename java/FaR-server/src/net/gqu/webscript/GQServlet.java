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

import net.gqu.application.ApprovedApplication;
import net.gqu.application.InstalledApplication;
import net.gqu.cache.EhCacheService;
import net.gqu.content.ContentService;
import net.gqu.exception.HttpStatusExceptionImpl;
import net.gqu.freemarker.GQuFreemarkerExceptionHandler;
import net.gqu.freemarker.RepositoryTemplateLoader;
import net.gqu.jscript.root.ContentFile;
import net.gqu.jscript.root.ScriptContent;
import net.gqu.jscript.root.ScriptMongoDB;
import net.gqu.jscript.root.ScriptRequest;
import net.gqu.jscript.root.ScriptResponse;
import net.gqu.mongodb.MongoDBProvider;
import net.gqu.repository.LoadResult;
import net.gqu.repository.RepositoryService;
import net.gqu.security.AuthenticationUtil;
import net.gqu.security.BasicUserService;
import net.gqu.service.ApplicationService;
import net.gqu.service.ScriptExecService;
import net.gqu.utils.FileCopyUtils;
import net.gqu.utils.JSONUtils;
import net.gqu.utils.MimeTypeUtils;
import net.gqu.utils.StringUtils;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
	
	private static final long serialVersionUID = 1L;
    
	private Log logger = LogFactory.getLog(GQServlet.class);

	private static final String ACCESS_CONTROL_ALLOW_CREDENTIALS = "Access-Control-Allow-Credentials";
	private static final String ACCESS_CONTROL_ALLOW_METHODS = "Access-Control-Allow-Methods";
	private static final String ACCESS_CONTROL_ALLOW_ORIGIN = "Access-Control-Allow-Origin";
	
	public static final String JSON_CONTENT_TYPE = "application/json; charset=UTF-8";
	public static final String HTML_TYPE = "text/html; charset=UTF-8";
	public static final String FTL_END_FIX = ".ftl";
	
	private ApplicationService applicationService;
	private RepositoryService repositoryService;
	private ScriptExecService scriptExecService;
	private EhCacheService cacheService;
	private MongoDBProvider dbProvider;
	private BasicUserService userService;
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
		
		String requestHeader = request.getHeader("Access-Control-Request-Headers");
		if (requestHeader!=null) {
			response.setHeader("Access-Control-Allow-Headers", requestHeader);
		}
		response.setHeader(ACCESS_CONTROL_ALLOW_ORIGIN, "*");
		response.setHeader(ACCESS_CONTROL_ALLOW_METHODS, "POST, GET, OPTIONS");
		response.setHeader(ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
		response.setHeader("Access-Control-Max-Age", "1728000");
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
    	
    	freemarkerConfiguration = new Configuration();
		freemarkerConfiguration.setObjectWrapper(new DefaultObjectWrapper());
		freemarkerConfiguration.setLocale(Locale.ENGLISH);
		freemarkerConfiguration.setDefaultEncoding("UTF-8");
		freemarkerConfiguration.setTemplateLoader(new RepositoryTemplateLoader(repositoryService,applicationService));
		freemarkerConfiguration.setTemplateExceptionHandler(new GQuFreemarkerExceptionHandler());
		freemarkerConfiguration.setLocalizedLookup(false);
		
		fileItemFactory = new DiskFileItemFactory();
	}
	
	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String[] pathLists = getPathList(request);
		
		if (pathLists.length<2) {
			response.setStatus(400);
			return;
		}
		
		String user = pathLists[0];
		String mapping = pathLists[1];
		String[] pathArray = StringUtils.subArray(pathLists, 2);

		InstalledApplication installedApplication = applicationService.getInstalledByMapping(user, mapping);
		
		try {
			if (installedApplication==null) {
				throw new HttpStatusExceptionImpl(404, null);
			}
			
			ApprovedApplication application = applicationService.getApplication(installedApplication.getApp());
			
			if (application==null) {
				throw new HttpStatusExceptionImpl(404, null);
			}
			
			AuthenticationUtil.setContextUser(user);
			int pos = -1;
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < pathArray.length; i++) {
				if(pathArray[i].endsWith(WebScript.FILE_END_FIX)) {
					pos = i;
					break;
				}
				sb.append("/" + pathArray[i]);
			}
			if (pos!=-1) {
				String wspath = sb.toString() + "/get." + pathArray[pos].substring(0,pathArray[pos].length()-3) + ".js";
				String ftlpath = sb.toString() + "/get." + pathArray[pos].substring(0,pathArray[pos].length()-3) + ".ftl";
				String remainPath = StringUtils.cancatStringArray(pathArray, pos+1, '/');
				
				WebScript webScript = getWebscript(application,wspath);
				Template template = getFreeMarkerTemplate(application, ftlpath);
				if (webScript==null && template==null){
					throw new HttpStatusExceptionImpl(404);
				}
				
				Map<String, Object> params = createScriptParameters(installedApplication, request, response, remainPath);
				
				Object wsresult = null;
				if (webScript!=null) {
					wsresult = scriptExecService.executeScript(webScript, params, false);
					params.put("model", wsresult);
				}
				
				if (template!=null) {
					response.setContentType(HTML_TYPE);
					template.process(params, response.getWriter());
				} else {
					if (wsresult instanceof ContentFile) {
						handleFileDownLoad(request, response, (ContentFile)wsresult);
					} else {
						response.setContentType(JSON_CONTENT_TYPE);
						response.getWriter().println(JSONUtils.toJSONString(wsresult));
					}
				}
			} else {
				handleStaticPage(request, response, pathArray, application);
			}
		} catch (Exception e) {
			handleException(response, pathLists, e);
		}
	}

	private String[] getPathList(HttpServletRequest request) {
		String pathInfo = request.getPathInfo();
		if (pathInfo.charAt(0)=='/') {
			pathInfo = pathInfo.substring(1);
		}
		String[] pathLists = pathInfo.split("/");
		return pathLists;
	}

	private void handleStaticPage(HttpServletRequest request,
			HttpServletResponse response, String[] pathArray,
			ApprovedApplication application) throws IOException {
		Cache applicationCache = cacheService.getApplicationCache(application.getName());
		String staticFilePath = StringUtils.cancatStringArray(pathArray, 0, '/');
		String key = "resouce." + staticFilePath;
		PageInfo pageInfo = null;
		Element element = applicationCache.get(key);
		if (element == null) {
			String filePath = null;
			LoadResult lr = repositoryService.getRaw(application, staticFilePath);
			if (lr.getStatus()==404) {
				logger.debug("Request ressource not found: " + application.getName() + "  "  + staticFilePath);
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

	private void handleException(HttpServletResponse response, String[] pathList, Exception e) throws IOException {
		if (e instanceof TooManyInstructionException) {
			logger.debug("TooManyInstructionException " );
			return;
		} else if (e instanceof HttpStatusExceptionImpl) {
			response.setStatus(((HttpStatusExceptionImpl)e).getCode());
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

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String[] pathLists = getPathList(request);
		if (pathLists.length<2) {
			response.setStatus(400);
			return;
		}
		
		String user = pathLists[0];
		String mapping = pathLists[1];
		String[] pathArray = StringUtils.subArray(pathLists, 2);

		InstalledApplication installedApplication = applicationService.getInstalledByMapping(user, mapping);
		
		try {
			if (installedApplication==null) {
				throw new HttpStatusExceptionImpl(404, null);
			}
			ApprovedApplication application = applicationService.getApplication(installedApplication.getApp());
			
			if (application==null) {
				throw new HttpStatusExceptionImpl(404, null);
			}
			int pos = -1;
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < pathArray.length; i++) {
				
				if(pathArray[i].endsWith(WebScript.FILE_END_FIX)) {
					pos = i;
					break;
				}
				sb.append("/" + pathArray[i]);
			}
			if (pos!=-1) {
				String wspath = sb.append("/post." + pathArray[pos].substring(0,pathArray[pos].length()-3) + ".js").toString();
				String remainPath = StringUtils.cancatStringArray(pathArray, pos+1, '/');
				
				WebScript webScript = getWebscript(application,wspath);
				if (webScript==null){
					throw new HttpStatusExceptionImpl(404);
				}
				
				Map<String, Object> params = createScriptParameters(installedApplication, request, response, remainPath);
				
				Object wsresult = null;
				
				wsresult = scriptExecService.executeScript(webScript, params, false);
				params.put("model", wsresult);
			 
				if (!response.isCommitted()) {
					response.setContentType(HTML_TYPE);
					response.getWriter().println(JSONUtils.toJSONString(wsresult));
				}
			} else {
				throw new HttpStatusExceptionImpl(404);
			}
		} catch (Exception e) {
			handleException(response, pathLists, e);
		}

		
	}
	
	private WebScript getWebscript(ApprovedApplication application, String path) {
		Cache appcache = cacheService.getApplicationCache(application.getName());
		String key = "webscript." + path;
		Element element = appcache.get(key);
		if (element==null) {
			WebScript webscript;
			try {
				webscript = loadWebScript(application, path);
				element = new Element(key, webscript);
				appcache.put(element);
			} catch (IOException e) {
				logger.debug("script not found " + application.getName() + " " + path);
				return null;
			}
		}
		return (element==null||element.getObjectValue()==null)?null:(WebScript) element.getObjectValue();
	}

	private WebScript loadWebScript(ApprovedApplication application,String path) throws IOException {
		LoadResult lr = repositoryService.getRaw(application, path);
		if (lr.getStatus()==404) {
			return null;
		}
		String content = StringUtils.getText(lr.getInputStream());
		WebScript webScript = new WebScript(content);
		scriptExecService.compile(webScript);
		return webScript;
	}

	protected Map<String, Object> createScriptParameters(InstalledApplication installedApplication, HttpServletRequest req, HttpServletResponse response, String remainPath) {
		Map<String, Object> params = new HashMap<String, Object>(32, 1.0f);
		// add web script parameters
		ScriptRequest sr = new ScriptRequest(req);
		sr.setRemainPath(remainPath);
		sr.setFactory(fileItemFactory);
		params.put("params", sr.getParams());
		params.put("request", sr);
		params.put("response", new ScriptResponse(response));

		params.put("user", AuthenticationUtil.getCurrentUser());
		params.put("db", new ScriptMongoDB(dbProvider,
				userService.getUser(installedApplication.getUser()).getDb(), installedApplication.getApp()));
		params.put("content", new ScriptContent(contentService,userService));
		return params;
	}
	

	private Template getFreeMarkerTemplate(ApprovedApplication application,
			String path) {
		Cache appcache = cacheService.getApplicationCache(application.getName());
		String key = "ftl." + path;
		Element element = appcache.get(key);
		
		if (element == null) {
			try {
				Template template = freemarkerConfiguration.getTemplate(application.getName() + "." + path);
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
    
}
