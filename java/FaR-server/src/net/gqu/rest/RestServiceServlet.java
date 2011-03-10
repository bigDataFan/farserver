package net.gqu.rest;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.security.BasicUserService;
import net.gqu.security.LoginServlet;
import net.gqu.webscript.HttpStatusExceptionImpl;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * Servlet implementation class RestServiceServlet
 */
public class RestServiceServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static final String CONTENT_TYPE = "text/html; charset=UTF-8";
	private HttpServiceRegistry registry;
	private BasicUserService userService;
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
		userService = (BasicUserService) ctx.getBean("userService");
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
				request.getSession().setAttribute(LoginServlet.HEADER_REFERER, request.getRequestURI());
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
			Enumeration paramNames = request.getParameterNames();
			Map<String, Object> args = new HashMap<String, Object>();
			while (paramNames.hasMoreElements()) {
				String name = (String) paramNames.nextElement();
				args.put(name, URLDecoder.decode(request.getParameter(name), "UTF-8"));
				//args.put(name, request.getParameter(name));
				//args.put(name, new String(request.getParameter(name).getBytes("ISO-8859-1"), "UTF-8"));
			}
			

			if (handler==null) {
				response.setStatus(404);
				return;
			}
			
			
			Object result = handler.execute(args);
			if (result==null) {
				response.sendRedirect("/");
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
			response.sendRedirect("/");
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
