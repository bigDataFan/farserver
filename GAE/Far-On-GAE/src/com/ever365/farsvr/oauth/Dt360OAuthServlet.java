package com.ever365.farsvr.oauth;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ever365.farsvr.security.AuthenticationUtil;
import com.ever365.farsvr.security.CookieService;
import com.ever365.farsvr.security.SetUserFilter;
import com.ever365.farsvr.security.User;
import com.ever365.farsvr.utils.HttpUtils;

/**
 * Servlet implementation class Dt360OAuthServlet
 */
public class Dt360OAuthServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Dt360OAuthServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    CookieService cookieService;

    private String client_id;
    private String client_secret;
    private String redirect_uri;
	@Override
	public void init(ServletConfig config) throws ServletException {
		// TODO Auto-generated method stub
		cookieService = new CookieService();
		client_id = config.getInitParameter("key");
		client_secret = config.getInitParameter("secret");
		redirect_uri = config.getInitParameter("uri");
		
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String code = request.getParameter("code");
		if (code==null) {
			response.sendRedirect("/");
			return;
		}
		
		try {
			String url = "https://openapi.360.cn/oauth2/access_token?grant_type=authorization_code" 
					+ "&code=" + code 
					+ "&client_id=" + client_id 
					+ "&client_secret=" + client_secret
					+ "&redirect_uri=" + redirect_uri;
	
			
			Map<String, Object> result = HttpUtils.get(url);
			
			String userInfoUrl = "https://openapi.360.cn/user/me.json?access_token=" + result.get("access_token");
			
			Map<String, Object> info = HttpUtils.get(userInfoUrl);
			
			
			String ticket = cookieService.getOrCreateTicket(request, response);
			
			String userName = "360." + info.get("name");
			cookieService.bindTicketWithUser(ticket, userName);
			request.getSession().setAttribute(SetUserFilter.AUTHENTICATION_USER, userName);
			response.sendRedirect("/");
			
		} catch (Exception e) {
			response.getWriter().print(e.getMessage());
		}
		
	}
	 
}
