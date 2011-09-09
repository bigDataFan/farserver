package com.ever365.tools;

import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.bson.types.ObjectId;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.rest.registry.RestParam;
import com.ever365.rest.registry.RestService;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.WriteResult;

public class ToolsService {
	
	private MongoDBDataSource dataSource;
	
	
	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
	}

	
	@RestService(method="POST", uri="/tools/addimg")
	public Map<String, Object> clipImages(@RestParam(value="imgs")String imgs) {
		
		String[] imgArray = imgs.split(",");
		
		DBCollection coll = dataSource.getDB("tools").getCollection("images");
		
		BasicDBObject array = new BasicDBObject("images", imgArray);
		
		coll.insert(array);
		
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("id", array.getString("_id").toString());
		return  result;
	}
	
	@RestService(method="GET", uri="/tools/getimgs")
	public Collection<String> getImages(@RestParam(value="id")String id) {
		DBCollection coll = dataSource.getDB("tools").getCollection("images");
		
		DBObject one = coll.findOne(new BasicDBObject("_id", new ObjectId(id)));
		
		return (Collection<String>)one.get("images");
	
	}
}
