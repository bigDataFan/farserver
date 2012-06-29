package com.ever365.reader;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.files.AppEngineFile;
import com.google.appengine.api.files.FileService;
import com.google.appengine.api.files.FileServiceFactory;

@SuppressWarnings("serial")
public class DownloadServlet extends HttpServlet {
	
	FileService fileService = FileServiceFactory.getFileService();
	BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
	
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		
		/*
		BlobKey blobKey = new BlobKey(req.getParameter("key"));
		
		AppEngineFile file = fileService.getBlobFile(blobKey);
		
		
		FileReadChannel readChannel = fileService.openReadChannel(file, false);
		
		ByteBuffer bb = ByteBuffer.allocate(1024);
		while (readChannel.read(bb)!=-1) {
			System.out.println(new String(bb.array(), "utf-8"));
		}
		*/
		
		BlobKey blobKey = new BlobKey(req.getParameter("key"));
		
		/*
		BlobInfoFactory binfofac = new BlobInfoFactory();
		BlobInfo info = binfofac.loadBlobInfo(blobKey);
		
		byte[] array = blobstoreService.fetchData(blobKey, 0, info.getSize());
		*/
		resp.setContentType("text/plain;charset=GBK");
		
		//resp.getWriter().println(new String(array,"GBK"));
		blobstoreService.serve(blobKey, resp);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) {

	}
	
	
}
