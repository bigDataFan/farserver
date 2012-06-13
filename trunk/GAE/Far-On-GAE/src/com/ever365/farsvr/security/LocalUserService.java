package com.ever365.farsvr.security;

import java.util.Map;

import com.ever365.farsvr.utils.HttpUtils;

public class LocalUserService {
	
	public void createUser( String user,
			String p,
			String email,
			Boolean disabled) {
		HttpUtils.get("http://user.ever365.com/service/user/update?u=" + user + "&p=" + p 
				+ "&e=" + email + "&k=Alfresco123");
		
	}
	
	public String getCurrentUserFormCookie(String cookie) {
		return null;
	}
	

	public boolean hasUser(String user) {
		
		Map<String, Object> map = HttpUtils.get("http://user.ever365.com/service/user/has?u=" + user);
		
		return (Boolean)map.get("has");
	}
	
	
	
	
	public boolean checkUserPassword(String user,String p) {
		
		Map<String, Object> map = HttpUtils.get("http://user.ever365.com/service/user/check?u=" + user + "&p=" + p);
		
		return (Boolean)map.get("validate");
	}
	
	
	
	public static void main(String[] args) {
		
		LocalUserService localUserService = new LocalUserService();
		
		localUserService.createUser("liuhan01", "123456", "adfd@dfd.net", true);
		
		System.out.println(localUserService.checkUserPassword("liuhan01", "123456"));
		
		
		
		
	}
	
	
}
