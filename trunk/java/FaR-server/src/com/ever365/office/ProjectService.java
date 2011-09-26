package com.ever365.office;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.rest.registry.RestParam;
import com.ever365.rest.registry.RestService;
import com.ever365.security.AuthenticationUtil;
import com.ever365.vfile.VFileService;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class ProjectService {
	private MongoDBDataSource dataSource;
	private VFileService fileService;
	
	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
	}


	public void setFileService(VFileService fileService) {
		this.fileService = fileService;
	}
	
	
	@RestService(method="POST", uri="/office/project/update")
	public Map<String,Object> createProject(
			@RestParam(value="id")String id,
			@RestParam(value="name")String name,
			@RestParam(value="desc")String desc,
			@RestParam(value="status")String status,
			@RestParam(value="start")String start,
			@RestParam(value="end")String end
			) {
		
		DBObject dbo = new BasicDBObject();
		dbo.put("name", name);
		dbo.put("desc", desc);
		dbo.put("status", status);
		dbo.put("start", start);
		dbo.put("end", end);
		dbo.put("creator", AuthenticationUtil.getCurrentUser());
		if (id==null) {
			getProjectCollection().insert(dbo);
		} else {
			getProjectCollection().update(new BasicDBObject("_id", new ObjectId(id)), dbo);
			dbo.put("id", id);
		}
		
		return formatResult(dbo);
	}
	
	@RestService(method="GET", uri="/office/project/list")
	public List<Map<String,Object>> getProjectList() {
		DBCursor cursor = getProjectCollection().find(new BasicDBObject("creator", AuthenticationUtil.getCurrentUser()));
		
		List<Map<String,Object>> result = new ArrayList<Map<String,Object>>();
		while (cursor.hasNext()) {
			result.add(formatResult(cursor.next()));
		}
		
		return result;
	}
	
	private Map<String,Object> formatResult(DBObject dbo) {
		Map map = dbo.toMap();
		if (map.get("_id")!=null) {
			map.put("id", map.get("_id").toString());
			map.remove("_id");
		}
		return map;
	}
	
	
	private DBCollection getProjectCollection() {
		DBCollection coll = dataSource.getDB("office").getCollection("projects");
		coll.ensureIndex("creator");
		
		return coll;
	}
	
}
