package com.ever365.vfile;

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
	
	private static final String ID = "_id";
	private static final String V_FILE_DB = "VFile.db";
	private static final String FILES = "files";
	private static final String MIMETYPE = "mimetype";
	private static final String SIZE = "size";
	private static final String MODIFIED = "modified";
	private static final String FOLDER = "folder";
	private static final String NAME = "name";
	private static final String PARENT_ID = "_parent_id";
	private static final String URL = "url";
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
	
	public File makeFile(ObjectId parentId, String name, boolean isFolder, InputStream is) {
		
		DBObject dbo = new BasicDBObject();
		dbo.put(PARENT_ID, parentId);
		dbo.put(NAME, name);
		dbo.put(FOLDER, isFolder);
		dbo.put(MODIFIED, new Date());
		if (!isFolder && is!=null) {
			FileContentWriter writer = fileContentStore.getContentWriter();
			writer.putContent(is);
			dbo.put(URL, writer.getUri());
			dbo.put(SIZE, writer.getSize());
			dbo.put(MIMETYPE, MimeTypeUtils.guess(name));
		}
		
		WriteResult result = getFileCollection().update(BasicDBObjectBuilder.start(PARENT_ID, parentId).append(NAME, name).get(), dbo, true, false);
		return new File(provider, fileContentStore, root, (ObjectId)dbo.get(ID), dbo);
	}
	
	private File findChild(ObjectId parentId, String name) {
		DBObject found = getFileCollection().findOne(BasicDBObjectBuilder.start(PARENT_ID, parentId).append(NAME, name).get());
		if (found!=null) {
			return new File(provider, this.fileContentStore, root, (ObjectId)found.get(ID), found);
		}
		return null;
	}

	public File getByPath(String path) {
		DBCollection coll = getFileCollection();
		
		String[] paths = path.split("/");
		File found = this;
		for (int i = 0; i < paths.length; i++) {
			DBObject foundObj = coll.findOne(BasicDBObjectBuilder.start(PARENT_ID, found.fileId).append("parentName", paths[i]).get());
			if (foundObj!=null) {
				found = new File(provider,this.fileContentStore,this.root,(ObjectId) foundObj.get(ID), foundObj);
			} else {
				found = null;
				break;
			}
		}
		return found;
	}

	
	private DBCollection getFileCollection() {
		DB db = provider.getMongo().getDB(V_FILE_DB);
		return db.getCollection(FILES);
	}

	public boolean isFolder() {
		return (Boolean)dbObject.get(FOLDER);
	}

	public InputStream getInputStream() {
		FileContentReader reader = fileContentStore.getContentReader((String)dbObject.get(URL), null);
		return reader.getContentInputStream();
	}

	public File getParent() {
		return null;
	}

	public ObjectId getObjectId() {
		return (ObjectId) dbObject.get(ID);
	}

	public void remove() {
		
	}

	public void rename(String tName) {
		
	}

	public void moveTo(File parent, boolean b) {
		
	}

	public void createFolder(String folderName) {
		
	}
	
}
