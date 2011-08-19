package com.ever365.security;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

/**
 * Servlet Filter implementation class SetUserFilter
 */
public class SetUserFilter implements Filter {

	
	private static final String GUEST = "guest.";
	public static final String ARG_TICKET = "ticket";
	private MongoDBDataSource dataSource;
	private CookieService cookieService;
    /**
     * Default constructor. 
     */
    public SetUserFilter() {
    }

    
	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpReq = (HttpServletRequest) request;
		HttpServletResponse httpResp = (HttpServletResponse) response;
		
		String sessionedUser = (String) httpReq.getSession().getAttribute(AuthenticationFilter.AUTHENTICATION_USER);
		
		if (sessionedUser == null) {
			sessionedUser = cookieService.provideUser(httpReq, httpResp);
        	httpReq.getSession().setAttribute(AuthenticationFilter.AUTHENTICATION_USER, sessionedUser);
		}
		
		if (sessionedUser.startsWith(GUEST)) {
			AuthenticationUtil.setCurrentAsGuest(true);
		} else {
			AuthenticationUtil.setCurrentAsGuest(false);
		}
		AuthenticationUtil.setCurrentUser(sessionedUser);
		
		
		// pass the request along the filter chain
		chain.doFilter(request, response);
	}


	

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(fConfig.getServletContext());
		dataSource = (MongoDBDataSource) ctx.getBean("dataSource");
		cookieService = (CookieService)ctx.getBean("cookieService");
	}
	


	  
}
