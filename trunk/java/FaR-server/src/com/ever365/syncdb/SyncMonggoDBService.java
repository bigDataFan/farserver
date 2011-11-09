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
			updateStored(source, dbcoll, added);
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
	
	
	@RestService(method="POST", uri="/db/sync")
	public Map<String, Object> sync(@RestParam(value="updated")Long updated, @RestParam(value="db") String coll, @RestParam(value="list") String list) {
		try {
			Map<String, Object> result = new HashMap<String, Object>();
			
			
			List<Map<String, Object>> newer = new ArrayList<Map<String,Object>>();
			JSONArray source = new JSONArray(list);
			DBCollection dbcoll = getSyncCollection(coll);
			DBObject query = new BasicDBObject("creator", AuthenticationUtil.getCurrentUserName());
			Map<String, Long> range = new HashMap<String, Long>();
			
			if (updated==null) {
				updated = 0L;
			}
			range.put("$gte", updated);
			query.put("updated", range);
			
			DBCursor cur = dbcoll.find(query);
			
			while (cur.hasNext()) {
				newer.add(cur.next().toMap());
			}
			
			Map<String, String> added = new HashMap<String, String>(); 
			
			updateStored(source, dbcoll, added);
			result.put("added", added);
			result.put("gotten", newer);
			return result;
		} catch (JSONException e) {
			
			e.printStackTrace();
			return null;
		}
		
		
		
	}

	
	private void updateStored(JSONArray source, DBCollection dbcoll,
			Map<String, String> added) throws JSONException {
		for (int i = 0; i < source.length(); i++) {
			JSONObject jso = source.getJSONObject(i);
			
			DBObject dbo = new BasicDBObject(JSONUtils.jsonObjectToMap(jso));
			dbo.put("creator", AuthenticationUtil.getCurrentUserName());
			
			if (dbo.get("_id")!=null) {
				dbcoll.update(new BasicDBObject("_id",new ObjectId((String)dbo.get("_id"))),
						dbo, true, false);
			} else {
				if (dbo.get("_deleted")==null) {
					dbcoll.insert(dbo);
					added.put((String)dbo.get("___id"), ((ObjectId)dbo.get("_id")).toString());
				}
			}
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
