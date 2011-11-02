package com.ever365.syncdb;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	public List<Map<String, Object>> sync(@RestParam(value="time")Long time, @RestParam(value="coll") String coll, @RestParam(value="list") String list) {
		try {
			List<Map<String, Object>> newer = new ArrayList<Map<String,Object>>();
			JSONArray source = new JSONArray(list);
			DBCollection dbcoll = dataSource.getDB("sync").getCollection(coll);
			dbcoll.ensureIndex("creator");
			dbcoll.ensureIndex("updated");
			DBObject query = new BasicDBObject("creator", AuthenticationUtil.getCurrentUserName());
			Map<String, Long> range = new HashMap<String, Long>();
			range.put("$gte", time);
			query.put("updated", range);
			
			DBCursor cur = dbcoll.find(query);
			
			while (cur.hasNext()) {
				newer.add(cur.next().toMap());
			}
			
			for (int i = 0; i < source.length(); i++) {
				JSONObject jso = source.getJSONObject(i);
				
			}
			
			
			return newer;
		} catch (JSONException e) {
			
			e.printStackTrace();
			return null;
		}
		
		
		
	}
	
	
}
