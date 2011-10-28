package com.ever365.oauth.sina;

import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;

import com.ever365.oauth.OAuthUtils;
import com.ever365.rest.registry.RestParam;
import com.ever365.rest.registry.RestService;
import com.ever365.security.AuthenticationUtil;

public class WeiboService {
	
	@RestService(method="GET", uri="/weibo/friends")
	public String getFriends(@RestParam(value="pc")Integer pc, @RestParam(value="nc")Integer nc) {
		if (AuthenticationUtil.getSinaAccessToken()==null) return "Plean Login To Sina";
		
		OAuthService service =  OAuthUtils.getSinaOAuthService();
		OAuthRequest oreq = new OAuthRequest(Verb.GET, "http://api.weibo.com/2/friendships/friends.json?source=1365238076");
		service.signRequest(AuthenticationUtil.getSinaAccessToken(), oreq); 
		Response ores = oreq.send();
		return ores.getBody();
	}
	
	
	@RestService(method="GET", uri="/weibo/my")
	public String getRecentWeiBo() {
		if (AuthenticationUtil.getSinaAccessToken()==null) return "Plean Login To Sina";
		
		OAuthService service =  OAuthUtils.getSinaOAuthService();
		OAuthRequest oreq = new OAuthRequest(Verb.GET, "http://api.weibo.com/2/statuses/user_timeline.json?source=1365238076");
		service.signRequest(AuthenticationUtil.getSinaAccessToken(), oreq); 
		Response ores = oreq.send();
		return ores.getBody();
		/*
		try {
			
			JSONObject jso = new JSONObject(ores.getBody());
			return jso;
		} catch (JSONException e) {
			e.printStackTrace();
		}*/
	}
}
