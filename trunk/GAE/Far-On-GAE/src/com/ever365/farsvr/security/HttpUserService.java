package com.ever365.farsvr.security;

import java.util.Map;

import com.ever365.farsvr.rest.RestParam;
import com.ever365.farsvr.rest.RestService;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

public class HttpUserService {
	
	private UserService userService = new UserService();
	private MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	
	@RestService(method="GET", uri="/user/check")
	public Boolean checkPassword(
			@RestParam(value="user") String user,
			@RestParam(value="p") String key) {
		if (syncCache.contains(user)) {
			if (syncCache.get(user).equals(key)) {
				return true;
			} else {
				return false;
			}
		} else {
			Map<String, Object> userMap = userService.getUser(user);
			if (userMap==null) {
				syncCache.put(user, "Alfresco123");
			} else {
				syncCache.put(user, userMap.get(UserService.KEY_PASSWORD));
			}
			return syncCache.equals(key);
		}
	}
	
	@RestService(method="GET", uri="/user/update")
	public void updateUser(
			@RestParam(value="user") String user,
			@RestParam(value="p") String p,
			@RestParam(value="email") String email,
			@RestParam(value="disabled") Boolean disabled
			) {
		userService.createUser(user, p, email, disabled);
		syncCache.put(user, p);
	}
	
	
	
}
