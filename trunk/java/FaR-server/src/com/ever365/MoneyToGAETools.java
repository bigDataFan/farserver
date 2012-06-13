package com.ever365;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
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
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class MoneyToGAETools {
	
	private MongoDBDataSource dataSource;
	
	public void transferUserInfo() {
		
		dataSource = new MongoDBDataSource();
		dataSource.setIp("127.0.0.1");
		dataSource.setPort("27017");
		dataSource.init();
		
		DBCollection userColl = dataSource.getDB("systemdb").getCollection("users");

		DBCursor cursor = userColl.find().skip(999);
		
		while(cursor.hasNext()) {
			
			DBObject dbo = cursor.next();
			try {
				String userName = (String)dbo.get("name");
				String password = (String)dbo.get("password");
				String email = (String)dbo.get("email");
				
				get("http://user.ever365.com/service/user/update?u=" + userName + "&p=" + password 
						+ "&e=" + email + "&k=Alfresco123");
				System.out.println("userCreated " + userName + " ");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
	}
	
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

		DBCursor cursor = userColl.find().skip(2000).limit(1000);
		while(cursor.hasNext()) {
			DBObject dbo = cursor.next();
			try {
				String userName = (String)dbo.get("name");
				System.out.println("put user:" + userName + "  p=" + dbo.get("password"));
				
				transferUser(userName);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	
	public void transferUser(String user) {
		DB syncdb = dataSource.getDB("sync");
		
		DBObject userquery = new BasicDBObject();
		userquery.put("creator", user);
		
		putcollection(user, syncdb, userquery, "groupdb");
		putcollection(user, syncdb, userquery, "incomedb");
		putConfig(user,syncdb,userquery);
		System.out.println();
	}

	
	private void putcollection(String user, DB syncdb, DBObject userquery,
			String coll) {
		DBCollection groupdbcoll = syncdb.getCollection(coll);
		
		long c = groupdbcoll.count(userquery);
		
		if (c>1) {
			DBCursor cur = groupdbcoll.find(userquery);
			
			List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
			while (cur.hasNext()) {
				DBObject dbo = cur.next();
				list.add(dbo.toMap());
			}
			String value = new JSONArray(list).toString();
			
			HttpPost post = new HttpPost("http://money.ever365.com/service/key/update?user=" + user + "&p=Alfresco123");
			
			HttpClient httpclient = new DefaultHttpClient();
			try {
				
				List<NameValuePair> nvps = new ArrayList<NameValuePair>();
				nvps.add(new BasicNameValuePair("kind", "money"));
				nvps.add(new BasicNameValuePair("key", coll));
				nvps.add(new BasicNameValuePair("value", value));
				post.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));
				HttpResponse result = httpclient.execute(post);
				
				System.out.print(coll + ":" + list.size());
				
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
	}


	
	private void putConfig(String user, DB syncdb, DBObject userquery) {
		DBCollection groupdbcoll = syncdb.getCollection("config");
		
			DBObject dbo = groupdbcoll.findOne(userquery);
			
			if (dbo==null) return;
			String value = (String)dbo.get("value");
			
			HttpPost post = new HttpPost("http://money.ever365.com/service/key/update?user=" + user + "&p=Alfresco123");
			
			HttpClient httpclient = new DefaultHttpClient();
			try {
				
				List<NameValuePair> nvps = new ArrayList<NameValuePair>();
				nvps.add(new BasicNameValuePair("kind", "money"));
				nvps.add(new BasicNameValuePair("key", "config"));
				nvps.add(new BasicNameValuePair("value", value));
				post.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));
				HttpResponse result = httpclient.execute(post);
				
				System.out.print("config: updated");
				
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
	
	
	private void postJsonArray(String remote, String collection, JSONArray ja) {
		HttpClient httpclient = new DefaultHttpClient();
		HttpPost post = new HttpPost("http://" + remote + "/service/import");
		try {

			List<NameValuePair> nvps = new ArrayList<NameValuePair>();
			nvps.add(new BasicNameValuePair("collection", collection));
			nvps.add(new BasicNameValuePair("list", ja.toString()));

			post.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));

			HttpResponse result = httpclient.execute(post);
			int code = result.getStatusLine().getStatusCode();
			System.out.println("put 1000 result in " + code);
			//System.out.println(code);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			
		}
	}
	
	public static void main(String[] args) {
		MoneyToGAETools tools = new MoneyToGAETools();
		tools.exportMoneyInfos();
	}
	
	
}
