package net.gqu.repository;

import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

public class HttpLoader {

	private static Log logger = LogFactory.getLog(HttpLoader.class);
	
	public static HttpResponse load(String url) {
		HttpClient httpclient = new DefaultHttpClient();
		HttpGet httpget = new HttpGet(url);
		try {
			return httpclient.execute(httpget);
		} catch (ClientProtocolException e) {
			logger.debug("ClientProtocolException");
			return null;
		} catch (IOException e) {
			logger.debug("IOException");
			return null;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
		
	}
}
