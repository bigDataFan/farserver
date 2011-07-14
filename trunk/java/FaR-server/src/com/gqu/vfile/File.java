package com.gqu.vfile;

import java.io.InputStream;

import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.sun.corba.se.spi.ior.ObjectId;

import net.gqu.mongodb.MongoDBProvider;

public class File {
	
	private MongoDBProvider provider;
	
	private File  root;
	private ObjectId fileId;
	private DBObject dbObject;
	
	
	public File(DBObject dbObject) {
		super();
		this.dbObject = dbObject;
	}

	public File getRoot() {
		return root;
	}
	
	public File getByPath(String path) {
		DBCollection coll = getFileCollection();
		
		String[] paths = path.split("/");
		
		File found = this;
		for (int i = 0; i < paths.length; i++) {
			DBObject foundObj = coll.findOne(BasicDBObjectBuilder.start("_id", found.fileId).append("parentName", paths[i]).get());
			if (foundObj!=null) {
				found = new File(foundObj);
			} else {
				found = null;
				break;
			}
		}
		return found;
	}

	private DBCollection getFileCollection() {
		DB db = provider.getMongo().getDB("VFile.db");
		return db.getCollection("files");
	}
	
	
	
}
