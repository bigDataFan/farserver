package com.ever365.farsvr.security;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class LoginServlet
 */
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private LocalUserService localUserService;
	private CookieService cookieService;
	
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet() {
        super();
    }

	@Override
	public void init(ServletConfig config) throws ServletException {
		localUserService = new LocalUserService();
		cookieService = new CookieService();
	}


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = request.getParameter("username");
    	String pwd = request.getParameter("password");
    	
    	String redirectTo = (request.getSession().getAttribute("redirectTo")==null)?"/":(String)request.getSession().getAttribute("redirectTo");
    	String loginFrom = request.getParameter("from");
    	
    	
    	if (username==null || pwd==null ) {
    		request.getSession().setAttribute("loginError", 1);
    		response.sendRedirect("/login.jsp?error=undefined");
    		return;
    	}
    	
    	
    	boolean checked = localUserService.checkUserPassword(username, pwd);
    	
    	
    	if (checked) {
    		String ticket = cookieService.getOrCreateTicket(request, response);
    		cookieService.bindTicketWithUser(ticket, username);
    		request.getSession().setAttribute(SetUserFilter.AUTHENTICATION_USER, username);
    		response.sendRedirect("/");
    	} else {
    		response.sendRedirect("/login.jsp?error=undefined");
    	}
	}

	
	  
}
