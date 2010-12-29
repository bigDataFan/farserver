package net.gqu.content;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import net.gqu.mongodb.MongoDBProvider;
import net.gqu.security.AuthenticationUtil;
import net.gqu.security.BasicUserService;
import net.gqu.utils.FileCopyUtils;
import net.gqu.utils.GUID;
import net.gqu.utils.RuntimeExec;
import net.gqu.webscript.object.ContentFile;

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

	public void setRuntimeExec(RuntimeExec runtimeExec) {
		this.runtimeExec = runtimeExec;
	}

	private BasicUserService userService;
	private MongoDBProvider dbProvider;
	private RuntimeExec runtimeExec;
	
	@Override
	public ContentFile getContent(String id) {
		DB contentDB = dbProvider.getMongo().getDB("contents");
		GridFS gridFS = new GridFS(contentDB);
		GridFSDBFile file = gridFS.find(new ObjectId(id));
		
		if (file==null) {
			return null;
		}
		
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
		String contextUser = AuthenticationUtil.getContextUser();
		userService.incUserUsage(contextUser, contentFile.getSize());
		
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
		String contextUser = AuthenticationUtil.getContextUser();
		
		GridFS gridFS = new GridFS(contentDB);
		
		GridFSDBFile file = gridFS.find(new ObjectId(id));
		if (file!=null) {
			userService.incUserUsage(contextUser, -file.getLength());
		}		
		
		gridFS.remove(new ObjectId(id));
		return true;
	}

	@Override
	public ContentFile getImageThumbnail(String srcId, long w, long h) {
		String targetFileName = srcId + "-w" + w + "h" + h;
		DB contentDB = dbProvider.getMongo().getDB("contents");
		GridFS gridFS = new GridFS(contentDB);
		
		GridFSDBFile targetGridFsFile = gridFS.findOne(targetFileName);
		
		if (targetGridFsFile==null) {
			GridFSDBFile originGridFSFile = gridFS.find(new ObjectId(srcId));

			if (originGridFSFile!=null) {
				//extract file first
				String dir = System.getProperty("java.io.tmpdir");
				File tempdir = new File(dir);
				if (!tempdir.exists()) {
					tempdir.mkdirs();
				}
				File originFile = new File(dir + File.pathSeparator + srcId);
				if(!originFile.exists()) {
					try {
						originFile.createNewFile();
						FileCopyUtils.copy(originGridFSFile.getInputStream(), new FileOutputStream(originFile));
					} catch (IOException e) {
						return null;
					}
				}
			
				String tempfile = dir + File.pathSeparator + targetFileName;
			
				String[] command = new String[5];
				command[0] = "convert";
				command[1] = originFile.getAbsolutePath();
				command[2] = "-resize";
				command[3] = ((w!=0)?(w + "x "):("x" + h));
				command[4] = tempfile;
				runtimeExec.execute(command);
			
			
				File target = new File(tempfile);
				if (target.exists()) {
					GridFSInputFile gridfsthumbfile;
					try {
						gridfsthumbfile = gridFS.createFile(new FileInputStream(target), targetFileName);
						gridfsthumbfile.save();
						gridfsthumbfile.setContentType(originGridFSFile.getContentType());
						target.delete();
					} catch (FileNotFoundException e) {
					}
				}
			}
			targetGridFsFile = gridFS.findOne(targetFileName);
		}
		ContentFile contentFile = new ContentFile();
		contentFile.setModified(targetGridFsFile.getUploadDate());
		contentFile.setMimetype(targetGridFsFile.getContentType());
		contentFile.setContent(targetGridFsFile.getInputStream());
		contentFile.setFileName(targetGridFsFile.getFilename());
		contentFile.setSize(targetGridFsFile.getLength());
		return contentFile;
	}
}
