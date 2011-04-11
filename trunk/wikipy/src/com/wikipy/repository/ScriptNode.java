package com.wikipy.repository;

import java.util.Map;

import org.bson.types.ObjectId;

public class ScriptNode {
	
	private RepositoryService repositoryService;
	private ObjectId id;
	
	public ScriptNode(RepositoryService repositoryService, ObjectId id) {
		super();
		this.repositoryService = repositoryService;
		this.id = id;
	}

	private Map<String, Object> document;
	
	
	
	
	public Map<String, Object> getProperties() {
		if (document==null) {
			
		}
		return document;
	}
	
	
}
