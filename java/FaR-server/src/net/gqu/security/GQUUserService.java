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
	
	public static final String USERDB = "userdb";
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
	
	public void updateUser() {
		
	}
	
	public synchronized boolean createUser(String name, String pwd, String email) {
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
			user.setDb(USERDB);
			BasicDBObject bdo = new BasicDBObject(user.getMap());
			
			WriteResult result = coll.insert(bdo, WriteConcern.SAFE);
			return true;
		} else {
			return false;
		}

		
	}
	
}
