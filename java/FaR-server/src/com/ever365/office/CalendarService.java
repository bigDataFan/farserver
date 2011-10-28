package com.ever365.office;

import java.util.Map;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;

public class CalendarService {
	
	private MongoDBDataSource dataSource;
	
	
	public void addEntry(Map<String, Object> entry) {
		DB db = dataSource.getDB("calendar");
		DBCollection entryColl = db.getCollection("entries");
		
		entryColl.insert(new BasicDBObject(entry));
	}
}
