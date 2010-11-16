package net.gqu.security;

import java.io.IOException;
import java.util.UUID;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.cache.EhCacheService;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * Servlet implementation class LoginServlet
 */
public class LoginServlet extends HttpServlet {
	public static final String HEADER_REFERER = "Referer";
	private static final long serialVersionUID = 1L;
	private EhCacheService cacheService;
	private BasicUserService userService;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet() {
        super();
    }

	@Override
	public void init(ServletConfig config) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
		userService = (BasicUserService) ctx.getBean("userService");
		cacheService = (EhCacheService) ctx.getBean("cacheService");
		
	}


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = request.getParameter("username");
    	String pwd = request.getParameter("password");
    	
    	if (username==null || pwd==null ) {
    		response.sendError(401);
    		//response.getWriter().println(1);
    		return;
    	}
    	
    	
    	if (AuthenticationUtil.ADMIN_USER_NAME.equals(username) && pwd.equals(userService.getAdminPassword())) {
    		request.getSession().setAttribute(AuthenticationUtil.ADMIN_USER_NAME, true);
    		
    	}
    	
    	  // Get the authorization header
    	User user = userService.getUser(username);
    	
    	if (user!=null) {
    		if (!user.getPassword().equals(pwd)) {
    			response.sendRedirect(userService.getLoginPage());
    			return;
    		} else {
    			request.getSession().setAttribute(AuthenticationFilter.AUTHENTICATION_USER, user);		
        		Cookie cookie = createNewCookie(response);
        		Element element = new Element(cookie.getValue(), user);
        		Cache cookieCache = cacheService.getCookieCache();
        		cookieCache.put(element);
        		AuthenticationUtil.setCurrentUser(user);
        		
        		if (request.getSession().getAttribute(AuthenticationFilter.LOGIN_REFERER)!=null) {
        			String url = (String)request.getSession().getAttribute(AuthenticationFilter.LOGIN_REFERER);
        			request.getSession().removeAttribute(AuthenticationFilter.LOGIN_REFERER);
        			response.sendRedirect(url);
        		} else { 
        			response.sendRedirect(userService.getMainPage());
        		}
        		return;
    		}
    	} else {
    		response.sendRedirect(userService.getLoginPage());
    	}
	}
	  public Cookie createNewCookie(HttpServletResponse httpResp ) {
	    	Cookie cookie = new Cookie(AuthenticationFilter.ARG_TICKET, UUID.randomUUID().toString());
	    	cookie.setMaxAge(24*60*60);
	    	cookie.setPath("/");
	    	httpResp.addCookie(cookie);
	    	return cookie;
	    }

}
