package com.ever365.vfile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import net.gqu.utils.MimeTypeUtils;

import org.bson.types.ObjectId;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.WriteResult;

public class VFileService {
	
	private static final String V_FILE_DB = "VFiles";
	private static final String FILES = "files";
	

	private MongoDBDataSource dataSource;
	private FileContentStore fileContentStore;
	
	
	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
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
		
		ObjectId newId = null;
		if ((Boolean)result.getField("updatedExisting")) {
			
		} else {
			newId = (ObjectId)result.getField("upserted");
		}
		
		return new File(this, newId, dbo);
	}
	

	public File updateFile(DBObject dbo, InputStream is) {
		
		dbo.put(File.MODIFIED, new Date());
		if (is!=null) {
			fileContentStore.remove((String)dbo.get(File.URL));
			FileContentWriter writer = getContentWriter();
			writer.putContent(is);
			dbo.put(File.URL, writer.getUri());
			dbo.put(File.SIZE, writer.getSize());
		}
		WriteResult result = getFileCollection().update(BasicDBObjectBuilder.start(File.PARENT_ID, dbo.get(File.PARENT_ID)).append(File.NAME, dbo.get(File.NAME)).get(), dbo, true, false);
		
		ObjectId newId = null;
		if ((Boolean)result.getField("updatedExisting")) {
			
		} else {
			newId = (ObjectId)result.getField("upserted");
		}
		
		return new File(this, newId, dbo);
	}

	public List<File> getChildren(ObjectId parentId) {
		
		List<File> list = new ArrayList<File>();
		
		DBCursor result = getFileCollection().find(new BasicDBObject(File.PARENT_ID, parentId));
		
		while (result.hasNext()) {
			DBObject dbo = result.next();
			list.add(new File(this, (ObjectId)dbo.get(File.ID),dbo));
		}
		return list;
	}
	
	public DBCollection getFileCollection() {
		DB db = dataSource.getMongo().getDB(V_FILE_DB);
		return db.getCollection(FILES);
	}

	public FileContentReader getContentReader(String contentUrl, Object object) {
		// TODO Auto-generated method stub
		return fileContentStore.getContentReader(contentUrl, null);
	}

	public void rename(DBObject dbo, String tName) {
		if (dbo.get(File.NAME).equals(tName)) {
			return;
		}
		DBObject found = getFileCollection().findOne(BasicDBObjectBuilder.start().add(File.PARENT_ID, dbo.get(File.PARENT_ID))
				.add(File.NAME, tName).get());
		
		if (found==null) {
			dbo.put(File.NAME, tName);
			getFileCollection().update(new BasicDBObject(File.ID, dbo.get(File.ID)), dbo);
		}
	}

	public void copyTo(DBObject targetParent, DBObject current, boolean b) {
		if (current.get(File.PARENT_ID).equals(targetParent.get(File.ID))) return;
		DBObject found = getFileCollection().findOne(BasicDBObjectBuilder.start().add(File.PARENT_ID, targetParent.get(File.ID))
				.add(File.NAME, current.get(File.NAME)).get());
		
		if (found==null) {
			makeFile((ObjectId)targetParent.get(File.ID), (String)current.get(File.NAME), false, getContentReader((String)current.get(File.URL), null).getContentInputStream());
		}
	}
	
	public void moveTo(DBObject targetParent, DBObject current, boolean b) {
		
		if (current.get(File.PARENT_ID).equals(targetParent.get(File.ID))) return;
		
		
		DBObject found = getFileCollection().findOne(BasicDBObjectBuilder.start().add(File.PARENT_ID, targetParent.get(File.ID))
				.add(File.NAME, current.get(File.NAME)).get());
		
		if (found==null) {
			current.put(File.PARENT_ID, targetParent.get(File.ID));
			getFileCollection().update(new BasicDBObject(File.ID, current.get(File.ID)), current);
		}
		
	}

	
}
