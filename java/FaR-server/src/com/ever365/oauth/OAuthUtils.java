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
				.apiKey("1385206646")
				.apiSecret("b0d8992e2c271bd514aadefdc53445cb")
				.callback("http://www.ever365.com/oauth/sina?service_provider_id=0")
				.build();
		}
		
		return sinaOAuthService;
	}
	
	
}
