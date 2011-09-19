package com.ever365.office;

import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import junit.runner.SimpleTestCollector;

import org.bson.types.ObjectId;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.rest.registry.RestParam;
import com.ever365.rest.registry.RestService;
import com.ever365.security.AuthenticationUtil;
import com.ever365.vfile.File;
import com.ever365.vfile.VFileService;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.CommandResult;
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
	
	@RestService(method="GET", uri="/office/time/info")
	public Map<String, Object> getUseInfo() {
		Map<String, Object> result = new HashMap<String, Object>();
		
		Date today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(1);
		
		result.put("yesterday", getRangeSum(today.getTime()-24*60*60*1000, today.getTime()));
		
		Date monday = getMondayOfThisWeek();
		monday.setHours(0);
		monday.setMinutes(0);
		monday.setSeconds(1);
		
		result.put("week", getRangeSum(monday.getTime(), new Date().getTime()));
		
		result.put("total", getRangeSum(0L, new Date().getTime()));
		result.put("count",getTimeCollection().count(new BasicDBObject("creator", AuthenticationUtil.getCurrentUser())));
		
		//DBCursor cursor = getTimeCollection().find(yesterdayQuery);
		return result;
	}

	private Double getRangeSum(Long start, Long end) {
		
		//today.setHours(0);
		//today.setMinutes(0);
		//today.setSeconds(1);
		// today.getTime()-24*60*60*1000
		Map<String, Long> gl = new HashMap<String, Long>();
		gl.put("$gte", start);
		gl.put("$lt", end);
		
		DBObject query = new BasicDBObject();
		query.put("created", gl);
		query.put("creator", AuthenticationUtil.getCurrentUser());
		
		String reduce = "function(obj,prev) { prev.csum += obj.dura; }";
		BasicDBList mr1 = (BasicDBList)getTimeCollection().group(new BasicDBObject(), query, new BasicDBObject("csum", 0),
				reduce);
		
		if (mr1.size()==1) {
			return (Double)((CommandResult)mr1.get(0)).get("csum");
		}
		return 0D;
	}
	
	@RestService(method="GET", uri="/office/time/list")
	public List<Map<String, Object>> getDayTimes(@RestParam(value="date")String date) {
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		String[] splits = date.split("-");
		if (splits.length==3) { 
			long start = new Date(Integer.parseInt(splits[0])-1900, Integer.parseInt(splits[1])-1, Integer.parseInt(splits[2]), 
					0, 0).getTime();
			
			long end = new Date(Integer.parseInt(splits[0])-1900, Integer.parseInt(splits[1])-1, Integer.parseInt(splits[2]), 
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
				
				if ((Long)oneTime.get("laststart")!=0L) {
					Long total = (Long)oneTime.get("dura")  + (new Date().getTime() - (Long)oneTime.get("laststart"));
					if (total>(Long)oneTime.get("autostop")) {
						stopOneItem(oneTime);
					}
				}
				
				result.add(formatResult(oneTime));
			}
		}
		return result;
	}
	
	public Long getDura(DBObject time) {
		Long ls = (Long)time.get("laststart");
		return (Long)time.get("dura") + ((ls==0)?0:(new Date().getTime()-ls)); 
	}
	
	@RestService(method="POST", uri="/office/time/add")
	public Map<String, Object> addTime(@RestParam(value="desc") String desc, @RestParam(value="autostop") String autostop) {
		stopAll();
		DBCollection coll = getTimeCollection();
		
		DBObject dbo = new BasicDBObject();
		dbo.put("desc", desc);
		dbo.put("creator", AuthenticationUtil.getCurrentUser());
		dbo.put("created", new Date().getTime());
		dbo.put("dura", 0L);
		dbo.put("laststart", new Date().getTime());
		
		try {
			dbo.put("autostop", Double.valueOf(Float.parseFloat(autostop)*60*60*1000).longValue());
		} catch (Exception e) {
			dbo.put("autostop", 8*60*60*1000L);
		}
		coll.insert(dbo);
		
		Map map = formatResult(dbo);
		return map;
	}
	
	@RestService(method="POST", uri="/office/time/update")
	public Map<String, Object> updateTime(
			@RestParam(value="id") String id,
			@RestParam(value="desc") String desc,
			@RestParam(value="autostop") String autostop
			) {
		DBCollection coll = getTimeCollection();
		
		DBObject dbo = new BasicDBObject();
		dbo.put("_id", new ObjectId(id));
		DBObject timeItem = coll.findOne(dbo);
		timeItem.put("desc", desc);
		
		try {
			timeItem.put("autostop", Double.valueOf(Float.parseFloat(autostop)*60*60*1000L).longValue());
		} catch (Exception e) {
			timeItem.put("autostop", 8*60*60*1000L);
		}
		
		
		coll.update(dbo, timeItem, false, false);
		
		Map map = formatResult(timeItem);
		return map;
	}
	
	@RestService(method="POST", uri="/office/time/delete")
	public void deleteTime(
			@RestParam(value="id") String id
			) {
		DBCollection coll = getTimeCollection();
		
		DBObject dbo = new BasicDBObject();
		dbo.put("_id", new ObjectId(id));
		coll.remove(dbo);
	}
	
	

	private Map<String,Object> formatResult(DBObject dbo) {
		Map map = dbo.toMap();
		map.put("id", map.get("_id").toString());
		
		if (map.get("autostop")!=null) {
			map.put("autostop", new Float(Double.valueOf((Long)map.get("autostop"))/(60*60*1000D)));
		}
		map.remove("_id");
		map.put("now", new Date().getTime());
		return map;
	}
	
	@RestService(method="POST", uri="/office/time/start")
	public Map<String, Object> startItem(@RestParam(value="id") String id) {
		stopAll();
		
		DBCollection coll = getTimeCollection();
		DBObject dbo = new BasicDBObject();
		dbo.put("_id", new ObjectId(id));
		DBObject timeItem = coll.findOne(dbo);
		
		if (dbo.get("autostop")!=null) {
			if ((Long)dbo.get("dura")>=(Long)dbo.get("autosop")) {
				return null;
			}
		}
		
		timeItem.put("laststart", new Date().getTime());
		coll.update(dbo, timeItem);
		return timeItem.toMap();
	}

	@RestService(method="POST", uri="/office/time/stop")
	public void stopItem() {
		stopAll();
	}

	@RestService(method="POST", uri="/office/note/add")
	public Map<String, Object> addNote(@RestParam(value="content") String content) {
		DBObject dbo = new BasicDBObject();
		dbo.put("content", content);
		dbo.put("creator", AuthenticationUtil.getCurrentUser());
		dbo.put("created", new Date().getTime());
		
		dbo.put("checks", Collections.emptyList());
		
		getNotesCollection().insert(dbo);
		Map map = formatResult(dbo);
		return map;
	}
	
	@RestService(method="POST", uri="/office/note/remove")
	public void removeNote(@RestParam(value="id") String id) {
		DBObject dbo = new BasicDBObject();
		dbo.put("_id", new ObjectId(id));
		dbo.put("creator", AuthenticationUtil.getCurrentUser());
		getNotesCollection().remove(dbo);
	}
	
	@RestService(method="GET", uri="/office/note/list")
	public List<Map<String, Object>> listNote(@RestParam(value="start") Integer start, @RestParam(value="limit") Integer limit) {
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		
		DBObject query = new BasicDBObject();
		query.put("creator", AuthenticationUtil.getCurrentUser());
		DBCursor cursor = getNotesCollection().find(query).skip(start).limit(limit);
		
		while (cursor.hasNext()) {
			Map note = cursor.next().toMap();
			note.put("id", note.get("_id").toString());
			note.remove("_id");
			result.add(note);
		}
		
		return result;
	}

	


	private DBCollection getNotesCollection() {
		DBCollection coll = dataSource.getDB("office").getCollection("notes");
		coll.ensureIndex("creator");
		return coll;
	}
	

	private DBCollection getTimeCollection() {
		DBCollection coll = dataSource.getDB("office").getCollection("times");
		coll.ensureIndex("creator");
		coll.ensureIndex("laststart");
		
		return coll;
	}
	
	private DBCollection getTaskCollection() {
		DBCollection coll = dataSource.getDB("office").getCollection("tasks");
		coll.ensureIndex("creator");
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
			stopOneItem(tobeStop);
		}
	}

	private void stopOneItem(DBObject tobeStop) {
		Long total = (Long)tobeStop.get("dura")  + (new Date().getTime() - (Long)tobeStop.get("laststart"));
		
		if (total>(Long)tobeStop.get("autostop")) {
			total = (Long)tobeStop.get("autostop");
		}
		
		List<String> checkList = null;
		Object checks = tobeStop.get("checks");
		if (checks==null) {
			checkList = new ArrayList<String>(0);
		} else {
			checkList = (List)checks;
		}
		
		checkList.add(tobeStop.get("laststart") + "-" + new Date().getTime() );
		tobeStop.put("checks", checkList);
		tobeStop.put("dura", total);
		tobeStop.put("laststart", 0L);
		getTimeCollection().update(new BasicDBObject("_id", tobeStop.get("_id")), tobeStop);
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

	
	
	@RestService(method="POST", uri="/office/task/update")
	public void updateTask(@RestParam(value="id") String id,
			@RestParam(value="title") String title,
			@RestParam(value="comment") String comment,
			@RestParam(value="style") String style,
			@RestParam(value="finished") Boolean finished,
			@RestParam(value="x") Integer x,
			@RestParam(value="y") Integer y
			) {
		
		DBObject dbo = null;
		if (id!=null) {
			dbo = getTaskCollection().findOne(new BasicDBObject("_id", new ObjectId(id)));
		} else {
			dbo = new BasicDBObject();
		}
		
		dbo.put("title", title);
		dbo.put("comment", comment);
		dbo.put("style", style);
		dbo.put("x", x);
		dbo.put("finished", finished);
		dbo.put("y", y);
		dbo.put("creator", AuthenticationUtil.getCurrentUser());
		if (id==null) {
			getTaskCollection().insert(dbo);
		} else {
			getTaskCollection().update(new BasicDBObject("_id", new ObjectId(id)), dbo);
		}
	}
	
	@RestService(method="GET", uri="/office/task/list")
	public Collection<Map<String, Object>> listTasks() {
		
		DBCursor cursor = getTaskCollection().find(new BasicDBObject("creator", AuthenticationUtil.getCurrentUser()));
		
		Collection<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		while(cursor.hasNext()) {
			result.add(formatResult(cursor.next()));
		}
		return result;
	}

	@RestService(method="POST", uri="/office/task/remove")
	public void removeTasks(@RestParam(value="id") String id) {
		getTaskCollection().remove(new BasicDBObject("_id", new ObjectId(id)));
	}
	
	
	public static Date getMondayOfThisWeek() {
		  Calendar c = Calendar.getInstance();
		  int day_of_week = c.get(Calendar.DAY_OF_WEEK) - 1;
		  if (day_of_week == 0)
		   day_of_week = 7;
		  c.add(Calendar.DATE, -day_of_week + 1);
		  
		  Date t = c.getTime();
		  t.setHours(0);
		  t.setMinutes(0);
		  t.setSeconds(1);
		  return t;
	}
	
	public static void main(String[] args) {
		
		DateFormat df= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss a");
		System.out.println(df.format(OfficeService.getMondayOfThisWeek()));
		System.out.println(new Float(Double.valueOf(90000L)/(60*60*1000D)));
		
	}
	
	
	
}
