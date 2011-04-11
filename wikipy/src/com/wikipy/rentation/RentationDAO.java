package com.wikipy.rentation;

import java.util.Date;
import java.util.Map;

import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.wikipy.mongodb.MongoDBDataSource;
import com.wikipy.security.AuthenticationUtil;

public class RentationDAO {

	private MongoDBDataSource dbDataSource;
	
	public void addRentation(String id, String script, String ftl) {
		DBCollection rentationColl = dbDataSource.getMainDB().getCollection("retations");
		
		DBObject one = rentationColl.findOne(BasicDBObjectBuilder.start("name", id).get());
		
		if (one==null) {
			rentationColl.insert(BasicDBObjectBuilder.start("name", id).append("js", script).append("ftl", ftl)
					.append("owner", AuthenticationUtil.getCurrentUser()).append("created", new Date()).get());
		} else {
			
		}
	}
	
	
	public Map<String, Object> getRentation(String id) {
		DBCollection rentationColl = dbDataSource.getMainDB().getCollection("retations");
		DBObject one = rentationColl.findOne(BasicDBObjectBuilder.start("name", id).get());
		
		if (one==null) {
			return null; 
		} else {
			return one.toMap();
		}
	}
	
}
