package net.gqu.utils;

import org.json.JSONException;
import org.mozilla.javascript.NativeObject;


public class ScriptUtils {

	
	public NativeObject evalJsonString(String json) {
		try {
			return JSONUtils.toObject(json);
		} catch (JSONException e) {
		}
		return null;
	}
	
	public NativeObject[] evalJsonArray(String json) {
		return JSONUtils.toObjectArray(json);
	}
	
	
}
