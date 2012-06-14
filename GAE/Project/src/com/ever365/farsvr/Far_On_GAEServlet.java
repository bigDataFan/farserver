package com.ever365.farsvr;

import java.io.IOException;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class Far_On_GAEServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		resp.setContentType("text/plain");
		resp.getWriter().println("Hello, world");
	}
}
