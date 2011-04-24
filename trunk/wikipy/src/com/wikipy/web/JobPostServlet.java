package com.wikipy.web;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.wikipy.job.ImportClient;
import com.wikipy.job.ImportersRegistry;

/**
 * Servlet implementation class JobPostServlet
 */
public class JobPostServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       private ImportersRegistry importersRegistry;
	
    @Override
	public void init(ServletConfig config) throws ServletException {
    	WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
    	importersRegistry = (ImportersRegistry) ctx.getBean("importersRegistry");
	}

	/**
     * @see HttpServlet#HttpServlet()
     */
    public JobPostServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		ImportClient importers = importersRegistry.getImporter(request.getParameter("type"));
		if (importers!=null) {
			Map<String, Object> newJobs = new HashMap<String, Object>();
			newJobs.put("feedUrl", request.getParameter("feedUrl"));
			newJobs.put("uuid", request.getParameter("uuid"));
			importers.check(newJobs);
		}
		
		response.sendRedirect("client/feedmanage.jsp");
		
		
	}

}
