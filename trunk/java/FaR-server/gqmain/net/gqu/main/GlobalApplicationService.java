package net.gqu.main;

import java.util.Date;
import java.util.Map;

import net.gqu.exception.HttpStatusExceptionImpl;
import net.gqu.mongodb.MongoDBProvider;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.WriteConcern;
import com.mongodb.WriteResult;

public class GlobalApplicationService {
	
	
	public static final String GLOBAL_DB = "GlobalDB";
	
	
	private static final String KEY_OWNER = "owner";
	private static final String KEY_NAME = "name";
	private static final String COLL_APPLICATIONS = "applications";
	private MongoDBProvider dbProvider;
	
	public void setDbProvider(MongoDBProvider dbProvider) {
		this.dbProvider = dbProvider;
	}

	public synchronized Application createApplication(String name, String alias,String description, 
			String repisitory, String begin, int stage, int type,String details, String[] categories, String user) {
		
		DB db = dbProvider.getMongo().getDB(GLOBAL_DB);
		DBCollection coll = db.getCollection(COLL_APPLICATIONS);
		DBObject query = new BasicDBObject();
		query.put(KEY_NAME, name);
		
		DBObject one = coll.findOne(query);
		if (one == null) {
			Application application = new Application();
			application.setName(name);
			application.setOwner(user);
			application.setCreated(new Date());
			application.setAlias(alias);
			application.setDescription(description);
			application.setRepository(repisitory);
			application.setStage(stage);
			application.setType(type);
			application.setStart(begin);
			application.setDetails(details);
			application.setCategories(categories);
			BasicDBObject bdo = new BasicDBObject(application.getMaps());
			WriteResult result = coll.insert(bdo, WriteConcern.SAFE);
			return application;
		} else {
			throw new HttpStatusExceptionImpl(409);
		}
	}
	
	public Application updateApplication(String name, String alias,String description, 
			String repisitory, String begin, int stage, int type,String details, String[] categories, String user) {
		DB db = dbProvider.getMongo().getDB(GLOBAL_DB);
		DBCollection coll = db.getCollection(COLL_APPLICATIONS);
		
		
		Map<String, Object> appMap = getApplication(name);
		if (!appMap.get(KEY_OWNER).equals(user)) {
			throw new HttpStatusExceptionImpl(403);
		}
		
		DBObject query = new BasicDBObject();
		query.put(KEY_OWNER, user);
		query.put(KEY_NAME, name);
		
		Application application = new Application();
		application.setName(name);
		application.setOwner(user);
		application.setCreated(new Date());
		application.setAlias(alias);
		application.setDescription(description);
		application.setRepository(repisitory);
		application.setStage(stage);
		application.setType(type);
		application.setStart(begin);
		application.setDetails(details);
		application.setCategories(categories);
		DBObject result = coll.findAndModify(query, null, null, false, new BasicDBObject(application.getMaps()), true, false);
		return application; 
	}

	public Map<String, Object> getApplication(String name) {
		DB db = dbProvider.getMongo().getDB(GLOBAL_DB);
		DBCollection coll = db.getCollection(COLL_APPLICATIONS);
		
		DBObject query = new BasicDBObject();
		query.put(KEY_NAME, name);
		DBObject one = coll.findOne(query);

		Map map = one.toMap();
		map.put("_id", one.get("_id").toString());
		return map;
	}
	
		
}
