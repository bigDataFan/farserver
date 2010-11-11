package net.gqu.mongodb;


import java.net.UnknownHostException;

import com.mongodb.DB;
import com.mongodb.Mongo;
import com.mongodb.MongoException;

/**
 * Basically ,we will provide a mongodb instance for each Application. 
 * @author Administrator
 */
public class MongoDBProvider {
	
	private String mainDb = null;
	private Mongo mongo = null;
	
	public  Mongo getMongo() {
		return mongo;
	}
	
	public DB getMainDB() {
		return mongo.getDB(mainDb);
	}
	
	public DB getApplicationDB(String application) {
		return mongo.getDB(application);
	}
	
	
	private String ip;
	private String port;
	
	public String getIp() {
		return ip;
	}
	public void setMainDb(String mainDb) {
		this.mainDb = mainDb;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public void init() {
		try {
			mongo = new Mongo(ip, Integer.parseInt(port));
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (MongoException e) {
			e.printStackTrace();
		}
	}
	
}
