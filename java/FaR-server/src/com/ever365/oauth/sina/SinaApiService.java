package com.ever365.oauth.sina;

import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;

import com.ever365.oauth.OAuthUtils;
import com.ever365.rest.registry.RestParam;
import com.ever365.rest.registry.RestService;
import com.ever365.security.SetUserFilter;

public class SinaApiService {
	
	@RestService(method="POST", uri="/sina/update")
	public int statusUpdate(@RestParam(value="msg")String msg) {
		Object token = SetUserFilter.currentSession.get().getAttribute(SinaAuthUrlServlet._SINA_ACCESS_TOKEN);
		if (token!=null) {
			Token accessToken = (Token) token;
			
			OAuthRequest oreq = new OAuthRequest(Verb.POST, "http://api.t.sina.com.cn/statuses/update.json");
			
			oreq.addBodyParameter("status", msg);
			
			OAuthUtils.getSinaOAuthService().signRequest(accessToken, oreq); 
			Response resp = oreq.send();
			
			return resp.getCode();
		} else {
			return 401;
		}
	}
	
}
