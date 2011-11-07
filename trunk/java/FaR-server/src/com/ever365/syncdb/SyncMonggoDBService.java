package com.ever365.syncdb;

import java.util.ArrayList;
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

	@RestService(method="POST", uri="/db/sync")
	public Map<String, Object> sync(@RestParam(value="updated")Long updated, @RestParam(value="db") String coll, @RestParam(value="list") String list) {
		try {
			Map<String, Object> result = new HashMap<String, Object>();
			
			List<Map<String, Object>> newer = new ArrayList<Map<String,Object>>();
			JSONArray source = new JSONArray(list);
			DBCollection dbcoll = dataSource.getDB("sync").getCollection(coll);
			dbcoll.ensureIndex("creator");
			dbcoll.ensureIndex("updated");
			DBObject query = new BasicDBObject("creator", AuthenticationUtil.getCurrentUserName());
			Map<String, Long> range = new HashMap<String, Long>();
			range.put("$gte", updated);
			query.put("updated", range);
			
			DBCursor cur = dbcoll.find(query);
			
			while (cur.hasNext()) {
				newer.add(cur.next().toMap());
			}
			
			Map<String, String> ids = new HashMap<String, String>(); 
			
			List<String> removed = new ArrayList<String>();
			for (int i = 0; i < source.length(); i++) {
				JSONObject jso = source.getJSONObject(i);
				
				DBObject dbo = new BasicDBObject(JSONUtils.jsonObjectToMap(jso));
				dbo.put("creator", AuthenticationUtil.getCurrentUserName());
				
				if (dbo.get("_deleted")!=null && dbo.get("_id")!=null) {
					dbcoll.remove(new BasicDBObject("_id", new ObjectId((String)dbo.get("_id"))));
					removed.add(dbo.get("_id").toString());
				} else if (dbo.get("_id")!=null) {
					dbcoll.update(new BasicDBObject("_id",new ObjectId((String)dbo.get("_id"))),
							dbo, true, false);
				} else {
					dbcoll.insert(dbo);
					ids.put((String)dbo.get("___id"), ((ObjectId)dbo.get("_id")).toString());
				}
				
			}
			result.put("removed", removed);
			result.put("ids", ids);
			result.put("gotten", newer);
			return result;
		} catch (JSONException e) {
			
			e.printStackTrace();
			return null;
		}
		
		
		
	}
	
	
}
