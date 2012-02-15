package com.ever365.syncdb;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.gqu.utils.JSONUtils;

import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.rest.registry.RestParam;
import com.ever365.rest.registry.RestService;
import com.ever365.security.AuthenticationUtil;
import com.ever365.vfile.VFileService;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class SyncMonggoDBService {
	
	private MongoDBDataSource dataSource;
	private VFileService fileService;
	
	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
	}

	public void setFileService(VFileService fileService) {
		this.fileService = fileService;
	}
	
	@RestService(method="GET", uri="/db/config")
	public Map<String, Object> getConfigaration(@RestParam(value="app") String app) {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("user", AuthenticationUtil.getCurrentUserName());
		result.put("now", new Date().getTime());
		
		DBObject query = new BasicDBObject();
		query.put("creator", AuthenticationUtil.getCurrentUserName());
		query.put("app", app);

		DBCursor cur = getConfigCollection().find(query);
		while (cur.hasNext()) {
			DBObject dbo = cur.next();
			result.put((String)dbo.get("name"), dbo.toMap());
		}
		return result;
	}

	@RestService(method="POST", uri="/db/setconfig")
	public void setConfigaration(@RestParam(value="app") String app,
			@RestParam(value="name") String name,
			@RestParam(value="value") String value
			) {
		DBObject dbo = new BasicDBObject();
		dbo.put("creator", AuthenticationUtil.getCurrentUserName());
		dbo.put("app", app);
		dbo.put("name", name);
		dbo.put("value", value);

		DBObject query = new BasicDBObject();
		query.put("creator", AuthenticationUtil.getCurrentUserName());
		query.put("app", app);
		query.put("name", name);
		getConfigCollection().update(query,dbo,true, false);
	}

	@RestService(method="POST", uri="/db/bisync")
	public Map<String, Object> bisync(@RestParam(value="db") String coll, @RestParam(value="list") String list) {
		Map<String, Object> result = new HashMap<String, Object>();
		
		DBCollection dbcoll = getSyncCollection(coll);
		
		
		Map<String, String> added = new HashMap<String, String>(); 
		List<String> removed = new ArrayList<String>();
		try {
			JSONArray source = new JSONArray(list);
			List<String> deleted = new ArrayList<String>();
			for (int i = 0; i < source.length(); i++) {
				JSONObject jso = source.getJSONObject(i);
				
				DBObject dbo = new BasicDBObject(JSONUtils.jsonObjectToMap(jso));
				dbo.put("creator", AuthenticationUtil.getCurrentUserName());
				
				if (dbo.get("_id")!=null) {
					dbo.put("_id", new ObjectId((String)dbo.get("_id")));
					dbcoll.update(new BasicDBObject("_id",dbo.get("_id")),
							dbo, true, false);
					if (dbo.get("_deleted")!=null) {
						deleted.add((String)dbo.get("___id"));
					}
				} else {
					if (dbo.get("_deleted")==null) {
						dbcoll.insert(dbo);
						added.put((String)dbo.get("___id"), ((ObjectId)dbo.get("_id")).toString());
					}
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		DBObject query = new BasicDBObject("creator", AuthenticationUtil.getCurrentUserName());
		
		List<Map<String, Object>> full = new ArrayList<Map<String,Object>>();
		
		DBCursor cur = dbcoll.find(query);
		while (cur.hasNext()) {
			full.add(cur.next().toMap());
		}
		
		result.put("removed", removed);
		result.put("added", added);
		result.put("full", full);
		return result;
	}
	

	
	@RestService(method="GET", uri="/db/sync/query")
	public Map<String, Object> queryUser(@RestParam(value="db") String coll) {
		Map<String, Object> result = new HashMap<String, Object>();
		
		if (AuthenticationUtil.isCurrentUserGuest()) {
			result.put("guest", true);
		} else {
			result.put("user", AuthenticationUtil.getCurrentUser());
			String[] dbnames = coll.split(",");
			for (String name : dbnames) {
				DBCollection dbcoll = getSyncCollection(name);
				//查找自更新时间后的新文档
				DBObject query = new BasicDBObject("creator", AuthenticationUtil.getCurrentUserName());
				result.put(name, dbcoll.count(query));
			}
		}
		return result;
	}
	
	@RestService(method="POST", uri="/db/sync/getall")
	public List<Map<String, Object>> fullGet(@RestParam(value="db") String coll) {
		List<Map<String, Object>> newer = new ArrayList<Map<String,Object>>();
		DBCollection dbcoll = getSyncCollection(coll);
		
		//查找自更新时间后的新文档
		DBObject query = new BasicDBObject("creator", AuthenticationUtil.getCurrentUserName());
		DBCursor cur = dbcoll.find(query);
		
		while (cur.hasNext()) {
			Map one = cur.next().toMap();
			one.remove("_id");
			//one.put("_id", ((ObjectId)one.get("_id")).toString());
			newer.add(one);
		}
		return newer;
	}
	
	@RestService(method="POST", uri="/db/sync/putall")
	public void fullPut(@RestParam(value="db") String coll, @RestParam(value="list") String list) {
		try {
			JSONArray source = new JSONArray(list);
			DBCollection dbcoll = getSyncCollection(coll);
			
			//查找自更新时间后的新文档
			DBObject query = new BasicDBObject("creator", AuthenticationUtil.getCurrentUserName());
			dbcoll.remove(query);
			
			for (int i = 0; i < source.length(); i++) {
				JSONObject jso = source.getJSONObject(i);
				
				DBObject dbo = new BasicDBObject(JSONUtils.jsonObjectToMap(jso));
				if (dbo.containsField("_id")) {
					dbo.removeField("_id");
				}
				dbo.put("creator", AuthenticationUtil.getCurrentUserName());
				dbcoll.insert(dbo);
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	
	@RestService(method="POST", uri="/db/sync")
	public Map<String, Object> sync(@RestParam(value="updated")Long updated, @RestParam(value="db") String coll, @RestParam(value="list") String list) {
		try {
			Map<String, Object> result = new HashMap<String, Object>();
			List<String> deleted = new ArrayList<String>();
			
			List<Map<String, Object>> newer = new ArrayList<Map<String,Object>>();
			JSONArray source = new JSONArray(list);
			DBCollection dbcoll = getSyncCollection(coll);

			
			//查找自更新时间后的新文档
			DBObject query = new BasicDBObject("creator", AuthenticationUtil.getCurrentUserName());
			Map<String, Long> range = new HashMap<String, Long>();
			
			if (updated==null) {
				updated = 0L;
			}
			query.put("updated", range);
			range.put("$gte", updated);
			DBCursor cur = dbcoll.find(query);
			
			while (cur.hasNext()) {
				Map one = cur.next().toMap();
				if (one.get("_deleted")==null) {
					one.put("_id", ((ObjectId)one.get("_id")).toString());
					newer.add(one);
				} else {
					deleted.add((String)one.get("___id"));
				}
			}
			
			Map<String, String> added = new HashMap<String, String>(); 
			for (int i = 0; i < source.length(); i++) {
				JSONObject jso = source.getJSONObject(i);
				
				DBObject dbo = new BasicDBObject(JSONUtils.jsonObjectToMap(jso));
				dbo.put("creator", AuthenticationUtil.getCurrentUserName());
				
				if (dbo.get("_id")!=null) {
					dbo.put("_id", new ObjectId((String)dbo.get("_id")));
					if (dbo.get("_deleted")!=null) {
						dbcoll.remove(new BasicDBObject("_id",dbo.get("_id")));
						deleted.add((String)dbo.get("___id"));
					} else {
						dbcoll.update(new BasicDBObject("_id",dbo.get("_id")),
								dbo, true, false);
					}
				} else {
					if (dbo.get("_deleted")==null) {
						dbcoll.insert(dbo);
						added.put((String)dbo.get("___id"), ((ObjectId)dbo.get("_id")).toString());
					}
				}
			}
			result.put("added", added);
			result.put("updated", newer);
			result.put("deleted", deleted);
			return result;
		} catch (JSONException e) {
			
			e.printStackTrace();
			return null;
		}
	}

	
	private DBCollection getSyncCollection(String coll) {
		DBCollection dbcoll = dataSource.getDB("sync").getCollection(coll);
		dbcoll.ensureIndex("creator");
		dbcoll.ensureIndex("updated");
		return dbcoll;
	}
	
	private DBCollection getConfigCollection() {
		DBCollection dbcoll = dataSource.getDB("sync").getCollection("config");
		dbcoll.ensureIndex("creator");
		dbcoll.ensureIndex("app");
		return dbcoll;
	}
	
	
}
