package com.wikipy.web;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.wikipy.job.JobDAO;

/**
 * Servlet implementation class JobPostServlet
 */
public class JobPostServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	JobDAO jobDAO;
    @Override
	public void init(ServletConfig config) throws ServletException {
    	WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
    	jobDAO = (JobDAO)ctx.getBean("jobDAO");
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
		
		jobDAO.appendNewJob(request.getParameterMap());
		
		response.sendRedirect("client.feedmanage.jsp");
		
		
	}

}
