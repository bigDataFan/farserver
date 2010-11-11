package net.gqu.content;

import java.io.InputStream;

import org.bson.types.ObjectId;

import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;

import net.gqu.mongodb.MongoDBProvider;

public class GridFSContentService  implements ContentService {

	
	public void setDbProvider(MongoDBProvider dbProvider) {
		this.dbProvider = dbProvider;
	}

	private MongoDBProvider dbProvider;
	
	@Override
	public InputStream getContent(String id) {
		DB contentDB = dbProvider.getMongo().getDB("contents");
		
		GridFS gridFS = new GridFS(contentDB);
		GridFSDBFile file = gridFS.find(new ObjectId(id));
		return file.getInputStream();
	}

	@Override
	public String putContent(InputStream is) {
		DB contentDB = dbProvider.getMongo().getDB("contents");
		
		GridFS gridFS = new GridFS(contentDB);
		GridFSInputFile file = gridFS.createFile(is);
		return (String) file.getId();
	}

	@Override
	public boolean removeFile(String id) {
		DB contentDB = dbProvider.getMongo().getDB("contents");
		
		GridFS gridFS = new GridFS(contentDB);
		gridFS.remove(new ObjectId(id));
		return true;
	}

}
