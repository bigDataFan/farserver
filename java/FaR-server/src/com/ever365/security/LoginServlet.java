package com.ever365.security;

import java.io.IOException;
import java.util.Date;
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

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

/**
 * Servlet implementation class LoginServlet
 */
public class LoginServlet extends HttpServlet {
	public static final String HEADER_REFERER = "Referer";
	private static final long serialVersionUID = 1L;
	private UserService userService;
	private MongoDBDataSource dataSource;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet() {
        super();
    }

	@Override
	public void init(ServletConfig config) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
		userService = (UserService) ctx.getBean("userService");
		dataSource = (MongoDBDataSource) ctx.getBean("dataSource");
	}


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = request.getParameter("username");
    	String pwd = request.getParameter("password");
    	
    	if (username==null || pwd==null ) {
    		response.sendError(401);
    		return;
    	}
    	
    	  // Get the authorization header
    	User user = userService.getUser(username);
    	
    	if (user!=null) {
    		if (!pwd.equals(user.getPassword())) {
    			response.sendRedirect("/");
    			return;
    		} else {
    			userService.incLogCount(username);
    			request.getSession().setAttribute(AuthenticationFilter.AUTHENTICATION_USER, username);
    			AuthenticationUtil.setCurrentAsGuest(false);
        		AuthenticationUtil.setCurrentUser(username);
        		
        		String ticket = getCookieTicket(request);
    			if (ticket!=null) {
    				DBCollection cookiesCol = dataSource.getMainDB().getCollection("cookies");
    				DBObject ticDoc = cookiesCol.findOne(new BasicDBObject("ticket", ticket));
    				if (ticDoc!=null && ticket.equals(ticDoc.get("user")))  {
    					ticDoc.put("user", username);
    					cookiesCol.update(new BasicDBObject("ticket", ticket), ticDoc);
    				}
            	}
            	
        		if (AuthenticationUtil.isCurrentUserAdmin()) {
        			response.sendRedirect("/manage/admin.html");
        		} else if (request.getSession().getAttribute(AuthenticationFilter.LOGIN_REFERER)!=null) {
        			String url = (String)request.getSession().getAttribute(AuthenticationFilter.LOGIN_REFERER);
        			request.getSession().removeAttribute(AuthenticationFilter.LOGIN_REFERER);
        			response.sendRedirect(url);
        		} else { 
        			response.sendRedirect("/");
        		}
        		return;
    		}
    	} 
    	response.sendRedirect("/");
	}
	  public Cookie createNewCookie(HttpServletResponse httpResp ) {
	    	Cookie cookie = new Cookie(AuthenticationFilter.ARG_TICKET, UUID.randomUUID().toString());
	    	cookie.setMaxAge(24*60*60);
	    	cookie.setPath("/");
	    	httpResp.addCookie(cookie);
	    	return cookie;
	    }

	  public String getCookieTicket(HttpServletRequest httpReq) {
	    	String url = httpReq.getRequestURI();
	    	
	    	Cookie[] cookies = httpReq.getCookies();
	    	if (cookies!=null) { 
		    	for (Cookie cookie : cookies) {
					if (cookie.getName().equals(SetUserFilter.ARG_TICKET)) {
						return cookie.getValue();
					}
				}
	    	}
	    	return httpReq.getParameter(SetUserFilter.ARG_TICKET);
	    }
	  
}
