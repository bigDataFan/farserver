package net.gqu.webscript.object;

import net.gqu.application.ApplicationService;
import net.gqu.mongodb.MongoDBProvider;
import net.gqu.security.AuthenticationUtil;
import net.gqu.webscript.GQServlet;

import com.mongodb.DB;
import com.mongodb.DBCollection;

public class ScriptMongoDB {
	
	private DBCollection userCollection;
	private MongoDBProvider dbProvider;
	private DB currentDB;
	public ScriptMongoDB(MongoDBProvider dbProvider, String db) {
		this.dbProvider = dbProvider;
		currentDB = dbProvider.getMongo().getDB(db);
		userCollection = currentDB.getCollection(AuthenticationUtil.getContextUser());
	}

	public ScriptMongoDBCollection getSystemCollection(String name) {
		DB mongodb = dbProvider.getMainDB();
		ScriptMongoDBCollection smd = new ScriptMongoDBCollection(mongodb.getCollection(name));
		smd.setReadOnly(true);
		return smd;
	}
	
	//prepare a single collection for this application
	public ScriptMongoDBCollection getApplictionCollection(String collName) {
		return new ScriptMongoDBCollection(
				dbProvider.getMongo().getDB(
						(String)GQServlet.threadlocalRequest.get().getApprovedApplication().get(ApplicationService.APP_CONFIG_NAME)
				).getCollection(collName));
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
	@Deprecated
	public ScriptMongoDBCollection getCollection(String name) {
		DBCollection coll = userCollection.getCollection(name);
		return new ScriptMongoDBCollection(coll);
	}
	
	public ScriptMongoDBCollection getUserCollection(String name) {
		DBCollection coll = userCollection.getCollection(name);
		return new ScriptMongoDBCollection(coll);
	}
}
	



