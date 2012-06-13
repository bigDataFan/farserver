package com.ever365.farsvr.security;

import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

public class CookieService {

	public static final String ARG_TICKET = "365ticket";
    public static final String ARG_USER = "365user";
	
    private MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
    
    
	private Cookie createNewCookie(HttpServletResponse httpResp) {
		Cookie cookie = new Cookie(ARG_TICKET, SetUserFilter.GUEST
				+ UUID.randomUUID().toString());
		cookie.setMaxAge(60 * 24 * 60 * 60);
		cookie.setPath("/");
		httpResp.addCookie(cookie);
		return cookie;
	}

	public String getCookieTicket(HttpServletRequest httpReq) {
		Cookie[] cookies = httpReq.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(ARG_TICKET)) {
					return cookie.getValue();
				}
			}
		}
		return httpReq.getParameter(ARG_TICKET);
	}

	/**
	 * 为登陆的用户保存cookie和用户名称对应关系
	 * @param request
	 * @param response
	 * @param username
	 */
	public void bindTicketWithUser(String ticket, String username) {
		syncCache.put("ticket." + ticket, username);
	}

	/**
	 * 为任意一个请求分配使用cookie
	 * 
	 * 如果用户携带的cookie曾经登陆过， 则返回此用户
	 * 否则分配为匿名用户
	 * */
	public String provideUser(HttpServletRequest httpReq,
			HttpServletResponse httpResp) {
		String ticket = getOrCreateTicket(httpReq, httpResp);

		Object userName = syncCache.get("ticket." + ticket);
		
		if (userName==null) {
			return ticket;
		} else {
			return (String) userName;
		}
	}

	public String getOrCreateTicket(HttpServletRequest httpReq,
			HttpServletResponse httpResp) {
		String ticket = getCookieTicket(httpReq);
		if (ticket==null) {
			Cookie newCookie = createNewCookie(httpResp);
			ticket = newCookie.getValue();
		}
		return ticket;
	}
	
	
	
	public void removeCookie(HttpServletRequest request, HttpServletResponse response) {
		String ticket = getCookieTicket(request);
		syncCache.delete("ticket." + ticket);
	}
	
}
