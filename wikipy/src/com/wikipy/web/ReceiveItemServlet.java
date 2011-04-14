package com.wikipy.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.mozilla.javascript.NativeObject;

import com.wikipy.content.ContentFile;
import com.wikipy.content.ContentService;

/**
 * Servlet implementation class ReceiveItemServlet
 */
public class ReceiveItemServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
	private FileItemFactory fileItemFactory = new DiskFileItemFactory();
	
	private ContentService contentService;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ReceiveItemServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		ServletFileUpload upload = new ServletFileUpload(fileItemFactory);
		try {
			List<FileItem> items = upload.parseRequest(request);
			Map<String, Object> fields = new HashMap<String, Object>();
			List<String> attaches = new ArrayList<String>();
			for (FileItem fileItem : items) {
				if (fileItem.isFormField()) {
					fields.put(fileItem.getFieldName(), fileItem.getString());
				} else {
					try {
						if (fileItem.getSize()>0) {
							ContentFile contentFile = new ContentFile();
							contentFile.setFileName(fileItem.getFieldName());
							contentFile.setContent(fileItem.getInputStream());
							contentFile.setSize(fileItem.getSize());
							contentFile.setMimetype(fileItem.getContentType());
							String id = contentService.putContent(contentFile);
							attaches.add(id);
						}
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
			
			
			
		} catch (FileUploadException e) {
			e.printStackTrace();
		}
	}

}
