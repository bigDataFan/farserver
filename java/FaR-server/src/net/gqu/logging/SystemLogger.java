package net.gqu.logging;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.mongodb.DBCollection;

import net.gqu.security.AuthenticationUtil;

public class SystemLogger extends Logger {

	public SystemLogger(int level, DBCollection collection) {
		super(level, collection);
	}

	public Map<String, Object> getMap(String message, String type) {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("current", AuthenticationUtil.getCurrentUser());
		result.put("lineInfo", getLineInfo());
		result.put("message", message);
		result.put("time", new Date());
		result.put("level", level);
		return result;
	}

	private String getLineInfo() {
		StackTraceElement st = Thread.currentThread().getStackTrace()[4];
		return st.getClassName() + "." + st.getMethodName() + " " + st.getLineNumber();
	}
	
}
