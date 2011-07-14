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

import net.gqu.mongodb.MongoDBProvider;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

/**
 * Servlet Filter implementation class SetUserFilter
 */
public class SetUserFilter implements Filter {

	
	public static final String ARG_TICKET = "ticket";
	private MongoDBProvider dbProvider;
	
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
		AuthenticationUtil.setCurrentAsGuest();
		
		String sessionedUser = (String) httpReq.getSession().getAttribute(AuthenticationFilter.AUTHENTICATION_USER);
		
		if (sessionedUser != null) {
			AuthenticationUtil.setCurrentUser(sessionedUser);
			AuthenticationUtil.setContextUser(sessionedUser);
		} else {
			String ticket = getCookieTicket(httpReq);
			if (ticket==null) {
				Cookie newCookie = createNewCookie(httpResp);
				ticket = newCookie.getValue();
        	}
			
        	DBCollection cookiesCol = dbProvider.getMainDB().getCollection("cookies");
        	DBObject ticDoc = cookiesCol.findOne(new BasicDBObject("ticket", ticket));
        	String userName;
        	if(ticDoc==null) {
        		//give guest a cookie and let him use it
        		userName = "guest" + System.currentTimeMillis();
        			
        		cookiesCol.insert(BasicDBObjectBuilder.start().add("user", userName).add("ticket", ticket)
        					.add("remote", request.getRemoteAddr()).add("agent", httpReq.getHeader("User-Agent"))
        					.add("created", new Date()).get());
        	} else {
        		userName = (String)ticDoc.get("user");
        	}
        	AuthenticationUtil.setCurrentUser(userName);
        	AuthenticationUtil.setContextUser(sessionedUser);
        	httpReq.getSession().setAttribute(AuthenticationFilter.AUTHENTICATION_USER, userName);
		}
		// pass the request along the filter chain
		chain.doFilter(request, response);
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(fConfig.getServletContext());
		dbProvider = (MongoDBProvider) ctx.getBean("dbProvider");
	}
	
	 public String getCookieTicket(HttpServletRequest httpReq) {
	    	String url = httpReq.getRequestURI();
	    	
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
	    	Cookie cookie = new Cookie(AuthenticationFilter.ARG_TICKET, UUID.randomUUID().toString());
	    	cookie.setMaxAge(60*24*60*60);
	    	cookie.setPath("/");
	    	httpResp.addCookie(cookie);
	    	return cookie;
	   }

	  
}
