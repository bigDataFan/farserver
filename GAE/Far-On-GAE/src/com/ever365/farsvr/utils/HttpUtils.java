package com.ever365.farsvr.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

public class HttpUtils {

	public static Map<String, Object> get(String urlstr) {
		try {
			URL url = new URL(urlstr);
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					url.openStream()));
			String line;

			StringBuffer result = new StringBuffer();
			
			while ((line = reader.readLine()) != null) {
				result.append(line);
			}
			reader.close();

			return JSONUtils.jsonObjectToMap(new JSONObject(result.toString()));

		} catch (MalformedURLException e) {
			
		} catch (IOException e) {
			
		} catch (JSONException e) {
			
		}

		return null;
	}

}
