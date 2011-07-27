package com.ever365.collections.mongodb;


import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mongodb.DB;
import com.mongodb.Mongo;
import com.mongodb.MongoException;
import com.mongodb.MongoOptions;
import com.mongodb.ServerAddress;

/**
 * Basically ,we will provide a mongodb instance for each Application. 
 * @author Administrator
 */
public class MongoDBDataSource {
	
	private static final String USER_DB = "userdb";
	private static final String SYSTEM_DB = "systemdb";
	private static final String PUBLIC_DB = "public";

	public static final String ARCHIVES = "archives";
	private static final String MONGODB = "mongodb://";
	
	public static final String _ID = "_id";
	
	private String mainDb = null;
	private Mongo mongo = null;
	private Map<String, Mongo> mongos = new HashMap<String, Mongo>();
	private Map<String, DB> mongodbMap = new HashMap<String, DB>();
	private int connectionsPerHost;
	
	
	public void setConnectionsPerHost(int connectionsPerHost) {
		this.connectionsPerHost = connectionsPerHost;
	}
	public  Mongo getMongo() {
		return mongo;
	}
	public DB getMainDB() {
		return mongo.getDB(SYSTEM_DB);
	}
	
	public DB getPublicDB() {
		return mongo.getDB(PUBLIC_DB);
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
	
	public DB getUserDB(String user) {
		return mongo.getDB(USER_DB);
	}
	
	private DB getMongoDBByUrl(String mongodbUrl) {
		DB db;
		if (mongodbUrl.startsWith(MONGODB)) {
			mongodbUrl = mongodbUrl.substring(MONGODB.length());
		} else {
			throw new RuntimeException("Illegle mongodb urls" + mongodbUrl);
		}
		String serverPart = mongodbUrl.substring(0, mongodbUrl.indexOf("/"));
		String[] servers = serverPart.split(",");
		int paramPos = mongodbUrl.indexOf("?");
		String dbname = null;
		if (paramPos==-1) {
			dbname = mongodbUrl.substring(mongodbUrl.indexOf("/")+1);
		} else {
			dbname = mongodbUrl.substring(mongodbUrl.indexOf("/")+1, paramPos);
		}
		Mongo mongo = mongos.get(serverPart);
		if (mongo==null) {
			try {
				MongoOptions mo = new MongoOptions();
				mo.connectionsPerHost = connectionsPerHost;
				
				List<ServerAddress> serverAddresses = new ArrayList<ServerAddress>();
				for (String server : servers) {
					String[] splits = server.split(":");
					serverAddresses.add(new ServerAddress(splits[0], Integer.parseInt(splits[1])));
				}
				mongo = new Mongo(serverAddresses, mo); 
					//new Mongo(server, Integer.parseInt(port),);
				mongos.put(serverPart, mongo);
			} catch (UnknownHostException e) {
				
			} catch (MongoException e) {
				
			}
		}
		db = mongo.getDB(dbname);
		return db;
	}
	
	
}
