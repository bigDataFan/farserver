package com.ever365.vfile.protocol.webdav;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.ever365.security.AuthenticationUtil;
import com.ever365.security.User;
import com.ever365.security.UserService;
import com.ever365.vfile.VFileService;


/**
 * Servlet implementation class WebDAVServlet
 */
public class WebDAVServlet extends HttpServlet {
	private static final String AUTH_SEP = ":";
	private static final String AUTH_BEGIN_BASIC = "BASIC";
	private static final String AUTHORIZATION_HDR = "Authorization";
	private static final String WEBDAV_USER = ".alfWebDAVUser";

	private static final long serialVersionUID = 1L;
       
	private static Log logger = LogFactory.getLog(WebDAVServlet.class);
	
	private Map<String, Class> methods = new HashMap<String, Class>();

	private VFileService fileService = null;
	private UserService userService = null;


	/**
     * @see HttpServlet#HttpServlet()
     */
    public WebDAVServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    @Override
    public void init(ServletConfig config) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
		fileService = (VFileService) ctx.getBean("fileService");
		userService = (UserService) ctx.getBean("userService");

		methods.put(WebDAV.METHOD_OPTIONS, OptionsMethod.class);
		methods.put(WebDAV.METHOD_GET, GetMethod.class);
		methods.put(WebDAV.METHOD_MKCOL, MkcolMethod.class);
		methods.put(WebDAV.METHOD_PROPFIND, PropFindMethod.class);
		methods.put(WebDAV.METHOD_PUT, PutMethod.class);
		methods.put(WebDAV.METHOD_POST, PostMethod.class);
		methods.put(WebDAV.METHOD_HEAD, HeadMethod.class);
		methods.put(WebDAV.METHOD_DELETE, DeleteMethod.class);
		methods.put(WebDAV.METHOD_COPY, CopyMethod.class);
		methods.put(WebDAV.METHOD_MOVE, MoveMethod.class);
    }
    
    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
    		throws ServletException, IOException {
    	
    	//对于options方法 直接调用通过
    	if (request.getMethod().equalsIgnoreCase(WebDAV.METHOD_OPTIONS)) {
    		WebDAVMethod method = getDavMethod(WebDAV.METHOD_OPTIONS);
    		try {
				method.executeImpl(request, response);
			} catch (Exception e) {
			}
    		return;
    	}
    	
    	
    	String user = (String) request.getSession().getAttribute(WEBDAV_USER);
        
        if (user == null) {
        	String authHdr = request.getHeader(AUTHORIZATION_HDR);
        	
        	if (authHdr==null || authHdr.length()<5 || !authHdr.substring(0,5).equalsIgnoreCase(AUTH_BEGIN_BASIC)) {
        		//r
        	} else {
        		String basicAuth = new String(Base64.decodeBase64(authHdr.substring(5).getBytes()));
        		String userName = null;
        		String password = null;
        		
        		int sep = basicAuth.indexOf(AUTH_SEP);
        		
        		if (sep>-1) {
        			userName =  basicAuth.substring(0, sep);
        			password = basicAuth.substring(sep + 1);
        			logger.debug("WebDAV login as user=" + userName + "  password=" + password);
        			
        			User usero = userService.getUser(userName);
        			if (!usero.getPassword().equals(password)) {
        				user = null;
        			} else {
        				user = userName;
        			}
        		}
        	}
        }
        
        if (user == null) {
        	response.setHeader("WWW-Authenticate", "BASIC realm=\"Ever365 DAV Server\"");
        	response.setStatus(401);
        	response.flushBuffer();
        	return;
        } else {
        	request.getSession().setAttribute(WEBDAV_USER , user);
        	AuthenticationUtil.setCurrentUser(user);
        	
        	WebDAVMethod method = getDavMethod(request.getMethod().toUpperCase());
        	
        	if (method!=null) {
        		try {
        			method.execute(request, response);
        		} catch (Throwable e) {
        			if (!(e instanceof WebDAVServerException) && e.getCause() != null) {
        				if (e.getCause() instanceof WebDAVServerException) {
        					e = e.getCause();
        				}
        			}
        			// Work out how to handle the error
        			if (e instanceof WebDAVServerException) {
        				WebDAVServerException error = (WebDAVServerException) e;
        				response.setStatus(error.getHttpStatusCode());
        				return;
        			}  else {
        				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        			}
        		}	
        	} else {
        		response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
        	}
        }
        //logger.debug(request.getMethod() + "  " + request.getRequestURI());
    }
    
	private WebDAVMethod getDavMethod(String method) {
		try {
			Class clazz = methods.get(method);
			WebDAVMethod obj = (WebDAVMethod) clazz.newInstance();
			obj.setFileService(fileService);
			obj.setUserService(userService);
			return obj;
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
		return null;
	}
    
}
  