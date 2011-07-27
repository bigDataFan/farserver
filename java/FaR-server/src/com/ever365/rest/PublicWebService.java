package com.ever365.rest;

import java.util.Collection;
import java.util.Map;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.rest.registry.RestParam;
import com.ever365.rest.registry.RestService;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

public class PublicWebService {
	private MongoDBDataSource dbProvider = null;
	
	
	public void setDbProvider(MongoDBDataSource dbProvider) {
		this.dbProvider = dbProvider;
	}


	@RestService(method="GET", uri="/containers/list")
	public Collection<String> listCollections() {
		DB pdb = dbProvider.getPublicDB();
		return pdb.getCollectionNames();
	}
	
	@RestService(method="POST", uri="/containers/add")
	public void addCollections(@RestParam(value="name")String name) {
		DB pdb = dbProvider.getPublicDB();
		pdb.createCollection(name, null);
	}

	
	@RestService(method="POST", uri="/containers/doc/add")
	public void addDocument(@RestParam(value="name")String name, @RestParam(value="node")Map<String, Object> doc) {
		DB pdb = dbProvider.getPublicDB();
		DBCollection coll = pdb.getCollection(name);
		coll.insert(new BasicDBObject(doc));
	}
	
	
	@RestService(method="GET", uri="/containers/doc/find")
	public void findDocument(@RestParam(value="name")String name, @RestParam(value="query")Map<String, Object> filter, @RestParam(value="from")int from, @RestParam(value="to")int to) {
		DB pdb = dbProvider.getPublicDB();
		DBCollection coll = pdb.getCollection(name);
		
		BasicDBObject query = new BasicDBObject();
		if (filter!=null) {
			query.putAll(filter);
		}
		
		
		
	}

	
	
	
	
}
