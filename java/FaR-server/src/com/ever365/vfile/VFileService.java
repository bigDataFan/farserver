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

public class VFileService {
	
	private static final String V_FILE_DB = "VFiles";
	private static final String FILES = "files";
	

	private MongoDBProvider provider;
	private FileContentStore fileContentStore;
	
	
	
	public void setProvider(MongoDBProvider provider) {
		this.provider = provider;
	}

	public void setFileContentStore(FileContentStore fileContentStore) {
		this.fileContentStore = fileContentStore;
	}

	private File rootFile;
	
	public File getRootFile() {
		if (rootFile==null) {
			if (getFileCollection().getCount()==0) {
				rootFile = makeFile(null, "ROOT", true, null);
			} else {
				DBObject rootdbo = getFileCollection().findOne(new BasicDBObject(File.PARENT_ID, null));
				rootFile = new File(this, (ObjectId)rootdbo.get(File.ID), rootdbo);
			}
		}
		return rootFile;
	}

	public FileContentWriter getContentWriter() {
		return fileContentStore.getContentWriter();
	}
	
	public File makeFile(ObjectId parentId, String name, boolean isFolder, InputStream is) {
		
		DBObject dbo = new BasicDBObject();
		dbo.put(File.PARENT_ID, parentId);
		dbo.put(File.NAME, name);
		dbo.put(File.FOLDER, isFolder);
		dbo.put(File.MODIFIED, new Date());
		if (!isFolder && is!=null) {
			FileContentWriter writer = getContentWriter();
			writer.putContent(is);
			dbo.put(File.URL, writer.getUri());
			dbo.put(File.SIZE, writer.getSize());
			dbo.put(File.MIMETYPE, MimeTypeUtils.guess(name));
		}
		
		WriteResult result = getFileCollection().update(BasicDBObjectBuilder.start(File.PARENT_ID, parentId).append(File.NAME, name).get(), dbo, true, false);
		return new File(this, (ObjectId)dbo.get(File.ID), dbo);
	}

	
	public DBCollection getFileCollection() {
		DB db = provider.getMongo().getDB(V_FILE_DB);
		return db.getCollection(FILES);
	}

	public FileContentReader getContentReader(String contentUrl, Object object) {
		// TODO Auto-generated method stub
		return fileContentStore.getContentReader(contentUrl, null);
	}

	
}
