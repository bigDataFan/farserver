package com.ever365.office;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.rest.registry.RestService;
import com.ever365.security.AuthenticationUtil;
import com.ever365.vfile.VFileService;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

public class MoneyService {

	private MongoDBDataSource dataSource;
	private VFileService fileService;
	
	@RestService(method="GET", uri="/office/hi")
	public void hi() {
	}
	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
	}

	
	public void setFileService(VFileService fileService) {
		this.fileService = fileService;
	}

	
	public String getCategories() {
		DB db = dataSource.getDB("money");
		DBCollection catColl = db.getCollection("categories");
		
		DBObject one = catColl.findOne(new BasicDBObject("userId", AuthenticationUtil.getCurrentUserName()));
		
		if (one==null) {
			BasicDBObject newCat = new BasicDBObject();
			newCat.put("userId", AuthenticationUtil.getCurrentUserName());
			newCat.put("cats", "");
			
			catColl.insert();
		}
		
		return null;
		
	}
	
	
	
	
	
}
