package net.gqu.logging;

import java.util.Map;

import org.mozilla.javascript.Context;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;

/**
 * A basic logger.  
 * It provide three log levels and save them to mongodb capped collection
 * @author liuhan
 */
public abstract class Logger {
	
	protected int level;
	protected DBCollection collection;
	
	public void setLevel(int level) {
		this.level = level;
	}
	
	public Logger(int level, DBCollection collection) {
		super();
		this.level = level;
		this.collection = collection;
	}

	public void system(String obj) {
		StackTraceElement st = Thread.currentThread().getStackTrace()[3];
		Object data = Context.getCurrentContext().getDebuggerContextData();
	};

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
		Map<String, Object> map = getMap(message, type);
		collection.insert(new BasicDBObject(map));
	}
	
	public abstract Map<String, Object> getMap(String message, String type);
}
