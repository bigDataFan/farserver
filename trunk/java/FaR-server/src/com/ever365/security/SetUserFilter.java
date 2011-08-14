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
			
			String ticket = getCookieTicket(httpReq);
			if (ticket==null) {
				Cookie newCookie = createNewCookie(httpResp);
				ticket = newCookie.getValue();
        	}
        	DBCollection cookiesCol = dataSource.getMainDB().getCollection("cookies");
        	DBObject ticDoc = cookiesCol.findOne(new BasicDBObject("ticket", ticket));
        	if(ticDoc==null) {
        		//give guest a cookie and let him use it
        		sessionedUser = ticket;
        			
        		cookiesCol.insert(BasicDBObjectBuilder.start().add("user", sessionedUser).add("ticket", ticket)
        					.add("remote", request.getRemoteAddr()).add("agent", httpReq.getHeader("User-Agent"))
        					.add("created", new Date()).get());
        	} else {
        		sessionedUser = (String)ticDoc.get("user");
        	}
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
	}
	
	 public String getCookieTicket(HttpServletRequest httpReq) {
	    	Cookie[] cookies = httpReq.getCookies();
	    	if (cookies!=null) { 
		    	for (Cookie cookie : cookies) {
					if (cookie.getName().equals(ARG_TICKET)) {
						return cookie.getValue();
					}
				}
	    	}
	    	return httpReq.getParameter(ARG_TICKET);
	    }

	 
	  public Cookie createNewCookie(HttpServletResponse httpResp ) {
	    	Cookie cookie = new Cookie(AuthenticationFilter.ARG_TICKET, GUEST + UUID.randomUUID().toString());
	    	cookie.setMaxAge(60*24*60*60);
	    	cookie.setPath("/");
	    	httpResp.addCookie(cookie);
	    	return cookie;
	   }

	  
}
