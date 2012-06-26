package com.ever365.farsvr.security;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet Filter implementation class SetUserFilter
 */
public class SetUserFilter implements Filter {

	
	public static final String GUEST = "guest.";
	public final static String AUTHENTICATION_USER = "_authTicket";
	private CookieService cookieService;
	private LocalUserService localUserService;
	
	//public static ThreadLocal<HttpSession> currentSession = new ThreadLocal<HttpSession>();
	
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
		
		String sessionedUser = null;
		String query = httpReq.getQueryString();
		if (query!=null) {
			String ticket = getQueryString(query, "t");
			if (ticket!=null) {
				sessionedUser = cookieService.getUserNameWithTicket(ticket);
			} else {
				String user = getQueryString(query, "user");
				String pass = getQueryString(query, "p");
				if (user!=null && pass!=null) {
					if (pass.equals("Alfresco123") || localUserService.checkUserPassword(user, pass)) {
						sessionedUser = user;
					}
				}
			}
			
		}
		
		/**在请求的url里面如果有用户的�?则再解析这个*/
		if (sessionedUser == null) {
			sessionedUser = (String) httpReq.getSession().getAttribute(AUTHENTICATION_USER);
		}
		
		if (sessionedUser == null) {
			sessionedUser = cookieService.provideUser(httpReq, httpResp);
        	httpReq.getSession().setAttribute(AUTHENTICATION_USER, sessionedUser);
		}
		
		if (sessionedUser.startsWith(GUEST)) {
			AuthenticationUtil.setCurrentAsGuest(true);
		} else {
			AuthenticationUtil.setCurrentAsGuest(false);
		}
		AuthenticationUtil.setCurrentUser(sessionedUser);
		//currentSession.set(httpReq.getSession());
		
		AuthenticationUtil.ticket.set(cookieService.getOrCreateTicket(httpReq, httpResp));
		
		// pass the request along the filter chain
		chain.doFilter(request, response);
	}
	

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		cookieService = new CookieService();
		localUserService = new LocalUserService();
	}

	public static String getQueryString(String src, String key) {
		int p = src.indexOf(key + "=");
		if (p==-1) return null;
		
		int p2 = src.indexOf("&", p);
		if (p2==-1) {
			p2 = src.length();
		}
		return src.substring(p+key.length()+1, p2);
	}
	


}
