package net.gqu.security;

import java.util.HashMap;
import java.util.Map;

import net.gqu.mongodb.MongoDBProvider;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.WriteConcern;
import com.mongodb.WriteResult;

public class GQUUserService {
	
	private Map<String, User> usersMap = new HashMap<String, User>();
	
	private String userdb;
	private String adminPassword;
	private String registerPage;
	private String loginPage;
	
	private MongoDBProvider dbProvider = null;
	
	public MongoDBProvider getDbProvider() {
		return dbProvider;
	}

	public void setDbProvider(MongoDBProvider dbProvider) {
		this.dbProvider = dbProvider;
	}

	public User getUser(String name) {
		if (usersMap.get(name)!=null) {
			return usersMap.get(name);
		} else {
			DB db = dbProvider.getMainDB();
			DBCollection coll = db.getCollection("users");
			
			DBObject query = new BasicDBObject();
			query.put("name", name);
			
			DBObject one = coll.findOne(query);
			
			if (one!=null) {
				User user = new User(one.toMap());
				usersMap.put(name, user);
				return user;
			} else {
				usersMap.put(name, null);
				return null;
			}
		}
	}

	
	
	public String getLoginPage() {
		return loginPage;
	}

	public void setLoginPage(String loginPage) {
		this.loginPage = loginPage;
	}

	public String getRegisterPage() {
		return registerPage;
	}

	public void setRegisterPage(String registerPage) {
		this.registerPage = registerPage;
	}

	public String getUserdb() {
		return userdb;
	}

	public void setUserdb(String userdb) {
		this.userdb = userdb;
	}

	public String getAdminPassword() {
		return adminPassword;
	}

	public void setAdminPassword(String adminPassword) {
		this.adminPassword = adminPassword;
	}

	public void updateUser() {
		
	}
	
	public synchronized boolean createUser(String name, String pwd, String role, String email) {
		DB db = dbProvider.getMainDB();
		DBCollection coll = db.getCollection("users");
		
		DBObject query = new BasicDBObject();
		query.put("name", name);
		
		DBObject one = coll.findOne(query);
		if (one == null) {
			User user = new User();
			user.setName(name);
			user.setPassword(pwd);
			user.setEmail(email);
			user.setDb(userdb);
			BasicDBObject bdo = new BasicDBObject(user.getMap());
			
			WriteResult result = coll.insert(bdo, WriteConcern.SAFE);
			return true;
		} else {
			return false;
		}

		
	}
	
}
