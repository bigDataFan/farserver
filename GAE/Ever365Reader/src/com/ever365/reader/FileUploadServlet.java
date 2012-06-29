package com.ever365.reader;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ever365.farsvr.sync.KVSyncService;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.files.AppEngineFile;
import com.google.appengine.api.files.FileService;
import com.google.appengine.api.files.FileServiceFactory;
import com.google.appengine.api.files.FileWriteChannel;

@SuppressWarnings("serial")
public class FileUploadServlet extends HttpServlet {
	BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

	FileService fileService = FileServiceFactory.getFileService();
	KVSyncService kvSyncService = new KVSyncService();
	
	private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
		
		try {
			req.setCharacterEncoding("utf-8");
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		
		boolean isMultipart = ServletFileUpload.isMultipartContent(req);
		
		if (isMultipart) {
			ServletFileUpload upload = new ServletFileUpload();

			// Parse the request
			FileItemIterator iter;
			try {
				iter = upload.getItemIterator(req);
				while (iter.hasNext()) {
					FileItemStream item = iter.next();
					String name = item.getFieldName();
					InputStream stream = item.openStream();
					
					if (item.isFormField()) {
						//System.out.println("Form field " + name + " with value " + item.getFieldName()+ " detected.");
					} else {
						System.out.println("File field " + name + " with file name " + item.getName() + " detected. type " + item.getContentType());
						/*
						BufferedReader reader = new BufferedReader(new InputStreamReader(stream,"utf-8"));
						
						String value = FileCopyUtils.copyToString(reader);
						
						int i = 0;
						
						List<String> keys = new ArrayList<String>();
						
						do {
							Text text = new Text(value.substring(0, 1000*1000));
							value = value.substring(1000*1000);
							
							Entity entity = new Entity("filechunk", AuthenticationUtil.getCurrentUser() + "^" + item.getName() + "-" + i);
							keys.add(AuthenticationUtil.getCurrentUser() + "^" + item.getName() + "-" + i);
							i ++;
							entity.setProperty("data", text);
							datastore.put(entity);
						} while (value.length()>1*1000*1000);
						*/
						
						//Create a new Blob file with mime-type "text/plain"
						AppEngineFile file = fileService.createNewBlobFile("text/plain", item.getName());
						
						//Open a channel to write to it
						
						FileWriteChannel writeChannel = fileService.openWriteChannel(file, true);
						
						
						ChannelUtil.transfer(stream, writeChannel);
						
						//out.flush();
						writeChannel.closeFinally();
						
						// Now finalize
						//writeChannel.closeFinally();
						  
						BlobKey blobKey = fileService.getBlobKey(file);
						
						
						Map<String, Object> v = kvSyncService.getKey("reader", "books");
						String liststring = (String)v.get("value");
						try {
							JSONArray array = new JSONArray(liststring);
							JSONObject jso = new JSONObject();
							jso.put("title", item.getName().toLowerCase().split(".txt")[0]);
							jso.put("key", blobKey.getKeyString());
							array.put(jso);
							kvSyncService.saveKey("reader", "books", array.toString());
						} catch (JSONException e) {
							e.printStackTrace();
						}
						// Process the input stream
						resp.getWriter().print(blobKey.getKeyString());
					}
				}
				
				
			} catch (FileUploadException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
	}
}
