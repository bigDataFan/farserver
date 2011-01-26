package net.gqu.servlet;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.application.ApplicationService;
import net.gqu.security.AuthenticationUtil;
import net.gqu.security.BasicUserService;
import net.gqu.security.User;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * Servlet implementation class DefaultServlet
 */
public class DefaultServlet extends HttpServlet {
	private static final String MOBILE_DOMAIN = "m.";

	private static final long serialVersionUID = 1L;
      
	private BasicUserService userService;
	private ApplicationService applicationService;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DefaultServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    @Override
	public void init(ServletConfig config) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
		userService = (BasicUserService) ctx.getBean("userService");
		applicationService = (ApplicationService)ctx.getBean("applicationService");
	}
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		/*
		String agent = request.getHeader("User-Agent");
		boolean isHTML5 = false;
		if (agent.startsWith("Mozilla/5.0")) {
			isHTML5 = true;
		}
		*/
		boolean ismobile = request.getServerName().startsWith(MOBILE_DOMAIN);
		
		
		if (AuthenticationUtil.isCurrentLogon()) {
			User user = userService.getUser(AuthenticationUtil.getCurrentUserName());
			
			if (ismobile) {
				response.sendRedirect("/user/" + AuthenticationUtil.getCurrentUser() + "/" 
						+ ((user.getMobileApp()==null)?applicationService.getMobileApp():user.getMobileApp()) + "/");
			} else {
				response.sendRedirect("/user/" + AuthenticationUtil.getCurrentUser() + "/" 
						+ ((user.getFirstApp()==null)?applicationService.getDefaultApp():user.getFirstApp()) + "/");
			}
		} else {
			if (ismobile) {
				response.sendRedirect("/m/index.html");
			} else {
				response.sendRedirect("/index.html");
			}
		}
		
		
	}

}
