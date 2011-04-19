package com.wikipy.repository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Map;

import org.bson.types.ObjectId;

import sun.swing.StringUIClientPropertyKey;

import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.wikipy.mongodb.MongoDBDataSource;
import com.wikipy.utils.StringUtils;
import com.wikipy.web.HttpStatusExceptionImpl;

public class RepositoryService {

	private MongoDBDataSource dataSource;
	
	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
	}

	public void appendChildren(String parentQuery, Map<String, Object> obj) {
		DBCollection collection = dataSource.getMainDB().getCollection("items");

		DBObject parent = collection.findOne(new BasicDBObject("_id", new ObjectId(parentQuery)));
		//DBObject parent =collection.findOne(
				
		if (parent!=null) {
			auditCreated(parent, obj);
			collection.insert(BasicDBObjectBuilder.start(obj).get());
		}
	}
	
	public Collection<Map<String, Object>> listChildRen(String parentQuery, Map<String, Object> filter,  int from, int limit, String orderField, String groupBy) {
		DBCollection collection = dataSource.getMainDB().getCollection("items");
		DBObject parent = collection.findOne(BasicDBObjectBuilder.start("_id", new ObjectId(parentQuery)).get());
		
		Collection<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		if (parent!=null) {
			BasicDBObjectBuilder builder;
			
			if (filter!=null) {
				builder = BasicDBObjectBuilder.start(filter).append("_parent_id", parent.get("_id"));
			} else {
				builder = BasicDBObjectBuilder.start("_parent_id", parent.get("_id"));
			}
			DBCursor queryResult = collection.find(builder.get()).skip(from).limit(limit);
			while (queryResult.hasNext()) {
				DBObject dbo = queryResult.next();
				result.add(dbo.toMap());
			}
		}
		return result;
	}
	
	private void auditCreated(DBObject parent, Map<String, Object> obj) {
		obj.put("_parent_id",  parent.get("_id"));
		if (obj.get("_name")==null) {
			obj.put("_name", "noname");
		}
		if (obj.get("_title")==null) {
			obj.put("_title", "未命名标题 ");
		}
		
		for (String specialKey : obj.keySet()) {
			if (specialKey.startsWith("_")) {
				doSpecialKey(specialKey, obj);
			}
		}
		
		obj.put("_path", (String)parent.get("_path") + (String) obj.get("_name") + "/" );
	}
	
	
	private void doSpecialKey(String specialKey, Map<String, Object> obj) {
		if (specialKey.startsWith("_time_")) {
			obj.put(specialKey, StringUtils.parseDateString((String)obj.get(specialKey)));
		}
		
		if (specialKey.startsWith("_int_")) {
			obj.put(specialKey, Integer.parseInt(((String)obj.get(specialKey))));
		}
		
		if (specialKey.startsWith("_float_")) {
			obj.put(specialKey, Float.parseFloat(((String)obj.get(specialKey))));
		}
		
		if (specialKey.startsWith("_unique_")) {
			DBCollection collection = dataSource.getMainDB().getCollection("items");
			
			DBObject one = collection.findOne(BasicDBObjectBuilder.start().append("_parent_id", obj.get("_parent_id"))
					.append(specialKey, obj.get(specialKey)).get());
			
			if (one!=null) {
				throw new HttpStatusExceptionImpl(409);
			}
		}
		
	}

	private void audit(Map<String, Object> obj) {
		
	}
	
}
