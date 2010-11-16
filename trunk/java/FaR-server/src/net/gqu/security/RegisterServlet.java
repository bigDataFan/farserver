package net.gqu.security;

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
import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;


/**
 * Servlet implementation class RegisterServlet
 */
public class RegisterServlet extends HttpServlet {
	private String registerPage;
	
	private Log logger = LogFactory.getLog(RegisterServlet.class);
	
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RegisterServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    private BasicUserService userService;
    private EhCacheService cacheService;
    
	@Override
	public void init(ServletConfig config) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
		userService = (BasicUserService) ctx.getBean("userService");
		cacheService = (EhCacheService) ctx.getBean("cacheService");
		registerPage = userService.getRegisterPage();
	}


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String username = request.getParameter("username");
		String email = request.getParameter("email");
		String password = request.getParameter("pwd");
		String passwordc = request.getParameter("pwdcfm");
		String role = request.getParameter("role");
		Object rndimg = request.getSession().getAttribute(RandomImgServlet.VALIDATE_CODE);
		removeAllAttr(request.getSession());
		logger.debug("register: " + username + "  " +  email + " " + password + "  " );
		if (username==null || username.length()<4 ) {
			request.getSession().setAttribute("error", "invalid user name");
			response.sendRedirect(registerPage);
			return;
		} 
		
		
		if ( password==null || password.length()<6 ) {
			request.getSession().setAttribute("error", "password strenth");
			response.sendRedirect(registerPage);
			return;
		} 
		
		if (passwordc==null || !password.equals(passwordc)) {
			request.getSession().setAttribute("error", "password confirm");
			response.sendRedirect(registerPage);
			return;
		} 
		
		if (email==null) {
			request.getSession().setAttribute("error", "invalid email");
			response.sendRedirect(registerPage);
			return;
		} 
		
		if (request.getParameter("randomimg")==null || !request.getParameter("randomimg").equals(rndimg)) {
			request.getSession().setAttribute("error", "invalid random picture");
			response.sendRedirect(registerPage);
			return;
		}
		
		try {
			if (userService.getUser(username)!=null) {
				request.getSession().setAttribute("error", "username conflict");
				response.sendRedirect(registerPage);
				return;
			}
			
			boolean random = userService.createUser(username, password, role, email);
			User user = userService.getUser(username);
			
			request.getSession().setAttribute(AuthenticationFilter.AUTHENTICATION_USER, user);		
    		Cookie cookie = AuthenticationFilter.createNewCookie(response);
    		Element element = new Element(cookie.getValue(), user);
    		Cache cookieCache = cacheService.getCookieCache();
    		cookieCache.put(element);
    		AuthenticationUtil.setCurrentUser(user);
    		
    		response.getWriter().println("register ok");
    		response.flushBuffer();
    		return;
		} catch (Exception e) {
			response.sendRedirect(registerPage);
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
