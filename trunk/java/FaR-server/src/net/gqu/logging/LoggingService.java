package net.gqu.logging;

import java.util.HashMap;
import java.util.Map;

import net.gqu.mongodb.MongoDBProvider;

import org.mozilla.javascript.ScriptLogger;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;


public class LoggingService {
	public static final String SCRIPT_LOGS = "scriptlogs";
	public static final String SYSTEM_LOGS = "systemlogs";
	
	public static final int SYSTEM 	= 0;
	public static final int BASIC 	= 1;
	public static final int INFO 	= 2;
	public static final int DEBUG 	= 3;
	
	
	private int level;
	private int scriptMax;
	private int systemMax;
	
	private ScriptLogger scriptLogger;
	private SystemLogger systemLogger;
	
	private DBCollection scriptLogColls;
	private DBCollection systemLogColls;
	private MongoDBProvider dbProvider;
	
	public void setLevel(int level) {
		this.level = level;
	}
	
	public void cleanLog() {
		dbProvider.getMainDB().getCollection(SCRIPT_LOGS).drop();
		dbProvider.getMainDB().getCollection(SYSTEM_LOGS).drop();
	}

	public void init() {
		if (!dbProvider.getMainDB().collectionExists(SCRIPT_LOGS)) {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("capped", true);
			m.put("max", scriptMax);
			dbProvider.getMainDB().createCollection(SCRIPT_LOGS, new BasicDBObject(m));
		}
		scriptLogColls = dbProvider.getMainDB().getCollection(SCRIPT_LOGS);

		if (!dbProvider.getMainDB().collectionExists(SYSTEM_LOGS)) {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("capped", true);
			m.put("max", systemMax);
			dbProvider.getMainDB().createCollection(SYSTEM_LOGS, new BasicDBObject(m));
		}
		
		systemLogColls = dbProvider.getMainDB().getCollection(SYSTEM_LOGS);
		scriptLogger = new ScriptLogger(level, scriptLogColls);
		systemLogger = new SystemLogger(level, systemLogColls);
	}
	
	
	public void setDbProvider(MongoDBProvider dbProvider) {
		this.dbProvider = dbProvider;
		
	}

	public SystemLogger getLogger() {
		return systemLogger;
	}
	
	
	public ScriptLogger getScriptLogger() {
		return scriptLogger;
	}

}
