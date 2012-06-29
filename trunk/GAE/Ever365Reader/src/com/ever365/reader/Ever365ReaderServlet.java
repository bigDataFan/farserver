package com.ever365.reader;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ever365.farsvr.sync.KVSyncService;
import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

@SuppressWarnings("serial")
public class Ever365ReaderServlet extends HttpServlet {
	
	BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
	BlobInfoFactory blobInfoFactory = new BlobInfoFactory();
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		resp.setContentType("text/plain");
		resp.getWriter().println("Hello, world");
	}
	
	KVSyncService kvSyncService = new KVSyncService();
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		resp.setCharacterEncoding("gbk");
		
		
		Map<String, List<BlobKey>> uploads = blobstoreService.getUploads(req);
	
		List<BlobKey> keys = uploads.get("myFile");
		
		BlobKey key = keys.get(0);
		
		BlobInfo info = blobInfoFactory.loadBlobInfo(key);
		
		Map<String, Object> v = kvSyncService.getKey("reader", "books");
		;
		String liststring = (String)v.get("value");
		
		try {
			JSONArray array = new JSONArray(liststring);
			JSONObject jso = new JSONObject();
			jso.put(info.getFilename(), key.getKeyString());
			array.put(jso);
			kvSyncService.saveKey("reader", "books", array.toString());
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		System.out.println(uploads.size());
	}
	
	
}
