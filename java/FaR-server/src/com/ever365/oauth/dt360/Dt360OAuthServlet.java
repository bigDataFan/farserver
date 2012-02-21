package com.ever365.oauth.dt360;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.security.AuthenticationUtil;
import com.ever365.security.CookieService;
import com.ever365.security.SetUserFilter;
import com.ever365.security.User;
import com.ever365.security.UserService;

import sun.security.provider.MD5;

/**
 * Servlet implementation class Dt360OAuthServlet
 */
public class Dt360OAuthServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private UserService userService;
	private MongoDBDataSource dataSource;
	private CookieService cookieService;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Dt360OAuthServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    

	@Override
	public void init(ServletConfig config) throws ServletException {
		// TODO Auto-generated method stub
		super.init(config);
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
		userService = (UserService) ctx.getBean("userService");
		dataSource = (MongoDBDataSource) ctx.getBean("dataSource");
		cookieService = (CookieService)ctx.getBean("cookieService");
	}



	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String name = request.getParameter("name");
		String id = request.getParameter("id");
		String signature = request.getParameter("signature");
		String avatar = request.getParameter("avatar");
		
		
		String md5Result = md5(name + id + avatar + "34cb3c964f6be83d7bf1867f15512b93" + "6c0395ad4fba6ec75574022acc893676");
		
		if (md5Result.equals(signature)) {
			//登录成功
			String userName = "360." + name;
			User eUser = userService.getUser(userName);
			if (eUser==null) {
				boolean random = userService.createUser(userName, "", null, userName, false);
			}
			
			request.getSession().setAttribute(SetUserFilter.AUTHENTICATION_USER, userName);
			AuthenticationUtil.setCurrentAsGuest(false);
    		AuthenticationUtil.setCurrentUser(userName);
    		
    		cookieService.saveUserCookie(request, response, userName);
			request.getSession().removeAttribute("loginError");
			
			if (request.getSession().getAttribute("redirectTo")!=null) {
    			response.sendRedirect((String)request.getSession().getAttribute("redirectTo"));
    			return;
    		} else {
    			response.sendRedirect("/");
    		}
    		return;
		} else {
			response.sendRedirect("/office/login.jsp");
		}
	}

	
	public String md5(String str) {
		String s = str;
		if (s == null) {
			return "";
		} else {
			String value = null;
			MessageDigest md5 = null;
			try {
				md5 = MessageDigest.getInstance("MD5");
			} catch (NoSuchAlgorithmException ex) {
			}
			sun.misc.BASE64Encoder baseEncoder = new sun.misc.BASE64Encoder();
			try {
				value = baseEncoder.encode(md5.digest(s.getBytes("utf-8")));
			} catch (Exception ex) {
			}
			return value;
		}
	}

}
