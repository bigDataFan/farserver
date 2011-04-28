package com.wikipy.web;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.wikipy.repository.RepositoryService;
import com.wikipy.utils.JSONUtils;

/**
 * Servlet implementation class JsonReceiveServlet
 */
public class JsonReceiveServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private RepositoryService repositoryService;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public JsonReceiveServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
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
		
		String s = inputStream2String(request.getInputStream());
		try {
			JSONObject json = new JSONObject(s);
			Map<String, Object> map = JSONUtils.jsonObjectToMap(json);
			
			Object pid = map.get("_parentid");
			if (pid==null) {
				response.sendError(400);
				return;
			}
			try {
				doImportMap((String) pid, map);
			} catch (HttpStatusExceptionImpl e) {
				response.sendError(e.getCode());
			} catch (RuntimeException e) {
				response.sendError(500);
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

	private void doImportMap(String parentId, Map<String, Object> map) {
		Object children = map.get("_children");
		Map[] childrenMap = null;
		if (children!=null && children instanceof Map[]) {
			map.remove("_children");
			childrenMap = (Map[]) children;
		}		
		String pid = repositoryService.appendChildren(parentId, map);
		if (childrenMap!=null) {
			for (int i = 0; i < childrenMap.length; i++) {
				doImportMap(pid, childrenMap[i]);
			}
		}
	}
	
	
	String inputStream2String(InputStream is) {
		BufferedReader in = new BufferedReader(new InputStreamReader(is));
		StringBuffer buffer = new StringBuffer();
		String line = "";
		try {
			while ((line = in.readLine()) != null) {
				buffer.append(line);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return buffer.toString();
	}
	

}
