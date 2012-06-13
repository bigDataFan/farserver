package com.ever365.farsvr.security;

import java.io.IOException;
import java.util.regex.Pattern;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class RegisterServlet
 */
public class RegisterServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	private static Pattern userIdPattern;
	private static Pattern emailPattern;
	private CookieService cookieService;
	private LocalUserService localUserService;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RegisterServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
	@Override
	public void init(ServletConfig config) throws ServletException {
		localUserService = new LocalUserService();
		cookieService = new CookieService();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String username = request.getParameter("username");
		String email = request.getParameter("email");
		String password = request.getParameter("pwd");
		String passwordc = request.getParameter("pwdcfm");
		String from = request.getParameter("from");
		
		if (!from.startsWith("/")) {
			response.setStatus(400);
			return;
		}
		
		if (username==null || username.length()<4 || !isUserId(username)) {
			response.sendRedirect("/register.jsp?error=exist");
			return;
		} 
		
		if (email==null || !isEmail(email)) {
			response.sendRedirect("/register.jsp?error=exist");
			return;
		}
		
		if ( password==null || password.length()<6 ) {
			response.sendRedirect("/register.jsp?error=exist");
			return;
		} 
		
		try {
			if (localUserService.hasUser(username)) {
				response.sendRedirect("/register.jsp?error=exist");
				return;
			}
			
			localUserService.createUser(username, password, email, false);
			cookieService.bindTicketWithUser(cookieService.getOrCreateTicket(request, response), username);
			
			request.getSession().setAttribute(SetUserFilter.AUTHENTICATION_USER, username);
			AuthenticationUtil.setCurrentAsGuest(false);
    		AuthenticationUtil.setCurrentUser(username);
    		
			response.sendRedirect("/");
    		return;
		} catch (Exception e) {
			response.sendRedirect("/");
			return;
		}
	}
	
	  
	public static boolean isUserId(String userId) {
		if (userIdPattern==null) {
			userIdPattern = Pattern.compile("^[a-zA-Z][a-zA-Z0-9_]{4,15}$");
		}
		return userIdPattern.matcher(userId).find();
	}
	
	public static boolean isEmail(String email) {
		if (emailPattern==null) {
			String regStr = "\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
			emailPattern = Pattern.compile(regStr);
		}
		return emailPattern.matcher(email).find();
	}
	
	
	

}
