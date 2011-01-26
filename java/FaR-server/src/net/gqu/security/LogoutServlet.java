package net.gqu.security;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import net.gqu.cache.EhCacheService;
import net.sf.ehcache.Cache;

/**
 * Servlet implementation class LogoutServlet
 */
public class LogoutServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LogoutServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    

    private EhCacheService cacheService;
    private BasicUserService userService;
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
		cacheService = (EhCacheService) ctx.getBean("cacheService");
		userService = (BasicUserService) ctx.getBean("userService");
	}
	

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String url = request.getRequestURI();
    	
    	Cookie[] cookies = request.getCookies();
    	if (cookies!=null) { 
	    	for (Cookie cookie : cookies) {
				if (cookie.getName().equals(AuthenticationFilter.ARG_TICKET)) {
		       		Cache cookieCache = cacheService.getCookieCache();
	        		cookieCache.remove(cookie.getValue());
	        		cookie.setMaxAge(0);
	        		//response.addCookie(cookie)
				}
			}
    	}
    	request.getSession().removeAttribute(AuthenticationFilter.AUTHENTICATION_USER);
    	response.sendRedirect("/");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
