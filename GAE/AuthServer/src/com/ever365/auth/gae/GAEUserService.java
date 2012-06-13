package com.ever365.auth.gae;

import java.util.Map;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.KeyFactory;

public class GAEUserService {
	
	public static final String COLL_USERS = "users";
	
	public static final String ADMIN_PASSWORD = "Alfresco123";
	
	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	
	public static final String KEY_USERNAME = "name";
	public static final String KEY_PASSWORD = "password";
	public static final String KEY_EMAIL = "email";
	public static final String KEY_DISABLED = "diabled";
	
	
	public GAEUserService() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public Map<String, Object> getUser(String name) {
		try {
			Entity entity = datastore.get(KeyFactory.createKey(COLL_USERS, name));
			return entity.getProperties();
		} catch (EntityNotFoundException e) {
			return null;
		}
	}

	public boolean updateUser(String name, String pwd, String email) {
		
		Entity user = new Entity(COLL_USERS, name);
		
		user.setUnindexedProperty(KEY_PASSWORD, pwd);
		user.setProperty(KEY_EMAIL, email);
		
		datastore.put(user);
		return true;
	}
	
}
