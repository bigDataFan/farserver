package com.ever365.security;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.gqu.cache.EhCacheService;
import net.gqu.servlet.RandomImgServlet;
import net.sf.ehcache.Element;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * Servlet implementation class RegisterServlet
 */
public class RegisterServlet extends HttpServlet {
	
	private Log logger = LogFactory.getLog(RegisterServlet.class);
	
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RegisterServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    private UserService userService;
    
	@Override
	public void init(ServletConfig config) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
		userService = (UserService) ctx.getBean("userService");
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
		Object rndimg = request.getSession().getAttribute(RandomImgServlet.VALIDATE_CODE);
		//removeAllAttr(request.getSession());
		logger.debug("register: " + username + "  " +  email + " " + password + "  " );
		if (username==null || username.length()<4 ) {
			request.getSession().setAttribute("registerError", "用户名长度要大于4个字符");
			response.sendRedirect(from);
			return;
		} 
		
		
		if ( password==null || password.length()<6 ) {
			request.getSession().setAttribute("registerError", "密码长度要大于6个字符");
			response.sendRedirect(from);
			return;
		} 
		
		/*
		if (passwordc==null || !password.equals(passwordc)) {
			request.getSession().setAttribute("registerError", "password confirm");
			response.sendRedirect("/");
			return;
		} 
		*/
		if (request.getParameter("randomimg")==null || !request.getParameter("randomimg").equals(rndimg)) {
			request.getSession().setAttribute("registerError", "验证码错误");
			response.sendRedirect(from);
			return;
		}
		
		try {
			if (userService.getUser(username)!=null) {
				request.getSession().setAttribute("registerError", "同名用户已经存在，请更换其他账号");
				response.sendRedirect(from);
				return;
			}
			
			boolean random = userService.createUser(username, password, null, email,false);
			
			request.getSession().setAttribute(AuthenticationFilter.AUTHENTICATION_USER, username);		
    		Cookie cookie = AuthenticationFilter.createNewCookie(response);
    		Element element = new Element(cookie.getValue(), username);
    		AuthenticationUtil.setCurrentUser(username);
    		if (request.getSession().getAttribute("rediretTo")!=null) {
    			response.sendRedirect((String)request.getSession().getAttribute("rediretTo"));
    			return;
    		} else {
    			response.sendRedirect("/");
    		}
    		return;
		} catch (Exception e) {
			response.sendRedirect("/");
			return;
		}
	}


	private void removeAllAttr(HttpSession session) {
		Enumeration l = session.getAttributeNames();
		while (l.hasMoreElements()) {
			String object = (String) l.nextElement();
			session.removeAttribute(object);
		}
	}
	
	  

}
