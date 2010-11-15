package net.gqu.content;

import net.gqu.jscript.root.ContentFile;
import net.gqu.mongodb.MongoDBProvider;

import org.bson.types.ObjectId;

import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;

public class GridFSContentService  implements ContentService {

	
	public void setDbProvider(MongoDBProvider dbProvider) {
		this.dbProvider = dbProvider;
	}

	private MongoDBProvider dbProvider;
	
	@Override
	public ContentFile getContent(String id) {
		DB contentDB = dbProvider.getMongo().getDB("contents");
		GridFS gridFS = new GridFS(contentDB);
		GridFSDBFile file = gridFS.find(new ObjectId(id));
		
		ContentFile contentFile = new ContentFile();
		contentFile.setModified(file.getUploadDate());
		contentFile.setMimetype(file.getContentType());
		contentFile.setContent(file.getInputStream());
		contentFile.setFileName(file.getFilename());
		contentFile.setSize(file.getLength());
		return contentFile;
	}

	@Override
	public String putContent(ContentFile contentFile) {
		DB contentDB = dbProvider.getMongo().getDB("contents");
		
		GridFS gridFS = new GridFS(contentDB);
		GridFSInputFile file = gridFS.createFile(contentFile.getInputStream(), contentFile.getFileName());
		file.setContentType(contentFile.getMimetype());
		file.save();
		ObjectId id = (ObjectId) file.getId();
		return id.toString();
	}

	@Override
	public boolean removeFile(String id) {
		DB contentDB = dbProvider.getMongo().getDB("contents");
		
		GridFS gridFS = new GridFS(contentDB);
		gridFS.remove(new ObjectId(id));
		return true;
	}
}
