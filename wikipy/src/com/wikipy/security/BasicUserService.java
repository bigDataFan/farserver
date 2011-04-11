package com.wikipy.security;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.bson.types.ObjectId;

import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.WriteConcern;
import com.mongodb.WriteResult;
import com.wikipy.mongodb.MongoDBDataSource;

public class BasicUserService {
	
	private static final String KEY_ROLES = "roles";
	private static final String COLL_USERS = "users";

	private Map<String, User> usersMap = new HashMap<String, User>();
	private Map<String, Role> rolesMap = new HashMap<String, Role>();
	
	private String userdb;
	private String adminPassword;
	
	
	/*
	public String getMainPage() {
		DB maindb = dbProvider.getMainDB();
		
		DBCollection coll = maindb.getCollection("firstpages");
		
		Map<String, Object> maps = new HashMap<String, Object>();
		
		maps.put("user", AuthenticationUtil.getCurrentUser());
		maps.put("active", true);
		
		DBObject result = coll.findOne(new BasicDBObject(maps));
		
		if (result!=null) {
			return (String) result.get("defaultapp");
		} else {
			maps.put("defaultapp", applicationService.getDefaultApp());
			coll.insert(new BasicDBObject(maps));
			return applicationService.getDefaultApp();
		}
		//return mainPage;
	}
	*/
	
	private MongoDBDataSource mdbDataSource = null;
	
	public BasicUserService() {
		super();
		// TODO Auto-generated constructor stub
	}
	public List<Role> getRoles() {
		DB db = mdbDataSource.getMainDB();
		DBCollection coll = db.getCollection(KEY_ROLES);
		
		DBCursor cur = coll.find();
		
		List<Role> result = new ArrayList<Role>();
		
		while (cur.hasNext()) {
			DBObject dbo = cur.next();
			result.add(new Role(dbo.toMap()));
		}
		return result;
	}
	
	public List<Role> getOpenRoles() {
		DB db = mdbDataSource.getMainDB();
		DBCollection coll = db.getCollection(KEY_ROLES);
		
		DBCursor cur = coll.find(new BasicDBObject(Role.KEY_OPEN,true));
		
		List<Role> result = new ArrayList<Role>();
		
		while (cur.hasNext()) {
			DBObject dbo = cur.next();
			result.add(new Role(dbo.toMap()));
		}
		return result;
	}
	
	
	
	public Map<String, Object> getUsersJsonMap(String sort, String order, int first, int max) {
		DB db = mdbDataSource.getMainDB();
		DBCollection coll = db.getCollection(COLL_USERS);
		
		DBCursor cursor = coll.find();
		if (sort!=null && order!=null) {
			if (order.equals("asc")) {
				cursor.sort(new BasicDBObject(sort, 1));
			} else {
				cursor.sort(new BasicDBObject(sort, -1));
			}
		}
		cursor.skip(first).limit(max);
		
		Map<String, Object> result = new HashMap<String, Object>();
		
		result.put("total", cursor.count());
		
		List<Map<String, Object>> usersList = new ArrayList<Map<String,Object>>();
		
		while (cursor.hasNext()) {
			DBObject dbo = cursor.next();
			usersList.add(dbo.toMap());
		}
		result.put("rows", usersList);
		return result;
	}

	
	public List<User> getUsers(String sort, String order, int first, int max) {
		DB db = mdbDataSource.getMainDB();
		DBCollection coll = db.getCollection(COLL_USERS);
		
		DBCursor cursor = coll.find();
		if (sort!=null && order!=null) {
			if (order.equals("asc")) {
				cursor.sort(new BasicDBObject(sort, 1));
			} else {
				cursor.sort(new BasicDBObject(sort, -1));
			}
		}
		cursor.skip(first).limit(max);
		List<User> result = new ArrayList<User>(); 
		while (cursor.hasNext()) {
			DBObject dbo = cursor.next();
			result.add(new User(dbo.toMap()));
		}
		
		return result;
	}


	
	
	public List<User> getUsers(String role, int first, int max) {
		DB db = mdbDataSource.getMainDB();
		DBCollection coll = db.getCollection(COLL_USERS);
		DBCursor cursor = coll.find(new BasicDBObject("role", role)).skip(first).limit(max);
		List<User> result = new ArrayList<User>(); 
		while (cursor.hasNext()) {
			DBObject dbo = cursor.next();
			result.add(new User(dbo.toMap()));
		}
		return result;
	}

	
	public void setDbProvider(MongoDBDataSource dbProvider) {
		this.mdbDataSource = dbProvider;
	}

	public User getUser(String name) {
		if (usersMap.get(name)!=null) {
			return usersMap.get(name);
		} else {
			DB db = mdbDataSource.getMainDB();
			DBCollection coll = db.getCollection(COLL_USERS);
			
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
	
	private HashMap<String, DB> userdbs = new HashMap<String, DB>();
	
	public DB getUserDB(String userName) {
		
		if (userdbs.get(userName)==null) {
			DB maindb = mdbDataSource.getMainDB();
			
			DBCollection mapingColl = maindb.getCollection("dbmappings");
			
			DBObject mapdoc = mapingColl.findOne(new BasicDBObject("user", userName));
			
			String dbname = "datadb";
			if (mapdoc==null) {
				mapingColl.insert(BasicDBObjectBuilder.start().append("user", userName).append("db", dbname).get());
			} else {
				dbname = (String) mapdoc.get("db");
			}
			userdbs.put(userName, mdbDataSource.getMongo().getDB(dbname));
		}
		return userdbs.get(userName);
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
		this.usersMap.remove(user.getName());
		DB db = mdbDataSource.getMainDB();
		DBCollection coll = db.getCollection(COLL_USERS);
		WriteResult wr = coll.update(new BasicDBObject("name", user.getName()), new BasicDBObject(user.getMap()), true, false);
		return true;
	}
	
	public boolean updateRole(Role role) {
		
		DB db = mdbDataSource.getMainDB();
		DBCollection coll = db.getCollection(KEY_ROLES);
		
		if (role.getId()==null) {
			coll.insert(new BasicDBObject(role.getMap()));
		} else {
			this.rolesMap.remove(role.getId().toString());
			WriteResult wr = coll.update(new BasicDBObject("_id", role.getId()), new BasicDBObject(role.getMap()), true, false);
		}
		return true;
	}
	
	public Role getRole(String id) {
		if (id==null) return null;
		if (rolesMap.get(id)!=null) {
			return rolesMap.get(id);
		} else {
			DB db = mdbDataSource.getMainDB();
			DBCollection rolecoll = db.getCollection(KEY_ROLES);
			DBObject roleDoc = rolecoll.findOne(new BasicDBObject("_id", new ObjectId(id)));
			if (roleDoc==null) {
				return null;
			}
			rolesMap.put(id, new Role(roleDoc.toMap()));
			return rolesMap.get(id);
		}
	}
	
	public void removeRole(String id) {
		DB db = mdbDataSource.getMainDB();
		db.getCollection(KEY_ROLES).remove(new BasicDBObject("_id", new ObjectId(id)));
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

		DB db = mdbDataSource.getMainDB();
		DBCollection rolecoll = db.getCollection(KEY_ROLES);
		rolecoll.save(new BasicDBObject(role.getMap()));
		return true;
	}
	
	public synchronized boolean createUser(String name, String pwd, String roleName, String email, boolean disabled) {
		Role role = getRole(roleName);
		
		if (role==null || (!role.isOpen() && !AuthenticationUtil.isCurrentUserAdmin())) {
			return false;
		}
		
		DB db = mdbDataSource.getMainDB();
		DBCollection coll = db.getCollection(COLL_USERS);
		
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
			user.setLogined(0);
			user.setContentUsed(0);
			user.setDisabled(false);
			BasicDBObject bdo = new BasicDBObject(user.getMap());
			
			WriteResult result = coll.insert(bdo, WriteConcern.SAFE);
			return true;
		} else {
			return false;
		}
	}
	
	/*
	public void incUserUsage(String name, long size) {
		User user = getUser(name);
		
		if (size>0) {
			Role role = getRole(user.getRole());
			if (role==null) {
				throw new HttpStatusExceptionImpl(504);
			}
			if (size>role.getTotalSize() || (size + user.getContentUsed())>role.getTotalSize()) {
				throw new HttpStatusExceptionImpl(503);
			}
		}
		user.setContentUsed(user.getContentUsed()+size);
		DB db = dbProvider.getMainDB();
		BasicDBObject inc = new BasicDBObject();
		Map<String, Long> zz = new HashMap<String, Long>();
		zz.put("contentused", size);
		inc.put("$inc", zz);
		db.getCollection(COLL_USERS).update(new BasicDBObject("name", name), inc);
	}
	*/
	
	public void incLogCount(String name) {
		DB db = mdbDataSource.getMainDB();
		BasicDBObject inc = new BasicDBObject();
		Map<String, Long> zz = new HashMap<String, Long>();
		zz.put("logined", new Long(1));
		inc.put("$inc", zz);
		db.getCollection(COLL_USERS).update(new BasicDBObject("name", name), inc);
	}
	
	
	
	/*
	public String getUserCalToken(String server) {
		String requestUrl =
			  AuthSubUtil.getRequestUrl(server + "/service/user/retrievetoken",
			                            "https://www.google.com/calendar/feeds/",
			                            false,
			                            false);
		return requestUrl;
	}
	*/
	
	
}
