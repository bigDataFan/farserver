package com.wikipy.job;

import java.util.Collections;
import java.util.LinkedList;
import java.util.Map;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.wikipy.mongodb.MongoDBDataSource;


public class JobDAO {
	private MongoDBDataSource dataSource;

	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
	}
	
	private LinkedList<Map<String, Object>> jobs = (LinkedList) Collections.synchronizedCollection(new LinkedList<Map<String, Object>>());
	
	
	private void init() {
		if (!dataSource.getMainDB().collectionExists("jobs")) {
			dataSource.getMainDB().createCollection("jobs", new BasicDBObject("capped", true));
		}
	}
	
	public void appendNewJob(Map<String, Object> job) {
		dataSource.getMainDB().getCollection("jobs").insert(new BasicDBObject(job));
		jobs.addLast(job);
	}
	
	public synchronized Map<String, Object> fetchJob() {
		Map<String, Object> peek = jobs.peek();
		
		if (peek == null) {
			loadAll();
			return jobs.peek();
		} 
		return peek;
	}
	
	
	
	public void loadAll() {
		DBCursor cursor = dataSource.getMainDB().getCollection("jobs").find();
		
		while (cursor.hasNext()) {
			jobs.add(cursor.next().toMap());
		}
	}
	
}
