package net.gqu.webscript.object;

import com.ever365.security.AuthenticationUtil;
import com.mongodb.DB;
import com.mongodb.DBCollection;

public class ScriptMongoDB {
	
	private DBCollection userCollection;
	private DB currentDB;
	public ScriptMongoDB(DB provideddb) {
		currentDB = provideddb;
		userCollection = currentDB.getCollection(AuthenticationUtil.getContextUser());
	}

	public ScriptMongoDBCollection getCollection(String name) {
		DBCollection coll = userCollection.getCollection(name);
		return new ScriptMongoDBCollection(coll);
	}
}
	



