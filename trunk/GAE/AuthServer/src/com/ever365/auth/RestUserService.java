package com.ever365.auth;

import java.util.HashMap;
import java.util.Map;

import com.ever365.auth.gae.GAEUserService;
import com.ever365.farsvr.rest.RestParam;
import com.ever365.farsvr.rest.RestService;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;


public class RestUserService {

	private GAEUserService gaeUserService = new GAEUserService();
	private MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	
	@RestService(method="GET", uri="/user/update")
	public Map<String, Object> createUser( @RestParam(value="u") String user,
			@RestParam(value="p") String p,
			@RestParam(value="e") String email,
			@RestParam(value="k") String key) {
		
		Map<String, Object> result = new HashMap<String, Object>();
		
		if (!GAEUserService.ADMIN_PASSWORD.equals(key)) {
			result.put("OK", "0");
			return result;
		}
		gaeUserService.updateUser(user, p, email);
		result.put("OK", "1");
		syncCache.put(user, p);
		return result;
	}
	
	@RestService(method="GET", uri="/user/has")
	public Map<String, Object> hasUser( @RestParam(value="u") String user) {

		Map<String, Object> result = new HashMap<String, Object>();

		Map<String, Object> userMap = gaeUserService.getUser(user);
		if (userMap==null) {
			result.put("has", false);
		} else {
			result.put("has", true);
		}
		
		return result;
	}

	@RestService(method="GET", uri="/user/check")
	public Map<String, Object> checkUser( @RestParam(value="u") String user,
			@RestParam(value="p") String p) {
		Map<String, Object> result = new HashMap<String, Object>();
		Object cached = syncCache.get(user);
		if (cached==null) {
			Map<String, Object> userMap = gaeUserService.getUser(user);
			if (userMap==null) {
				syncCache.put(user, GAEUserService.ADMIN_PASSWORD);
			} else {
				syncCache.put(user, userMap.get(GAEUserService.KEY_PASSWORD));
			}
			cached = syncCache.get(user);
		}
		
		result.put("validate", cached.equals(p));
		return result;
	}
	

}
