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
	
	@RestService(method="POST", uri="/office/project/task/update")
	public Map<String,Object> updateTask(
			@RestParam(value="id")String id,
			@RestParam(value="project")String project,
			@RestParam(value="name")String name,
			@RestParam(value="desc")String desc,
			@RestParam(value="priority")String priority,
			@RestParam(value="start")String start,
			@RestParam(value="end")String end,
			@RestParam(value="resource")String resource,
			@RestParam(value="progress")String progress
			) {
		
		DBObject dbo = new BasicDBObject();
		dbo.put("project", new ObjectId(project));
		dbo.put("name", name);
		dbo.put("desc", desc);
		dbo.put("priority", priority);
		dbo.put("start", start);
		dbo.put("end", end);
		dbo.put("resource", resource.split(","));
		dbo.put("progress", progress);
		
		
		dbo.put("creator", AuthenticationUtil.getCurrentUser());
		if (id==null) {
			getTaskCollection().insert(dbo);
		} else {
			getTaskCollection().update(new BasicDBObject("_id", new ObjectId(id)), dbo);
			dbo.put("id", id);
		}
		
		return formatResult(dbo);
	}
	

	@RestService(method="POST", uri="/office/project/remove")
	public void removeProject(
			@RestParam(value="id")String id
			) {
		
		getProjectCollection().remove(new BasicDBObject("_id", new ObjectId(id)));
		getTaskCollection().remove(new BasicDBObject("project", new ObjectId(id)));
		getEventCollection().remove(new BasicDBObject("project", new ObjectId(id)));
	}
	
	@RestService(method="POST", uri="/office/project/task/remove")
	public void removeTask(
			@RestParam(value="id")String id
			) {
		
		getTaskCollection().remove(new BasicDBObject("_id", new ObjectId(id)));
		getEventCollection().remove(new BasicDBObject("task", new ObjectId(id)));
	}
	
	@RestService(method="POST", uri="/office/project/task/removeevent")
	public void removeEvent(
			@RestParam(value="id")String id
			) {
		DBObject one = getEventCollection().findOne(new BasicDBObject("_id", new ObjectId(id)));
		
		if (one!=null && "files".equals(one.get("type"))) {
			String fileIds = (String)((Map<String, Object>)one.get("info")).get("files");
			String[] fileIdArray = fileIds.split(",");
			for (int i = 0; i < fileIdArray.length; i++) {
				if (fileIdArray.equals("")) continue;
				fileService.delete(fileService.getFileById(fileIdArray[i]));
			}
		}
		
		getEventCollection().remove(new BasicDBObject("_id", new ObjectId(id)));
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
	
	@RestService(method="GET", uri="/office/project/resources")
	public List<String> getResources() {
		List list = getTaskCollection().distinct("resource", new BasicDBObject("creator", AuthenticationUtil.getCurrentUser()));
		return list;
	}
	
	
	@RestService(method="GET", uri="/office/project/task/list")
	public List<Map<String,Object>> getTaskList(@RestParam(value="project")String project) {
		DBCursor cursor = getTaskCollection().find(
			new BasicDBObject("creator", AuthenticationUtil.getCurrentUser()).append("project", new ObjectId(project)));
		List<Map<String,Object>> result = new ArrayList<Map<String,Object>>();
		while (cursor.hasNext()) {
			DBObject task = cursor.next();
			Map<String, Object> map = formatResult(task);
			result.add(map);
		}
		return result;
	}
	
	
	@RestService(method="POST", uri="/office/project/task/eventSave")
	public Map<String,Object> saveTaskEvent(@RestParam(value="project") String project, @RestParam(value="task") String task, 
			@RestParam(value="type") String type,
			@RestParam(value="info") Map<String, Object> info) {
		DBObject dbo = new BasicDBObject().append("task", new ObjectId(task))
				.append("project", new ObjectId(project))
				.append("type", type)
				.append("info", info)
				.append("creator", AuthenticationUtil.getCurrentUser())
				.append("created", new Date());
		getEventCollection().insert(dbo);
		return formatResult(dbo);
	}
	
	@RestService(method="GET", uri="/office/project/task/events")
	public List<Map<String,Object>> getEventList(@RestParam(value="task")String task) {
		DBCursor cursor = getEventCollection().find(new BasicDBObject("creator", AuthenticationUtil.getCurrentUser()).append("task", new ObjectId(task)));
		
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
		if (map.get("project")!=null) {
			map.put("project", map.get("project").toString());
		}
		if (map.get("task")!=null) {
			map.put("task", map.get("task").toString());
		}
		return map;
	}
	
	
	private DBCollection getProjectCollection() {
		DBCollection coll = dataSource.getDB("office").getCollection("projects");
		coll.ensureIndex("creator");
		
		return coll;
	}
	
	private DBCollection getTaskCollection() {
		DBCollection coll = dataSource.getDB("office").getCollection("tasks");
		coll.ensureIndex("creator");
		coll.ensureIndex("project");
		
		return coll;
	}
	
	private DBCollection getEventCollection() {
		DBCollection coll = dataSource.getDB("office").getCollection("events");
		coll.ensureIndex("creator");
		coll.ensureIndex("task");
		return coll;
	}
	
	private DBCollection getAttachCollection() {
		DBCollection coll = dataSource.getDB("office").getCollection("attaches");
		coll.ensureIndex("creator");
		coll.ensureIndex("task");
		return coll;
	}
	
}
