package com.ever365;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class ProjectToGAETools {
	
	private MongoDBDataSource dataSource;
	
	
	public static Map<String, Object> get(String urlstr) {
		try {
			URL url = new URL(urlstr);
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					url.openStream()));
			String line;

			StringBuffer result = new StringBuffer();
			
			while ((line = reader.readLine()) != null) {
				result.append(line);
			}
			reader.close();

			return net.gqu.utils.JSONUtils.jsonObjectToMap(new JSONObject(result.toString()));

		} catch (MalformedURLException e) {
			
		} catch (IOException e) {
			
		} catch (JSONException e) {
			
		}

		return null;
	}
	
	
	public void exportMoneyInfos() {
		dataSource = new MongoDBDataSource();
		dataSource.setIp("127.0.0.1");
		dataSource.setPort("27017");
		dataSource.init();
		
		DBCollection userColl = dataSource.getDB("systemdb").getCollection("users");

		DBCursor cursor = userColl.find().skip(4000).limit(1001);
		while(cursor.hasNext()) {
			DBObject dbo = cursor.next();
			try {
				String userName = (String)dbo.get("name");
				System.out.print("put user:" + userName + "  p=" + dbo.get("password"));
				transferUser(userName);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	
	public void transferUser(String user) {
		DB office = dataSource.getDB("office");
		
		DBCollection projColl = office.getCollection("projects");
		DBCollection taskColl = office.getCollection("tasks");
		DBCollection eventColl = office.getCollection("events");
		
		DBCursor projects = projColl.find(new BasicDBObject("creator", user));
		
		List<Map<String, Object>> projList = new ArrayList<Map<String,Object>>();
		List<Map<String, Object>> taskList = new ArrayList<Map<String,Object>>();
		List<Map<String, Object>> eventList = new ArrayList<Map<String,Object>>();
		while (projects.hasNext()) {
			DBObject projectdbo = projects.next();
			
			Map projectMap = projectdbo.toMap();
			projectMap.put("id", ((ObjectId)projectdbo.get("_id")).toString());
			projList.add(projectMap);
			
			
			DBCursor taskscur = taskColl.find(new BasicDBObject("project", projectdbo.get("_id")));
			
			
			while (taskscur.hasNext()) {
				DBObject taskdbo = taskscur.next();
				Map taskmap = taskdbo.toMap();
				
				taskmap.put("project", ((ObjectId)(projectdbo.get("_id"))).toString());
				taskmap.put("id", ((ObjectId)(taskdbo.get("_id"))).toString());
				taskList.add(taskmap);
				
				try {
					taskmap.put("resource", cancatStringArray(((Collection<String>)taskdbo.get("resource")).toArray(new String[((Collection<String>)taskdbo.get("resource")).size()]), 0, ' '));
				}catch (Exception e) {
				}
					
				
				DBCursor eventCur = eventColl.find(new BasicDBObject("task", taskdbo.get("_id")));
				while (eventCur.hasNext()) {
					DBObject eventdbo = eventCur.next();
					Map eventMap = eventdbo.toMap();
					
					//if (eventMap.get("type").equals("files")) continue;
					eventMap.put("project", taskmap.get("project"));
					eventMap.put("task", taskmap.get("id"));
					eventMap.put("id", ((ObjectId)eventdbo.get("_id")).toString());
					eventMap.put("created", ((ObjectId)eventdbo.get("_id")).getTime());
					eventList.add(eventMap);
				}
				
			}
		}
		
		//
		
		String domain = "project.ever365.com";
		if (projList.size()>0) {
			post("http://" + domain +"/service/key/update?user=" + user + "&p=Alfresco123", "project", "project", new JSONArray(projList).toString());
			post("http://" + domain +"/service/key/update?user=" + user + "&p=Alfresco123", "project", "task", new JSONArray(taskList).toString());
			post("http://" + domain +"/service/key/update?user=" + user + "&p=Alfresco123", "project", "events", new JSONArray(eventList).toString());
			System.out.println("  project:" + projList.size() + "  task: " + taskList.size() + "  event:" + eventList.size());
		} else {
			System.out.println("  nothing ");
		}
	}
	
	
	private void post(String url, String kind, String key, String value) {
		HttpClient httpclient = new DefaultHttpClient();
		HttpPost post = new HttpPost(url);
		
		try {
			
			List<NameValuePair> nvps = new ArrayList<NameValuePair>();
			nvps.add(new BasicNameValuePair("kind", kind));
			nvps.add(new BasicNameValuePair("key", key));
			nvps.add(new BasicNameValuePair("value", value));
			post.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));
			HttpResponse result = httpclient.execute(post);
			
			int code = result.getStatusLine().getStatusCode();
			//System.out.println(code);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			httpclient.getConnectionManager().shutdown();
		}
		
		
		
	}
	
	public static void main(String[] args) {
		ProjectToGAETools tools = new ProjectToGAETools();
		tools.exportMoneyInfos();
		//tools.transferUser("liuhan");
	}
	
	public static String cancatStringArray(String[] ary, int begin, char split) {
		if (begin>=ary.length) return "";
		
		StringBuffer sb = new StringBuffer("");
		
		for (int i = begin; i < ary.length; i++) {
			sb.append(split).append(ary[i]);
		}
		return sb.toString();
	}
	
	
	
}
