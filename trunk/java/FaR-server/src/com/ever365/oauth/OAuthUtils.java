package com.ever365.oauth;

import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.SinaWeiboApi;
import org.scribe.oauth.OAuthService;

public class OAuthUtils {
	static OAuthService sinaOAuthService = null; 
	
	public static OAuthService getSinaOAuthService() {
		if (sinaOAuthService==null) {
			sinaOAuthService = 
				new ServiceBuilder().provider(SinaWeiboApi.class)
				.apiKey("1365238076")
				.apiSecret("7177e20f50d259342a46b186c9d3893d")
				.callback("http://www.ever365.com/oauth/sina?service_provider_id=0")
				.build();
		}
		
		return sinaOAuthService;
	}
	
	
}
