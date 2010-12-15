package net.gqu.webscript.object;

import org.json.JSONException;
import org.mozilla.javascript.NativeObject;

import net.gqu.utils.JSONUtils;
import net.gqu.utils.StringUtils;

public class ScriptUtils extends StringUtils {

	private static ScriptUtils instance;

	private ScriptUtils() {
		super();
	}

	public static final ScriptUtils getInstance() {
		if (instance==null) {
			instance = new ScriptUtils();
		}
		return instance;
	}
	
	
	public NativeObject[] evalJsonArray(String s) {
		return JSONUtils.toObjectArray(s);
	}
	
	public NativeObject evalJsonObject(String s) {
		try {
			return JSONUtils.toObject(s);
		} catch (JSONException e) {
			return null;
		}
	}
	
	
	public static String[]  trimArrayString(String[] srcAry) {
		return org.springframework.util.StringUtils.trimArrayElements(srcAry);
	}
	
}
