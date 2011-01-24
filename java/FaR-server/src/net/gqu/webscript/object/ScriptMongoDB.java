package net.gqu.webscript.object;

import net.gqu.mongodb.MongoDBProvider;
import net.gqu.security.AuthenticationUtil;

import com.mongodb.DB;
import com.mongodb.DBCollection;

public class ScriptMongoDB {
	
	private DBCollection collection;
	private MongoDBProvider dbProvider;
	private DB currentDB;
	public ScriptMongoDB(MongoDBProvider dbProvider, String db,
			String appName) {
		this.dbProvider = dbProvider;
		currentDB = dbProvider.getMongo().getDB(appName);
		collection = currentDB.getCollection(AuthenticationUtil.getContextUser());
	}

	public ScriptMongoDBCollection getRootCollection() {
		return new ScriptMongoDBCollection(collection);
	}
	
	public ScriptMongoDBCollection getSystemCollection(String name) {
		DB mongodb = dbProvider.getMainDB();
		
		ScriptMongoDBCollection smd = new ScriptMongoDBCollection(mongodb.getCollection(name));
		smd.setReadOnly(true);
		return smd;
	}
	
	public ScriptMongoDBCollection getGlobalCollection(String name) {
		return new ScriptMongoDBCollection(currentDB.getCollection(name));
	}

	/*
	public ScriptMongoDBCollection createCappedCollections(String name, int max) {
		BasicDBObject options = new BasicDBObject();
		options.append("capped", true);
		options.append("max", max);
		return new ScriptMongoDBCollection(collection.getCollection());
	}
	*/
	public ScriptMongoDBCollection getCollection(String name) {
		DBCollection coll = collection.getCollection(name);
		return new ScriptMongoDBCollection(coll);
	}
}
	



