package org.mozilla.javascript;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import net.gqu.logging.Logger;
import net.gqu.security.AuthenticationUtil;
import net.gqu.webscript.GQServlet;
import net.gqu.webscript.GQServlet.GQRequest;

import com.mongodb.DBCollection;

public class ScriptLogger  extends Logger {
	
	public ScriptLogger(DBCollection collection, int level) {
		this.collection = collection;
		this.level = level;
	}
	
	
	
	
	public Map<String, Object> getMap(int line, String message, String level) {
		Map<String, Object> result = new HashMap<String, Object>();
		
		GQRequest request = GQServlet.getThreadlocalRequest();
		result.put("current", AuthenticationUtil.getCurrentUser());
		result.put("owner", request.getInstalledApplication().getUser());
		result.put("app", request.getInstalledApplication().getApp());
		result.put("script", request.getJsPath());
		result.put("queryPath", request.getTailPath());
		result.put("line", line);
		result.put("message", message);
		result.put("time", new Date());
		result.put("level", level);
		return result;
	}

	@Override
	public String getCurrentLineInfo() {
		// TODO Auto-generated method stub
		return null;
	}





	@Override
	public Map<String, Object> getMap(String message, String type) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
