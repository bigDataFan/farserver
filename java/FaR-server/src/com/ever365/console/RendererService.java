package com.ever365.console;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class RendererService {
	
	private MongoDBDataSource dataSource;

	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
	}
	
	
	public String getViewRenderFTL(String name) {
		DBCollection coll = dataSource.getMainDB().getCollection("renderers");
		
		DBObject dbo = coll.findOne(new BasicDBObject("collection", name));
		if (dbo==null) {
			return "";
		} else {
			return (String)dbo.get("ftl");
		}
	}
	

	public void setViewRenderFTL(String name, String ftl) {
		DBCollection coll = dataSource.getMainDB().getCollection("renderers");
		
		DBObject dbo = new BasicDBObject();
		dbo.put("collection", name);
		dbo.put("ftl", ftl);
		coll.update(new BasicDBObject("collection", name), dbo, true, true);
	}
	
	public List<Map<String, String>> getAllFTL() {
		DBCollection coll = dataSource.getMainDB().getCollection("renderers");
		DBCursor cursor = coll.find();
		List<Map<String, String>> result = new ArrayList<Map<String,String>>();
		
		while (cursor.hasNext()) {
			Map<String, String> m = new HashMap<String, String>();
			DBObject dbo = cursor.next();
			
			m.put("collection", (String)dbo.get("collection"));
			m.put("ftl", (String)dbo.get("ftl"));
			
			result.add(m);
		}
		
		return result;
		
	}
	
	
	
}
