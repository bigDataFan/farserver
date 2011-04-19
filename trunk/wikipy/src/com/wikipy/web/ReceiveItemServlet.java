package com.wikipy.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.wikipy.content.ContentFile;
import com.wikipy.content.ContentService;
import com.wikipy.repository.RepositoryService;

/**
 * Servlet implementation class ReceiveItemServlet
 */
public class ReceiveItemServlet extends HttpServlet {
	private static final String UTF_8 = "UTF-8";

	private static final long serialVersionUID = 1L;
    
	private FileItemFactory fileItemFactory = new DiskFileItemFactory();
	
	private ContentService contentService;
	private RepositoryService repositoryService;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ReceiveItemServlet() {
        super();
    }

    
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
		contentService = (ContentService) ctx.getBean("contentService");
		repositoryService = (RepositoryService) ctx.getBean("repositoryService");
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
		upload.setHeaderEncoding(UTF_8);
		try {
			List<FileItem> items = upload.parseRequest(request);
			Map<String, Object> fields = new HashMap<String, Object>();
			List<String> attaches = new ArrayList<String>();
			for (FileItem fileItem : items) {
				if (fileItem.isFormField()) {
					fields.put(fileItem.getFieldName(), fileItem.getString("UTF-8"));
				} else {
					try {
						if (fileItem.getSize()>0) {
							ContentFile contentFile = new ContentFile();
							contentFile.setFileName(fileItem.getName());
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
			fields.put("_attaches", attaches);
			Object pid = fields.get("_parentid");
			if (pid==null) {
				response.sendError(400);
				return;
			}
			repositoryService.appendChildren((String)pid, fields);
		} catch (FileUploadException e) {
			e.printStackTrace();
			response.sendError(400);
		}
	}

}
