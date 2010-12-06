package net.gqu.webscript.object;

import net.gqu.mongodb.MongoDBProvider;
import net.gqu.security.AuthenticationUtil;

import com.mongodb.DB;
import com.mongodb.DBCollection;

public class ScriptMongoDB {
	
	private DBCollection collection;

	public ScriptMongoDB(MongoDBProvider dbProvider, String db,
			String collectionList) {
		String[] colarray = collectionList.split("/");
		
		DB mongodb = dbProvider.getMongo().getDB(db);
		collection = mongodb.getCollection(AuthenticationUtil.getContextUser());
		for (int i = 0; i < colarray.length; i++) {
			collection = collection.getCollection(colarray[i]);
		}
	}

	public ScriptMongoDBCollection getRootCollection() {
		return new ScriptMongoDBCollection(collection);
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
	



