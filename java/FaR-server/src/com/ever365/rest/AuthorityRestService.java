package com.ever365.rest;

import java.util.HashMap;
import java.util.Map;

import com.ever365.rest.registry.RestService;
import com.ever365.security.AuthenticationUtil;

public class AuthorityRestService {
	
	@RestService(method="GET", uri="/authority/hi")
	public String hi() {
		return "hi";
	}
	
	
	@RestService(method="GET", uri="/authority/current")
	public Map<String, Object> currentUser() {
		String userName = AuthenticationUtil.getCurrentUser();
		
		Map<String, Object> result  = new HashMap<String, Object>();
		
		result.put("userName", userName);
		
		return result;
	}
	
	
}
