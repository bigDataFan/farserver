package com.ever365.rest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.rest.registry.RestParam;
import com.ever365.rest.registry.RestService;
import com.ever365.security.AuthenticationUtil;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;

public class CollectionWebService {
	private MongoDBDataSource dbProvider = null;
	
	public void setDbProvider(MongoDBDataSource dbProvider) {
		this.dbProvider = dbProvider;
	}


	@RestService(method="GET", uri="/containers/list")
	public Collection<String> listCollections() {
		DB udb = dbProvider.getUserDB(AuthenticationUtil.getCurrentUserName());
		return udb.getCollectionNames();
	}
	
	@RestService(method="POST", uri="/containers/add")
	public void addCollections(@RestParam(value="name")String name) {
		DB udb = dbProvider.getUserDB(AuthenticationUtil.getCurrentUserName());
		
		DBCollection coll = udb.createCollection(name, null);
		coll.ensureIndex("_user");
	}
	
	@RestService(method="POST", uri="/containers/doc/add")
	public void addDocument(@RestParam(value="name")String name, @RestParam(value="node")Map<String, Object> doc) {
		DB udb = dbProvider.getUserDB(AuthenticationUtil.getCurrentUserName());
		DBCollection coll = udb.getCollection(name);
		doc.put("_user", AuthenticationUtil.getCurrentUserName());
		coll.insert(new BasicDBObject(doc));
	}
	
	
	
	@RestService(method="POST", uri="/containers/doc/madd")
	public void addDocument(@RestParam(value="name")String name, @RestParam(value="list")List<Map<String, Object>> list) {
		DB udb = dbProvider.getUserDB(AuthenticationUtil.getCurrentUserName());
		DBCollection coll = udb.getCollection(name);
		for (Map<String, Object> map : list) {
			map.put("_user", AuthenticationUtil.getCurrentUserName());
			coll.insert(new BasicDBObject(map));
		}
	}
	
	
	@RestService(method="GET", uri="/containers/doc/find")
	public List<Map<String, Object>> findDocument(@RestParam(value="name")String name, @RestParam(value="query")Map<String, Object> filter, @RestParam(value="skip")int skip, @RestParam(value="limit")int limit) {
		DB pdb = dbProvider.getPublicDB();
		DBCollection coll = pdb.getCollection(name);
		
		BasicDBObject query = new BasicDBObject();
		if (filter!=null) {
			query.putAll(filter);
		}
		query.put("_user", AuthenticationUtil.getCurrentUserName());
		
		if (limit==0) limit = 100;
		if (limit>500) limit=500;
		DBCursor cursor = coll.find(query).skip(skip).limit(limit);
		
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		
		while (cursor.hasNext()) {
			result.add(cursor.next().toMap());
		}
		return result;
	}
}
