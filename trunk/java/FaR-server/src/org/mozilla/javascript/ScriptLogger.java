package org.mozilla.javascript;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import net.gqu.logging.LoggingService;
import net.gqu.security.AuthenticationUtil;
import net.gqu.webscript.GQServlet;
import net.gqu.webscript.GQServlet.GQRequest;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;

public class ScriptLogger {
	
	
	private int level;
	private DBCollection collection;
	
	public ScriptLogger(DBCollection collection, int level) {
		this.collection = collection;
		this.level = level;
	}
	
	public void log(String log) {
		if (level >= LoggingService.BASIC) {
			save(log, "BASIC");
		}
	}
	public void debug(String debug) {
		if (level >= LoggingService.DEBUG) {
			save(debug, "DEBUG");
		}
	}
	public void info(String info) {
		if (level >= LoggingService.INFO) {
			save(info, "INFO");
		}
	}
	
	private void save(String message, String type) {
		int[] linep = { 0 };
		String z = Context.getSourcePositionFromStack(linep);
		Map<String, Object> map = getMap(linep[0], message, type);
		collection.insert(new BasicDBObject(map));
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
	
}
