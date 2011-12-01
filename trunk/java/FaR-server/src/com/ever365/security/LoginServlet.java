package com.ever365.security;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.ever365.collections.mongodb.MongoDBDataSource;

/**
 * Servlet implementation class LoginServlet
 */
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private UserService userService;
	private MongoDBDataSource dataSource;
	private CookieService cookieService;
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
		cookieService = (CookieService)ctx.getBean("cookieService");
	}


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = request.getParameter("username");
    	String pwd = request.getParameter("password");
    	
    	String redirectTo = (request.getSession().getAttribute("redirectTo")==null)?"/":(String)request.getSession().getAttribute("redirectTo");
    	String loginFrom = request.getParameter("from");
    	
    	if (loginFrom!=null && !loginFrom.startsWith("/")) {
    		response.setStatus(400);
    		return;
    	}
    	
    	if (username==null || pwd==null ) {
    		request.getSession().setAttribute("loginError", "请输入用户名和密码");
    		response.sendRedirect(loginFrom);
    		return;
    	}
    	
    	  // Get the authorization header
    	User user = userService.getUser(username);
    	request.getSession().setAttribute("loginError", "用户名或密码错误");
    	
    	if (user!=null) {
    		if (!pwd.equals(user.getPassword())) {
    			response.sendRedirect(loginFrom);
    			return;
    		} else {
    			userService.incLogCount(username);
    			request.getSession().setAttribute(SetUserFilter.AUTHENTICATION_USER, username);
    			AuthenticationUtil.setCurrentAsGuest(false);
        		AuthenticationUtil.setCurrentUser(username);
        		
        		cookieService.saveUserCookie(request, response, username);
        		cookieService.setUserNameCookie(response, username);
        		
    			request.getSession().removeAttribute("loginError");
    			response.sendRedirect(redirectTo);
    			return;
    	
    		}
    	} else {
    		response.sendRedirect(loginFrom);
    	}
	}

	
	  
}
