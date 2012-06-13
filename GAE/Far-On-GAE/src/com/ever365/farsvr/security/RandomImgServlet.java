package com.ever365.farsvr.security;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 生成随机验证码
 * 
 * @author bitiliu
 * 
 */
public class RandomImgServlet extends HttpServlet {

	public static final String VALIDATE_CODE = "validateCode";

	private static final long serialVersionUID = 1L;

	public void init() throws ServletException {
	
	}

	protected void service(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, java.io.IOException {
		
		Integer i = Integer.parseInt(req.getParameter("max"));
		
		Integer v = (int) Math.floor(Math.random() * i);
		
		req.getSession().setAttribute(VALIDATE_CODE, v);
		
		resp.getWriter().println(v);
		
		resp.getWriter().close();
		
	}
}