package com.ever365.oauth;

import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.SinaWeiboApi;
import org.scribe.model.Token;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

public class SinoOAuthUtils {
	
	public static String getRedirectedUrl() {
		
		OAuthService service = new ServiceBuilder()
        .provider(SinaWeiboApi.class)
        .apiKey("1385206646")
        .apiSecret("b0d8992e2c271bd514aadefdc53445cb")
        .callback("http://www.ever365.com/sina_oauth?service_provider_id=")
        .build();
		Token token = service.getRequestToken();
		
		return service.getAuthorizationUrl(token);
	}
	
	
	public static String getAccessToken(String code) {
		Verifier v = new Verifier(code);
		
		OAuthService service = new ServiceBuilder()
        .provider(SinaWeiboApi.class)
        .apiKey("1385206646")
        .apiSecret("b0d8992e2c271bd514aadefdc53445cb")
        .callback("http://www.ever365.com")
        .build();
		Token token = service.getRequestToken();
		
		Token accessToken = service.getAccessToken(token, v); 
		
		return null;
	}
	
	public static void main(String[] args) {
		System.out.println(SinoOAuthUtils.getRedirectedUrl());
		
	}
}
