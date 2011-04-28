package com.wikipy.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONStringer;
import org.json.JSONTokener;
import org.json.JSONWriter;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.wikipy.content.ContentService;
import com.wikipy.repository.RepositoryService;

/**
 * Servlet implementation class PackDownJsonServlet
 */
public class ExportServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	
	private ContentService contentService;
	private RepositoryService repositoryService;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ExportServlet() {
        super();
        // TODO Auto-generated constructor stub
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
		String path = request.getPathInfo();
		PrintWriter writer = response.getWriter();
		if (path.endsWith(".json")) {
			String uuid = path.substring(path.lastIndexOf("/")+1, path.length()-5);
			Map item = repositoryService.getItem(uuid);
			if (item!=null) {
				response.setContentType(BasicRenderServlet.TEXT_HTML_CHARSET_UTF_8);
				JSONWriter jsonwriter = new JSONWriter(writer);
				printItem(item, jsonwriter);
			} else {
				response.sendError(404);
			}
		}
	}

	
	private void printItem(Map<String, Object> item,  JSONWriter jsonwriter) {
		
		try {
			jsonwriter = jsonwriter.object();
			for (String key : item.keySet()) {
				jsonwriter.key(key);
				jsonwriter.value(item.get(key));
			}
			
			Collection<Map<String, Object>> children = repositoryService.listChildRen(item.get(RepositoryService.PROP_ID).toString(), null, 0, -1, null, null);
			if (children.size()>0) {
				jsonwriter.key("_children");
				jsonwriter.array();
				
				for (Map<String, Object> map : children) {
					printItem(map, jsonwriter);
				}
				jsonwriter.endArray();
			}
			
			
			
			jsonwriter.endObject();
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		
		
		
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
