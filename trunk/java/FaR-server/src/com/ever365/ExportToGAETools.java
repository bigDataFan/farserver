package com.ever365;

import java.io.IOException;
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

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class ExportToGAETools {
	
	private MongoDBDataSource dataSource;
	
	public void exportCollections(String remote, String db, String collection) {
		dataSource = new MongoDBDataSource();
		dataSource.setIp("127.0.0.1");
		dataSource.setPort("27017");
		dataSource.init();
		
		DB database = dataSource.getDB(db);
		
		DBCollection coll = database.getCollection(collection);
		DBCursor cur = coll.find();

		int i = 0;
		StringBuffer sb = new StringBuffer();
		
		List<Map<String, Object>> list1000 = new ArrayList<Map<String,Object>>();
		while (cur.hasNext()) {
			DBObject dbo = cur.next();
			list1000.add(dbo.toMap());
			i++;
			if (i==1000) {
				JSONArray ja = new JSONArray(list1000);
				
				postJsonArray(remote, collection, ja);
				list1000.clear();
				i = 0;
			}
		}
		postJsonArray(remote, collection, new JSONArray(list1000));
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
		ExportToGAETools tools = new ExportToGAETools();
		tools.exportCollections("money.ever365.com", "systemdb", "users");
		
	}
	
	
}
