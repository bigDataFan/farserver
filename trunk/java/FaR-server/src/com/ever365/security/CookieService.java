package com.ever365.security;

import java.util.Date;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

public class CookieService {
	private MongoDBDataSource dataSource;
	
    public static final String ARG_TICKET = "365ticket";
    public static final String ARG_USER = "365user";
	
	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
	}

	  public Cookie createNewCookie(HttpServletResponse httpResp ) {
	    	Cookie cookie = new Cookie(ARG_TICKET, SetUserFilter.GUEST + UUID.randomUUID().toString());
	    	cookie.setMaxAge(60*24*60*60);
	    	cookie.setPath("/");
	    	httpResp.addCookie(cookie);
	    	return cookie;
	   }

	  public Cookie setUserNameCookie(HttpServletResponse httpResp , String userName) {
	    	Cookie cookie = new Cookie(ARG_USER, userName);
	    	cookie.setMaxAge(60*24*60*60);
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
	public void saveUserCookie(HttpServletRequest request,
			HttpServletResponse response, String username) {
		DBCollection cookiesCol = dataSource.getMainDB().getCollection(
				"cookies");

		String ticket = getCookieTicket(request);
		if (ticket != null) {
			DBObject ticDoc = cookiesCol.findOne(new BasicDBObject("ticket",
					ticket));

			if (ticDoc == null) {
				cookiesCol.insert(BasicDBObjectBuilder.start()
						.add("user", username).add("ticket", ticket)
						.add("remote", request.getRemoteAddr())
						.add("agent", request.getHeader("User-Agent"))
						.add("created", new Date()).get());
			} else {
				ticDoc.put("user", username);
				cookiesCol.update(new BasicDBObject("ticket", ticket), ticDoc);
			}
		} else {
			Cookie newCookie = createNewCookie(response);
			ticket = newCookie.getValue();
			cookiesCol.insert(BasicDBObjectBuilder.start()
					.add("user", username).add("ticket", ticket)
					.add("remote", request.getRemoteAddr())
					.add("agent", request.getHeader("User-Agent"))
					.add("created", new Date()).get());

		}
	}

	/**为任意一个请求分配使用用户
	 * 
	 * 如果用户携带的cookie曾经登陆过， 则返回此用户
	 * 否则分配一个匿名用户
	 * */
	public String provideUser(HttpServletRequest httpReq,
			HttpServletResponse httpResp) {
		String sessionedUser;
		String ticket = getCookieTicket(httpReq);
		if (ticket==null) {
			Cookie newCookie = createNewCookie(httpResp);
			ticket = newCookie.getValue();
		}
		DBCollection cookiesCol = dataSource.getMainDB().getCollection("cookies");
		DBObject ticDoc = cookiesCol.findOne(new BasicDBObject("ticket", ticket));
		if(ticDoc==null) {
			//give guest a cookie and let him use it
			sessionedUser = ticket;
				
			cookiesCol.insert(BasicDBObjectBuilder.start().add("user", sessionedUser).add("ticket", ticket)
						.add("remote", httpReq.getRemoteAddr()).add("agent", httpReq.getHeader("User-Agent"))
						.add("created", new Date()).get());
		} else {
			sessionedUser = (String)ticDoc.get("user");
		}
		return sessionedUser;
	}
	
	
	public void removeCookie(HttpServletRequest request, HttpServletResponse response) {
		String ticket = getCookieTicket(request);
    	if (ticket!=null) {
    		DBCollection cookiesCol = dataSource.getMainDB().getCollection("cookies");
        	cookiesCol.remove(new BasicDBObject("ticket", ticket));
    	}
    	
    	
    	Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(ARG_TICKET)) {
					cookie.setValue("");
					cookie.setMaxAge(0);
					cookie.setPath("/");
					response.addCookie(cookie);
				}
			}
		}
	}
	
}
