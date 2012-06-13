package com.ever365.farsvr.security;

import java.util.Map;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;

public class UserService {
	
	public static final String COLL_USERS = "users";
	
	private String adminPassword;
	
	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	
	public static final String KEY_USERNAME = "name";
	public static final String KEY_PASSWORD = "password";
	public static final String KEY_EMAIL = "email";
	public static final String KEY_DISABLED = "diabled";
	
	
	public UserService() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	public Map<String, Object> getUser(String name) {
		Query q = new Query(COLL_USERS);
		
		q.addFilter(KEY_USERNAME, Query.FilterOperator.EQUAL, name);
		
		Entity result=null;
		PreparedQuery p = datastore.prepare(q);
		result = p.asSingleEntity();
		
		if (result!=null) {
			return result.getProperties();
		} else {
			return null;
		}
	}
	
	public String getAdminPassword() {
		return adminPassword;
	}

	public void setAdminPassword(String adminPassword) {
		/*
		this.adminPassword = adminPassword;
		User adminUser = new User();
		adminUser.setName(AuthenticationUtil.ADMIN_USER_NAME);
		adminUser.setPassword(adminPassword);
		usersMap.put(AuthenticationUtil.ADMIN_USER_NAME, adminUser);
		*/
	}

	public boolean updateUser(String name, String pwd, String email, boolean disabled) {
		Entity user = new Entity(COLL_USERS, name);
		
		user.setProperty(KEY_USERNAME, name);
		user.setUnindexedProperty(KEY_PASSWORD, pwd);
		user.setProperty(KEY_EMAIL, email);
		user.setProperty(KEY_DISABLED, disabled);
		
		datastore.put(user);
		return true;
	}
	
	public synchronized boolean createUser(String name, String pwd, String email, boolean disabled) {
		Entity user = new Entity(COLL_USERS, name);
		
		user.setProperty(KEY_USERNAME, name);
		user.setUnindexedProperty(KEY_PASSWORD, pwd);
		user.setProperty(KEY_EMAIL, email);
		user.setProperty(KEY_DISABLED, disabled);
		
		datastore.put(user);
		return true;
	}
	
}
