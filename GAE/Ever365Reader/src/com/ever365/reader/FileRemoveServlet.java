package com.ever365.reader;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ever365.farsvr.sync.KVSyncService;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.files.FileService;
import com.google.appengine.api.files.FileServiceFactory;

@SuppressWarnings("serial")
public class FileRemoveServlet extends HttpServlet {
	BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

	FileService fileService = FileServiceFactory.getFileService();
	KVSyncService kvSyncService = new KVSyncService();
	
	private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		
		String key = req.getParameter("key");
		
		if (key==null) {
			return;
		}
		
		Map<String, Object> v = kvSyncService.getKey("reader", "books");
		String liststring = (String)v.get("value");
		try {
			JSONArray array = new JSONArray(liststring);
			
			JSONObject jso;
			for(int i=0; i<array.length(); i++) {
				jso = (JSONObject)array.get(i);
				
				if (jso.getString("key").equals(key)) {
					array.remove(i);
					blobstoreService.delete(new BlobKey(key));
					break;
				}
			}
			kvSyncService.saveKey("reader", "books", array.toString());
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		
		
		
	}
}
