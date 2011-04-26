package com.wikipy.repository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.bson.types.ObjectId;

import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.wikipy.mongodb.MongoDBDataSource;
import com.wikipy.utils.StringUtils;
import com.wikipy.web.HttpStatusExceptionImpl;

public class RepositoryService {

	public static final String PROP_ID = "_id";

	public static final String PROP_PARENT_ID = "_parent_id";

	public static final String PROP_PATH = "_path";

	public static final String PROP_TITLE = "_title";

	public static final String PROP_NAME = "_name";

	public static final String PROP_ASPECT = "_aspect";
	
	private MongoDBDataSource dataSource;
	
	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
	}

	public void appendChildren(String parentQuery, Map<String, Object> obj) {
		DBCollection collection = dataSource.getMainDB().getCollection("items");

		DBObject parent = collection.findOne(new BasicDBObject(PROP_ID, new ObjectId(parentQuery)));
		//DBObject parent =collection.findOne(
				
		if (parent!=null) {
			auditCreated(parent, obj);
			collection.insert(BasicDBObjectBuilder.start(obj).get());
		}
	}
	
	
	
	public void updateProp(String id, String prop, Object newval) {
		DBCollection collection = dataSource.getMainDB().getCollection("items");
		collection.update(new BasicDBObject(PROP_ID, new ObjectId(id)), new BasicDBObject("$push", 
				new BasicDBObject(PROP_ASPECT, newval)));
	}
	
	public void addAspect(String id, String aspect) {
		DBCollection collection = dataSource.getMainDB().getCollection("items");
		collection.update(new BasicDBObject(PROP_ID, new ObjectId(id)), new BasicDBObject("$push", 
				new BasicDBObject(PROP_ASPECT, aspect)));
	}
	
	public void removeAspect(String id, String aspect) {
		DBCollection collection = dataSource.getMainDB().getCollection("items");
		collection.update(new BasicDBObject(PROP_ID, new ObjectId(id)), new BasicDBObject("$pull", 
				new BasicDBObject(PROP_ASPECT, aspect)));
	}

	public boolean hasAspect(String id, String aspect) {
		DBCollection collection = dataSource.getMainDB().getCollection("items");
		return  (collection.findOne(new BasicDBObject(PROP_ID, new ObjectId(id)).append(PROP_ASPECT, aspect)))!=null;
	}
	
	public Map getItem(String id) {
		DBCollection collection = dataSource.getMainDB().getCollection("items");
		DBObject item = collection.findOne(new BasicDBObject(PROP_ID, new ObjectId(id)));
		return (item==null)?null:item.toMap();
	}
	
	public long getChildrenCount(String parentQuery, Map<String, Object> filter) {
		DBCollection collection = dataSource.getMainDB().getCollection("items");
		
		BasicDBObjectBuilder builder;
		if (filter!=null) {
			builder = BasicDBObjectBuilder.start(filter).append(PROP_PARENT_ID, new ObjectId(parentQuery));
		} else {
			builder = BasicDBObjectBuilder.start(PROP_PARENT_ID, new ObjectId(parentQuery));
		}
		
		return collection.getCount(builder.get());
	}
	
	
	public Collection<Map<String, Object>> selectItems(Map m) {
		DBCollection collection = dataSource.getMainDB().getCollection("items");
		DBCursor cursor = collection.find(new BasicDBObject(m));
		
		Collection<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		while (cursor.hasNext()) {
			result.add(cursor.next().toMap());
		}
		
		return result;
	}
	
	public Collection<Map<String, Object>> listChildRen(String parentQuery, Map<String, Object> filter,  int from, int limit, String orderField, String groupBy) {
		DBCollection collection = dataSource.getMainDB().getCollection("items");
		DBObject parent = collection.findOne(BasicDBObjectBuilder.start(PROP_ID, new ObjectId(parentQuery)).get());
		
		Collection<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		if (parent!=null) {
			BasicDBObjectBuilder builder;
			
			if (filter!=null) {
				builder = BasicDBObjectBuilder.start(filter).append(PROP_PARENT_ID, parent.get(PROP_ID));
			} else {
				builder = BasicDBObjectBuilder.start(PROP_PARENT_ID, parent.get(PROP_ID));
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
		obj.put(PROP_PARENT_ID,  parent.get(PROP_ID));
		if (obj.get(PROP_NAME)==null) {
			obj.put(PROP_NAME, "noname");
		}
		if (obj.get(PROP_TITLE)==null) {
			obj.put(PROP_TITLE, "未命名标题 ");
		}
		
		for (String specialKey : obj.keySet()) {
			if (specialKey.startsWith("_")) {
				doSpecialKey(specialKey, obj);
			}
		}
		
		obj.put(PROP_PATH, (String)parent.get(PROP_PATH) + (String) obj.get(PROP_NAME) + "/" );
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
			
			DBObject one = collection.findOne(BasicDBObjectBuilder.start().append(PROP_PARENT_ID, obj.get(PROP_PARENT_ID))
					.append(specialKey, obj.get(specialKey)).get());
			
			if (one!=null) {
				throw new HttpStatusExceptionImpl(409);
			}
		}
		
	}

	private void audit(Map<String, Object> obj) {
		
	}
	
}