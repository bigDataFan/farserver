package org.mozilla.javascript;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import net.gqu.logging.Logger;
import net.gqu.security.AuthenticationUtil;
import net.gqu.webscript.GQServlet;
import net.gqu.webscript.GQServlet.GQRequest;

import com.mongodb.DBCollection;

public class ScriptLogger extends Logger {
	
	public ScriptLogger(int level, DBCollection collection) {
		super(level, collection);
	}

	@Override
	public Map<String, Object> getMap(String message, String type) {
		int[] linep = { 0 };
		String z = Context.getSourcePositionFromStack(linep);
		
		Map<String, Object> result = new HashMap<String, Object>();
		GQRequest request = GQServlet.getThreadlocalRequest();
		result.put("current", AuthenticationUtil.getCurrentUser());
		if (request.getInstalledApplication()!=null) {
			result.put("owner", request.getInstalledApplication().getUser());
			result.put("app", request.getInstalledApplication().getApp());
		}
		result.put("script", request.getJsPath());
		result.put("queryPath", request.getTailPath());
		result.put("line", linep[0]);
		result.put("message", message);
		result.put("time", new Date());
		result.put("level", level);
		return result;
	}
	
}
