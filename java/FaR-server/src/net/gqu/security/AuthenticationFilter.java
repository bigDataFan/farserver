/*
 * Copyright (C) 2005-2007 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing"
 */

package net.gqu.security;

import java.io.IOException;
import java.util.UUID;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.cache.EhCacheService;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * WebDAV Authentication Filter Class
 * 
 * @author GKSpencer
 */
public class AuthenticationFilter implements Filter
{
    // Debug logging
    public static final String LOGIN_REFERER = "referer";
	private static final String REDIRECT_TO = "_redirectTo";

	private static Log logger = LogFactory.getLog(AuthenticationFilter.class);
    
    // Authenticated user session object name

    public final static String AUTHENTICATION_USER = "_authTicket";

    // Allow an authentication ticket to be passed as part of a request to bypass authentication
    public static final String ARG_TICKET = "ticket";
    
    private EhCacheService cacheService; //ServiceRegistry.getInstance().getCacheService();
    private BasicUserService userService; //ServiceRegistry.getInstance().getUserService();
    // Servlet context
	
	@Override
	public void init(FilterConfig config) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
		userService = (BasicUserService) ctx.getBean("userService");
		cacheService = (EhCacheService) ctx.getBean("cacheService");
	}

    /**
     * Run the authentication filter
     * 
     * @param req ServletRequest
     * @param resp ServletResponse
     * @param chain FilterChain
     * @exception ServletException
     * @exception IOException
     */
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException,
            ServletException
    {
        // Assume it's an HTTP request
        HttpServletRequest httpReq = (HttpServletRequest) req;
        HttpServletResponse httpResp = (HttpServletResponse) resp;

        // Get the user details object from the session
        User user = (User) httpReq.getSession().getAttribute(AUTHENTICATION_USER);
        
        if (user == null)
        {
        	String ticket = getCookieTicket(httpReq);
        	if (ticket==null) {
        		ticket = req.getParameter(ARG_TICKET);
        	}
        	if (ticket!=null) {
        		Cache cookieCache = cacheService.getCookieCache();
        		Element element = cookieCache.get(ticket);
        		if (element!=null) {
        			User cachedUser = (User) element.getValue();
        			httpReq.getSession().setAttribute(AUTHENTICATION_USER, cachedUser);
        			AuthenticationUtil.setCurrentUser(user);
        			chain.doFilter(req, resp);
        			return;
        		}
        	}
        	httpReq.getSession().setAttribute(AuthenticationFilter.LOGIN_REFERER, httpReq.getRequestURI());
        	httpResp.sendRedirect(userService.getLoginPage());
        	return;
        } else {
        	AuthenticationUtil.setCurrentUser(user);
        	chain.doFilter(req, resp);
        }
    }

    
    public static Cookie createNewCookie(HttpServletResponse httpResp ) {
    	Cookie cookie = new Cookie(ARG_TICKET, UUID.randomUUID().toString());
    	cookie.setMaxAge(24*60*60);
    	cookie.setPath("/");
    	httpResp.addCookie(cookie);
    	return cookie;
    }
    
    public String getCookieTicket(HttpServletRequest httpReq) {
    	
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
    
    
    
    /**
     * Cleanup filter resources
     */
    public void destroy()
    {
        // Nothing to do
    }
}
