package com.wikipy.job;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.wikipy.mongodb.MongoDBDataSource;

public class JobDAO {
	private MongoDBDataSource dataSource;

	private String jobCollection;
	
	
	
	public void setJobCollection(String jobCollection) {
		this.jobCollection = jobCollection;
	}

	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
	}
	
	private LinkedList<Map<String, Object>> jobs = new LinkedList<Map<String, Object>>();
	
	
	public void init() {
		if (!dataSource.getMainDB().collectionExists(jobCollection)) {
			dataSource.getMainDB().createCollection(jobCollection, new BasicDBObject("capped", true));
		}
	}
	
	public List<Map<String, Object>> listAllJobs() {
		
		DBCursor cursor = dataSource.getMainDB().getCollection(jobCollection).find();
		
		LinkedList<Map<String, Object>> result=new LinkedList<Map<String,Object>>();
		while (cursor.hasNext()) {
			result.add(cursor.next().toMap());
		}
		return result;
	}
	
	public void appendNewJob(Map<String, Object> job) {
		dataSource.getMainDB().getCollection(jobCollection).insert(new BasicDBObject(job));
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
		DBCursor cursor = dataSource.getMainDB().getCollection(jobCollection).find();
		
		while (cursor.hasNext()) {
			jobs.add(cursor.next().toMap());
		}
	}
}
