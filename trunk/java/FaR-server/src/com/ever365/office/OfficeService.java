package com.ever365.office;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.rest.registry.RestParam;
import com.ever365.rest.registry.RestService;
import com.ever365.security.AuthenticationUtil;
import com.ever365.vfile.File;
import com.ever365.vfile.VFileService;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class OfficeService {

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


	@RestService(method="POST", uri="/office/upload", multipart=true)
	public Map<String, Object> addFile(@RestParam(value="Filename")String name, @RestParam(value="Filedata")InputStream inputStream) {
		File userRoot = getUserRoot();
		Map<String, Object> result = new HashMap<String, Object>();
		if (name==null) {
			return result;
		}
		Date date = new Date();
		int year = date.getYear() + 1900;
		int month = date.getMonth() + 1;
		int day = date.getDate();
		
		File todayDir = userRoot.makeDir(year + "/" + month + "/" + day);
		
		File file = todayDir.createFile(name, inputStream);
		
		result.put("success", true);
		result.put("name", file.getName());
		result.put("size", file.getSize());
		result.put("modified", file.getModified().getTime());
		result.put("id", file.getObjectId().toString());
		return result;
	}

	private File getUserRoot() {
		String currentUser = AuthenticationUtil.getCurrentUserName();
		
		File userRoot = null;
		
		if (AuthenticationUtil.isCurrentUserGuest()) {
			File root = fileService.getRootFile();
			userRoot = root.makeDir("/temp/" + currentUser);
		} else {
			userRoot = fileService.getRootFile().makeDir(currentUser);
		}
		return userRoot;
	}
	
	@RestService(method="POST", uri="/office/delete")
	public void removeFile(@RestParam(value="id")String id) {
		
		File file = fileService.getFileById(id);
		
		if (file!=null) {
			if (!file.isFolder()) {
				file.remove();
			}
		}
	}
	
	
	@RestService(method="GET", uri="/office/daylist")
	public List<Map<String, Object>> getDayFiles(@RestParam(value="date")String date) {
		String[] splits = date.split("-");
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		if (splits.length==3) {
			File folder = getUserRoot().getByPath(splits[0] + "/" + splits[1] + "/" + splits[2]);
			if (folder!=null) {
				List<File> children = folder.getChildren();
				for (File file : children) {
					Map<String, Object> m = new HashMap<String, Object>();
					m.put("name", file.getName());
					m.put("size", file.getSize());
					m.put("modified", file.getModified().getTime());
					m.put("id", file.getObjectId().toString());
					result.add(m);
				}
			}
		}
		return result;
	}
	
	
	public List<Map<String, Object>> getDayTimes(@RestParam(value="date")String date) {
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		String[] splits = date.split("-");
		if (splits.length==3) { 
			long start = new Date(Integer.parseInt(splits[0]), Integer.parseInt(splits[1]), Integer.parseInt(splits[2]), 
					0, 0).getTime();
			
			long end = new Date(Integer.parseInt(splits[0]), Integer.parseInt(splits[1]), Integer.parseInt(splits[2]), 
					23, 59).getTime();
			
			
			
			DBObject dbo = new BasicDBObject();
			Map<String, Long> range = new HashMap<String, Long>();
			range.put("$gte", start);
			range.put("$lt", end);
			
			dbo.put("created", range);
			dbo.put("creator", AuthenticationUtil.getCurrentUser());
			
			DBCursor cursor = getTimeCollection().find(dbo);
			while (cursor.hasNext()) {
				DBObject oneTime = cursor.next();
				result.add(oneTime.toMap());
			}
		}
		return result;
	}
	
	
	public void addTime(String desc) {
		DBCollection coll = getTimeCollection();
		
		DBObject dbo = new BasicDBObject();
		dbo.put("desc", desc);
		dbo.put("creator", AuthenticationUtil.getCurrentUser());
		dbo.put("created", new Date().getTime());
		dbo.put("dura", 0);
		dbo.put("laststart", 0);
		
		coll.insert(dbo);
	}

	private DBCollection getTimeCollection() {
		DBCollection coll = dataSource.getDB("office").getCollection("times");
		coll.ensureIndex("creator");
		coll.ensureIndex("laststart");
		coll.ensureIndex("laststart");
		
		return coll;
	}
	
	public void stopAll() {
		DBCollection coll = getTimeCollection();
		
		DBObject query = new BasicDBObject();
		query.put("creator", AuthenticationUtil.getCurrentUser());
		
		Map<String, Integer> m = new HashMap<String, Integer>(1);
		m.put("$ne", 0);
		query.put("laststart", m);
		
		DBCursor cursor = coll.find(query);
		while (cursor.hasNext()) {
			DBObject tobeStop = cursor.next();
			long total = (Long)tobeStop.get("dura")  + (new Date().getTime() - (Long)tobeStop.get("laststart"));
			
			if (total>24*60*60*1000) {
				total = 24*60*60*1000;
			}
			tobeStop.put("dura", total);
			tobeStop.put("laststart", 0);
			coll.update(new BasicDBObject("_id", tobeStop.get("_id")), tobeStop);
		}
	}
	
	public void startTime(long created) {
		DBCollection coll = getTimeCollection();
		
		stopAll();
		
		DBObject query = new BasicDBObject();
		query.put("creator", AuthenticationUtil.getCurrentUser());
		query.put("created", created);
		DBObject dbo = coll.findOne(query);
		
		dbo.put("laststart", new Date().getTime());
		
		coll.update(new BasicDBObject("_id", dbo.get("_id")), dbo);
	}

	
}
