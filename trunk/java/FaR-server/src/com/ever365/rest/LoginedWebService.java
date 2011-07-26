package com.ever365.rest;

import java.util.Map;

import com.ever365.collections.mongodb.MongoDBProvider;
import com.ever365.rest.registry.RestParam;
import com.ever365.rest.registry.RestService;

public class LoginedWebService {

	private MongoDBProvider dbProvider = null;
	
	public void setDbProvider(MongoDBProvider dbProvider) {
		this.dbProvider = dbProvider;
	}

	@RestService(method="GET", uri="/application/install")
	public Map<String, Object> installApp2(@RestParam(value="application")String application, @RestParam(value="mapping")String mapping) {
		return null;
	}
	
}
