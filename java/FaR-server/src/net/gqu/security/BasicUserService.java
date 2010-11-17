package net.gqu.security;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;

import net.gqu.mongodb.MongoDBProvider;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.WriteConcern;
import com.mongodb.WriteResult;

public class BasicUserService {
	
	private Map<String, User> usersMap = new HashMap<String, User>();
	private Map<String, Role> rolesMap = new HashMap<String, Role>();
	
	private String userdb;
	private String adminPassword;
	private String registerPage;
	private String loginPage;
	private String mainPage;
	
	
	public String getMainPage() {
		return mainPage;
	}
	public void setMainPage(String mainPage) {
		this.mainPage = mainPage;
	}
	private MongoDBProvider dbProvider = null;
	
	public MongoDBProvider getDbProvider() {
		return dbProvider;
	}
	
	public BasicUserService() {
		super();
		// TODO Auto-generated constructor stub
	}
	public List<Role> getRoles() {
		DB db = dbProvider.getMainDB();
		DBCollection coll = db.getCollection("roles");
		
		DBCursor cur = coll.find();
		
		List<Role> result = new ArrayList<Role>();
		
		while (cur.hasNext()) {
			DBObject dbo = cur.next();
			result.add(new Role(dbo.toMap()));
		}
		return result;
	}
	
	public List<Role> getOpenRoles() {
		DB db = dbProvider.getMainDB();
		DBCollection coll = db.getCollection("roles");
		
		DBCursor cur = coll.find(new BasicDBObject("isOpen",true));
		
		List<Role> result = new ArrayList<Role>();
		
		while (cur.hasNext()) {
			DBObject dbo = cur.next();
			result.add(new Role(dbo.toMap()));
		}
		return result;
	}
	
	public List<User> getUsers(String role, int first, int max) {
		DB db = dbProvider.getMainDB();
		DBCollection coll = db.getCollection("users");
		DBCursor cursor = coll.find(new BasicDBObject("role", role)).skip(first).limit(max);
		List<User> result = new ArrayList<User>(); 
		while (cursor.hasNext()) {
			DBObject dbo = cursor.next();
			result.add(new User(dbo.toMap()));
		}
		return result;
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
		User adminUser = new User();
		adminUser.setName(AuthenticationUtil.ADMIN_USER_NAME);
		adminUser.setPassword(adminPassword);
		usersMap.put(AuthenticationUtil.ADMIN_USER_NAME, adminUser);
		
	}

	public boolean updateUser(User user) {
		DB db = dbProvider.getMainDB();
		DBCollection coll = db.getCollection("users");
		WriteResult wr = coll.update(new BasicDBObject("name", user.getName()), new BasicDBObject(user.getMap()), true, false);
		return true;
	}
	
	public boolean updateRole(Role role) {
		DB db = dbProvider.getMainDB();
		DBCollection coll = db.getCollection("roles");
		
		if (role.getId()==null) {
			coll.insert(new BasicDBObject(role.getMap()));
		} else {
			
			WriteResult wr = coll.update(new BasicDBObject("_id", role.getId()), new BasicDBObject(role.getMap()), true, false);
		}
		return true;
	}
	
	public Role getRole(String id) {
		if (rolesMap.get(id)!=null) {
			return rolesMap.get(id);
		} else {
			DB db = dbProvider.getMainDB();
			DBCollection rolecoll = db.getCollection("roles");
			DBObject roleDoc = rolecoll.findOne(new BasicDBObject("_id", new ObjectId(id)));
			if (roleDoc==null) {
				return null;
			}
			rolesMap.put(id, new Role(roleDoc.toMap()));
			return rolesMap.get(id);
		}
	}
	public void removeRole(String id) {
		DB db = dbProvider.getMainDB();
		db.getCollection("roles").remove(new BasicDBObject("_id", new ObjectId(id)));
	}
	
	
	public synchronized boolean createRole(String name, long oneFile, long maxSize,  boolean isOpen) {
		if (getRole(name)!=null) {
			return false;
		}
		
		Role role = new Role();
		role.setName(name);
		role.setContentSize(oneFile);
		role.setTotalSize(maxSize);
		role.setOpen(isOpen);
		
		DB db = dbProvider.getMainDB();
		DBCollection rolecoll = db.getCollection("roles");
		rolecoll.save(new BasicDBObject(role.getMap()));
		return true;
	}
	
	public synchronized boolean createUser(String name, String pwd, String roleName, String email) {
		Role role = getRole(roleName);
		
		if (role==null || (!role.isOpen() && !AuthenticationUtil.isCurrentUserAdmin())) {
			return false;
		}
		
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
			user.setRole(roleName);
			user.setDisabled(false);
			BasicDBObject bdo = new BasicDBObject(user.getMap());
			
			WriteResult result = coll.insert(bdo, WriteConcern.SAFE);
			return true;
		} else {
			return false;
		}

		
	}
	
}
