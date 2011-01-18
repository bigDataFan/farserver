package net.gqu.security;

import java.io.IOException;

import javax.imageio.spi.ServiceRegistry;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import net.gqu.cache.EhCacheService;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

/**
 * Servlet Filter implementation class SetUserFilter
 */
public class SetUserFilter implements Filter {

	
	public static final String ARG_TICKET = "ticket";
	private EhCacheService cacheService;
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
		AuthenticationUtil.setCurrentAsGuest();
		
		String sessionedUser = (String) httpReq.getSession().getAttribute(AuthenticationFilter.AUTHENTICATION_USER);
		
		if (sessionedUser != null) {
			AuthenticationUtil.setCurrentUser(sessionedUser);
		} else {
			String ticket = getCookieTicket(httpReq);
			if (ticket==null) {
        		ticket = httpReq.getParameter(ARG_TICKET);
        	}
        	if (ticket!=null) {
        		Cache cookieCache = cacheService.getCookieCache();
        		Element element = cookieCache.get(ticket);
        		if (element!=null) {
        			String cachedUser = (String) element.getValue();
        			httpReq.getSession().setAttribute(AuthenticationFilter.AUTHENTICATION_USER, cachedUser);
        			AuthenticationUtil.setCurrentUser(cachedUser);
        		}
        	}
		}
		// pass the request along the filter chain
		chain.doFilter(request, response);
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(fConfig.getServletContext());
		cacheService = (EhCacheService) ctx.getBean("cacheService");
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

}
