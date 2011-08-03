package com.ever365.vfile;

import java.io.InputStream;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletInputStream;

import org.bson.types.ObjectId;

import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

public class File {
	
	public static final String ID = "_id";
	public static final String MIMETYPE = "mimetype";
	public static final String SIZE = "size";
	public static final String MODIFIED = "modified";
	public static final String FOLDER = "folder";
	public static final String NAME = "name";
	public static final String PARENT_ID = "_parent_id";
	public static final String CREATOR = "creator";
	public static final String URL = "url";
	
	private VFileService fileService;
	private ObjectId fileId;
	private DBObject dbObject;
	
	public File(VFileService vFileService,
			 ObjectId fileId, DBObject dbObject) {
		super();
		this.fileService = vFileService;
		this.fileId = fileId;
		this.dbObject = dbObject;
	}
	
	
	
	public DBObject getDbObject() {
		return dbObject;
	}



	private File findChild(ObjectId parentId, String name) {
		DBObject found = fileService.getFileCollection().findOne(BasicDBObjectBuilder.start(PARENT_ID, parentId).append(NAME, name).get());
		if (found!=null) {
			return new File(fileService, (ObjectId)found.get(ID), found);
		}
		return null;
	}

	public File getByPath(String path) {
		DBCollection coll = fileService.getFileCollection();
		
		String[] paths = path.split("/");
		File found = this;
		for (int i = 0; i < paths.length; i++) {
			if ("".equals(paths[i])) continue;
			DBObject foundObj = coll.findOne(BasicDBObjectBuilder.start(PARENT_ID, found.fileId).append(NAME, paths[i]).get());
			if (foundObj!=null) {
				found = new File(fileService,(ObjectId)foundObj.get(ID), foundObj);
			} else {
				found = null;
				break;
			}
		}
		return found;
	}

	public File makeDir(String path) {
		DBCollection coll = fileService.getFileCollection();
		
		String[] paths = path.split("/");
		File found = this;
		for (int i = 0; i < paths.length; i++) {
			if ("".equals(paths[i])) continue;
			DBObject foundObj = coll.findOne(BasicDBObjectBuilder.start(PARENT_ID, found.fileId).append(NAME, paths[i]).get());
			if (foundObj!=null) {
				found = new File(fileService,(ObjectId)foundObj.get(ID), foundObj);
			} else {
				found = found.createFolder(paths[i]);
			}
		}
		return found;
	}
	

	public boolean isFolder() {
		return (Boolean)dbObject.get(FOLDER);
	}

	public InputStream getInputStream() {
		FileContentReader reader = fileService.getContentReader((String)dbObject.get(URL), null);
		return reader.getContentInputStream();
	}

	public File getParent() {
		return null;
	}

	public ObjectId getObjectId() {
		return fileId;
	}

	public void remove() {
		fileService.delete(this);
	}

	public void rename(String tName) {
		fileService.rename(this.dbObject, tName);
	}
	
	public void moveTo(File parent, boolean b) {
		fileService.moveTo(parent.dbObject, this.dbObject, b);
	}

	public List<File> getChildren() {
		return fileService.getChildren(this.fileId);
	}

	public String getName() {
		return (String) dbObject.get(NAME);
	}

	public Date getModified() {
		return (Date)dbObject.get(MODIFIED);
	}

	public long getSize() {
		return (Long) dbObject.get(SIZE);
	}


	public File createFile(String fileName, InputStream is) {
		return fileService.makeFile(this.fileId, fileName, false, is);
	}
	
	public File createFolder(String folderName) {
		return fileService.makeFile(this.fileId, folderName, true, null);
	}

	public String getCreator() {
		return (String) dbObject.get(CREATOR);
	}

	public void update(InputStream inputStream) {
		fileService.updateFile(dbObject, inputStream);
	}
}
