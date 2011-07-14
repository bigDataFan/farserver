package com.gqu.vfile;

import java.io.InputStream;
import java.util.Date;

import net.gqu.mongodb.MongoDBProvider;
import net.gqu.utils.MimeTypeUtils;

import org.bson.types.ObjectId;

import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.WriteResult;

public class File {
	
	private MongoDBProvider provider;
	private FileContentStore fileContentStore;
	private File root;
	private ObjectId fileId;
	private DBObject dbObject;

	
	
	public File(MongoDBProvider provider, FileContentStore fileContentStore,
			File root, ObjectId fileId, DBObject dbObject) {
		super();
		this.provider = provider;
		this.fileContentStore = fileContentStore;
		this.root = root;
		this.fileId = fileId;
		this.dbObject = dbObject;
	}

	public File getRoot() {
		
		if (root==null) {
			if (getFileCollection().getCount()==0) {
				makeFile(null, "ROOT", true, null);
			}
		}
		
		return root;
	}
	
	private File makeFile(ObjectId parentId, String name, boolean isFolder, InputStream is) {
		
		DBObject dbo = new BasicDBObject();
		dbo.put("_parent_id", parentId);
		dbo.put("name", name);
		dbo.put("folder", isFolder);
		dbo.put("modified", new Date());
		if (!isFolder && is!=null) {
			FileContentWriter writer = fileContentStore.getContentWriter();
			writer.putContent(is);
			dbo.put("url", writer.getUri());
			dbo.put("size", writer.getSize());
			dbo.put("mimetype", MimeTypeUtils.guess(name));
		}
		
		WriteResult result = getFileCollection().update(BasicDBObjectBuilder.start("_parent_id", parentId).append("name", name).get(), dbo, true, false);
		return new File(provider, fileContentStore, root, (ObjectId)dbo.get("_id"), dbo);
	}
	
	private File findChild(ObjectId parentId, String name) {
		DBObject found = getFileCollection().findOne(BasicDBObjectBuilder.start("_parent_id", parentId).append("name", name).get());
		if (found!=null) {
			return new File(provider, this.fileContentStore, root, (ObjectId)found.get("_id"), found);
		}
		return null;
	}

	public File getByPath(String path) {
		DBCollection coll = getFileCollection();
		
		String[] paths = path.split("/");
		File found = this;
		for (int i = 0; i < paths.length; i++) {
			DBObject foundObj = coll.findOne(BasicDBObjectBuilder.start("_parent_id", found.fileId).append("parentName", paths[i]).get());
			if (foundObj!=null) {
				found = new File(provider,this.fileContentStore,this.root,(ObjectId) foundObj.get("_id"), foundObj);
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
