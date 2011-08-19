package com.ever365.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.webscript.HttpStatusExceptionImpl;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.ever365.rest.registry.HttpServiceRegistry;
import com.ever365.rest.registry.MethodInvocation;
import com.ever365.security.LoginServlet;
import com.ever365.security.UserService;

/**
 * Servlet implementation class RestServiceServlet
 */
public class RestServiceServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final String CONTENT_TYPE = "text/html; charset=UTF-8";
	private HttpServiceRegistry registry;
	private UserService userService;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RestServiceServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils
		.getRequiredWebApplicationContext(config.getServletContext());
		userService = (UserService) ctx.getBean("userService");
		registry = (HttpServiceRegistry) ctx.getBean("registry");
	}
	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			String strPath = URLDecoder.decode( request.getRequestURI(), "UTF-8");
			String servletPath = request.getServletPath();
			 
			int rootPos = strPath.indexOf(servletPath);
			if ( rootPos != -1)
				strPath = strPath.substring( rootPos + servletPath.length());
			
			MethodInvocation handler = registry.getGet(strPath);
			Enumeration paramNames = request.getParameterNames();
			Map<String, Object> args = new HashMap<String, Object>();
			while (paramNames.hasMoreElements()) {
				String name = (String) paramNames.nextElement();
				args.put(name, request.getParameter(name));
			}
			
			if (handler==null) {
				response.setStatus(404);
				return;
			}
			
			Object result = handler.execute(args);
			render(response, result);
		} catch (HttpStatusExceptionImpl e) {
			if (e.getCode()==401) {
				response.sendRedirect("/login.html");
				return;
			} else {
				response.setStatus(e.getCode());
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
		}
	}
	

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			String strPath = URLDecoder.decode( request.getRequestURI(), "UTF-8");
			//request.setCharacterEncoding("UTF-8"); 
			String servletPath = request.getServletPath();
			
			int rootPos = strPath.indexOf(servletPath);
			if ( rootPos != -1)
				strPath = strPath.substring( rootPos + servletPath.length());
			
			MethodInvocation handler = registry.getPost(strPath);
			
			if (handler==null) {
				response.setStatus(404);
				return;
			}
			
			
			Map<String, Object> args = new HashMap<String, Object>();
			
			if (handler.isMultipart() && ServletFileUpload.isMultipartContent(request)) {
				
				FileItemFactory factory = new DiskFileItemFactory();
				// Create a new file upload handler
				ServletFileUpload upload = new ServletFileUpload(factory);
				//upload.setSizeMax(1024*1024);
				
				// Parse the request
				List items = upload.parseRequest(request);
				// Parse the request
				Iterator iter = items.iterator();
				
				while (iter.hasNext()) {
					FileItem item = (FileItem) iter.next();
					
					if (item.isFormField()) {
				        args.put(item.getFieldName(), item.getString());
				    } else {
				    	args.put("Filename", item.getName());
				    	args.put("Filedata", item.getInputStream());
				    }
					/*
					
				    String name = item.getFieldName();
				    InputStream stream = item.openStream();
				    if (item.isFormField()) {
				    	args.put(name, Streams.asString(stream, "UTF-8"));
				    } else {
				    	args.put(name, stream);
				    }
				    */
				}
			} else if (request.getHeader("X-File-Name")!=null) {
				args.put("Filename", URLDecoder.decode(request.getHeader("X-File-Name"), "UTF-8"));
				args.put("Filedata", request.getInputStream());
			} else {
				Enumeration paramNames = request.getParameterNames();
				while (paramNames.hasMoreElements()) {
					String name = (String) paramNames.nextElement();
					args.put(name, URLDecoder.decode(request.getParameter(name), "UTF-8"));
					//args.put(name, request.getParameter(name));
					//args.put(name, new String(request.getParameter(name).getBytes("ISO-8859-1"), "UTF-8"));
				}
			}
			Object result = handler.execute(args);
			if (result==null) {
				response.setStatus(200);
			} else {
				render(response, result);
			}
		} catch (HttpStatusExceptionImpl e) {
			if (e.getCode()==401) {
				response.sendRedirect("/login.html");
				return;
			} else {
				response.setStatus(e.getCode());
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.setStatus(500);
		}	
	}
	
	private void render(HttpServletResponse response, Object result)
			throws IOException {
		if (result==null) {
			response.setStatus(201);
			return;
		}
		response.setContentType(CONTENT_TYPE);
		PrintWriter pw = response.getWriter();
		if (result instanceof Collection) {
			JSONArray ja = new JSONArray((Collection) result);
			pw.print(ja.toString());
		} else if (result instanceof Map){
			JSONObject jo = new JSONObject((Map) result);
			pw.print(jo.toString());
		} else {
			pw.print(result.toString());
		}
		pw.close();
	}

}
