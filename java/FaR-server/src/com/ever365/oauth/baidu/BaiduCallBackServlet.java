package com.ever365.oauth.baidu;

import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import sun.net.www.http.HttpClient;

/**
 * Servlet implementation class BaiduCallBackServlet
 */
public class BaiduCallBackServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public BaiduCallBackServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		HttpClient client = HttpClient.New(new URL("https://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code&code=a8ff6b3d78a7fb408580a7632da59829&client_id=waxDdavqGbR1K3qx19pyorqg&client_secret=cOmGYEZUvFIc1YMqm1Aoz8zik7vFDvZo&redirect_uri=http%3A%2F%2Fwww.ever365.com"));
		
		
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}
	
	public static void main(String[] args) {
		System.out.println(URLEncoder.encode("http://www.ever365.com/oauth/baidu"));
	}

}
