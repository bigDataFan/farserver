package com.ever365.farsvr.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.ever365.farsvr.security.AuthenticationUtil;
import com.ever365.farsvr.sync.KVSyncService;

/**
 * Servlet implementation class RestServiceServlet
 */
public class RestServiceServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final String CONTENT_TYPE = "text/html; charset=UTF-8";
	private HttpServiceRegistry registry;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RestServiceServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		registry = new HttpServiceRegistry();
		List<Object> injectedServices = new ArrayList<Object>();
		//injectedServices.add(new BasicSyncService());
		injectedServices.add(new KVSyncService());
		//injectedServices.add(new HttpUserService());
		registry.setInjectedServices(injectedServices);
	}
	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			
			AuthenticationUtil.country.set(request.getHeader("X-AppEngine-Country"));
			AuthenticationUtil.region.set(request.getHeader("X-AppEngine-Region"));
			AuthenticationUtil.city.set(request.getHeader("X-AppEngine-City"));
			AuthenticationUtil.latitude.set(request.getHeader("X-AppEngine-CityLatLong"));
			
			
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
		}catch (Exception e) {
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

			AuthenticationUtil.country.set(request.getHeader("X-AppEngine-Country"));
			AuthenticationUtil.region.set(request.getHeader("X-AppEngine-Region"));
			AuthenticationUtil.city.set(request.getHeader("X-AppEngine-City"));
			AuthenticationUtil.latitude.set(request.getHeader("X-AppEngine-CityLatLong"));
			
			
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
		
			Enumeration paramNames = request.getParameterNames();
			while (paramNames.hasMoreElements()) {
				String name = (String) paramNames.nextElement();
				if (name.endsWith("]") && name.indexOf("[")>-1) {
					String pureName = name.substring(0, name.indexOf("["));
					if (args.get(pureName)==null) {
						args.put(pureName, new HashMap<String, String>());
					}
					((Map)args.get(pureName)).put(name.substring(name.indexOf("[")+1, name.indexOf("]")), URLDecoder.decode(request.getParameter(name), "UTF-8"));
					
				} else {
					args.put(name, URLDecoder.decode(request.getParameter(name), "UTF-8"));
				}
				
				//args.put(name, request.getParameter(name));
				//args.put(name, new String(request.getParameter(name).getBytes("ISO-8859-1"), "UTF-8"));
			}
			Object result = handler.execute(args);
			if (result==null) {
				response.setStatus(200);
			} else {
				render(response, result);
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
