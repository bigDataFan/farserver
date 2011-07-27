package com.ever365.console;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.freemarker.GQuFreemarkerExceptionHandler;

import com.ever365.console.ftl.RenderLoader;

import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapper;

/**
 * Servlet implementation class ConsoleCommandExecuter
 */
public class ConsoleCommandExecuter extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Configuration freemarkerConfiguration;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ConsoleCommandExecuter() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    private RendererService rendererService;

	@Override
	public void init(ServletConfig config) throws ServletException {
		// TODO Auto-generated method stub
		super.init(config);
		
    	freemarkerConfiguration = new Configuration();
		freemarkerConfiguration.setObjectWrapper(new DefaultObjectWrapper());
		freemarkerConfiguration.setLocale(Locale.ENGLISH);
		freemarkerConfiguration.setDefaultEncoding("UTF-8");
		freemarkerConfiguration.setTemplateLoader(new RenderLoader(rendererService));
		freemarkerConfiguration.setTemplateExceptionHandler(new GQuFreemarkerExceptionHandler());
		freemarkerConfiguration.setLocalizedLookup(false);
	}



	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String query = request.getParameter("q");
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
