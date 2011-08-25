package com.ever365.oauth.sina;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.SinaWeiboApi;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

import com.ever365.security.SetUserFilter;

/**
 * Servlet implementation class SinaAuthUrlServlet
 */
public class SinaAuthUrlServlet extends HttpServlet {
	public static final String _SINA_ACCESS_TOKEN = "_sina_access_token";
	private static final long serialVersionUID = 1L;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SinaAuthUrlServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		OAuthService service = new ServiceBuilder().provider(SinaWeiboApi.class)
		.apiKey("1385206646")
		.apiSecret("b0d8992e2c271bd514aadefdc53445cb")
		.callback("http://www.ever365.com/oauth/sina?code=0")
		.build();
		
		if (request.getParameter("code")!=null) {
			
			try {
				Verifier v = new Verifier(request.getParameter("code"));
				Token accessToken = service.getAccessToken((Token) request.getSession().getAttribute("_sina_req_token"), v);
				request.getSession().setAttribute(_SINA_ACCESS_TOKEN, accessToken);
				OAuthRequest oreq = new OAuthRequest(Verb.GET, "http://api.t.sina.com.cn/account/verify_credentials.json");
				service.signRequest(accessToken, oreq); // the access token from step 4
				Response ores = oreq.send();
				try {
					JSONObject jso = new JSONObject(ores.getBody());
					String userName = jso.getString("name") + "@weibo.com";
					request.getSession().setAttribute(SetUserFilter.AUTHENTICATION_USER, userName);
					
					response.sendRedirect("/");
				} catch (JSONException e) {
					e.printStackTrace();
				}
				
				System.out.println(ores.getBody());
				//System.out.println(response.getBody());
				
			} catch (Exception e) {
				response.sendRedirect("/login/sina.jsp?msg=error");
			}
			
		} else {
			Token token = service.getRequestToken();
			
			request.getSession().setAttribute("_sina_req_token", token);
			String sinaUrl = service.getAuthorizationUrl(token);
			
			response.sendRedirect(sinaUrl);
		}
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
