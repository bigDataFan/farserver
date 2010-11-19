package net.gqu.content;

import net.gqu.exception.HttpStatusExceptionImpl;
import net.gqu.jscript.root.ContentFile;
import net.gqu.mongodb.MongoDBProvider;
import net.gqu.security.AuthenticationUtil;
import net.gqu.security.BasicUserService;
import net.gqu.security.Role;
import net.gqu.security.User;

import org.bson.types.ObjectId;

import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;

public class GridFSContentService  implements ContentService {

	
	public void setDbProvider(MongoDBProvider dbProvider) {
		this.dbProvider = dbProvider;
	}

	
	public BasicUserService getUserService() {
		return userService;
	}

	public void setUserService(BasicUserService userService) {
		this.userService = userService;
	}


	private BasicUserService userService;
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
		User currentUser = AuthenticationUtil.getCurrentUser();
		if (currentUser==null) return null;
		
		userService.incUserUsage(currentUser.getName(), contentFile.getSize());
		
		GridFS gridFS = new GridFS(contentDB);
		GridFSInputFile file = gridFS.createFile(contentFile.getInputStream(), contentFile.getFileName());
		file.setContentType(contentFile.getMimetype());
		file.save();
		ObjectId id = (ObjectId) file.getId();
		return id.toString();
	}

	@Override
	public boolean removeContent(String id) {
		DB contentDB = dbProvider.getMongo().getDB("contents");
		User currentUser = AuthenticationUtil.getCurrentUser();
		if (currentUser==null) return false;
		
		GridFS gridFS = new GridFS(contentDB);
		
		GridFSDBFile file = gridFS.find(new ObjectId(id));
		if (file!=null) {
			userService.incUserUsage(currentUser.getName(), -file.getLength());
		}		
		
		gridFS.remove(new ObjectId(id));
		return true;
	}
}
