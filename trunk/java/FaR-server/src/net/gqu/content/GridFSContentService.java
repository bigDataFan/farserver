package net.gqu.content;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import net.gqu.mongodb.MongoDBProvider;
import net.gqu.utils.FileCopyUtils;
import net.gqu.utils.RuntimeExec;
import net.gqu.webscript.object.ContentFile;

import org.bson.types.ObjectId;

import com.ever365.security.AuthenticationUtil;
import com.ever365.security.BasicUserService;
import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;

public class GridFSContentService  implements ContentService {
	
	
	
	public static final String THUMBNAILS = "thumbnails";
	public static final String CONTENTS = "contents";

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
		DB contentDB = dbProvider.getMongo().getDB(CONTENTS);
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
		DB contentDB = dbProvider.getMongo().getDB(CONTENTS);
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
		DB contentDB = dbProvider.getMongo().getDB(CONTENTS);
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
		DB thumbnailDB = dbProvider.getMongo().getDB(THUMBNAILS);
		GridFS thumbnailGridFS = new GridFS(thumbnailDB);
		
		GridFSDBFile targetGridFsFile = thumbnailGridFS.findOne(targetFileName);
		
		if (targetGridFsFile==null) {
			DB contentdb = dbProvider.getMongo().getDB(CONTENTS);
			GridFSDBFile originGridFSFile = new GridFS(contentdb).find(new ObjectId(srcId));

			if (originGridFSFile!=null) {
				//extract file first
				String dir = System.getProperty("java.io.tmpdir");
				File tempdir = new File(dir);
				if (!tempdir.exists()) {
					tempdir.mkdirs();
				}
				File originFile = new File(dir + "\\" + srcId);
				if(!originFile.exists()) {
					try {
						originFile.createNewFile();
						FileCopyUtils.copy(originGridFSFile.getInputStream(), new FileOutputStream(originFile));
					} catch (IOException e) {
						return null;
					}
				}
			
				String tempfile = dir + "\\" + targetFileName;
				//"-thumbnail 100x100^";
				String[] command = new String[5];
				command[0] = "convert";
				command[1] = originFile.getAbsolutePath();
				command[2] = "-resize";
				command[3] = ((w!=0)?(w + "x "):("x" + h));
				command[4] = tempfile;
				//runtimeExec.execute(command);
			
			
				File target = new File(tempfile);
				if (target.exists()) {
					GridFSInputFile gridfsthumbfile;
					try {
						gridfsthumbfile = thumbnailGridFS.createFile(new FileInputStream(target), targetFileName);
						gridfsthumbfile.save();
						gridfsthumbfile.setContentType(originGridFSFile.getContentType());
						target.delete();
					} catch (FileNotFoundException e) {
					}
				} else {
					return null;
				}
			}
			targetGridFsFile = thumbnailGridFS.findOne(targetFileName);
		}
		ContentFile contentFile = new ContentFile();
		contentFile.setModified(targetGridFsFile.getUploadDate());
		contentFile.setMimetype(targetGridFsFile.getContentType());
		contentFile.setContent(targetGridFsFile.getInputStream());
		contentFile.setFileName(targetGridFsFile.getFilename());
		contentFile.setSize(targetGridFsFile.getLength());
		return contentFile;
	}

	@Override
	public ContentFile getImageThumbnail(String srcId, long s) {
		String targetFileName = srcId + "-w" + s + "h" + s;
		DB thumbnailDB = dbProvider.getMongo().getDB(THUMBNAILS);
		GridFS thumbnailGridFS = new GridFS(thumbnailDB);
		
		GridFSDBFile targetGridFsFile = thumbnailGridFS.findOne(targetFileName);
		
		if (targetGridFsFile==null) {
			DB contentdb = dbProvider.getMongo().getDB(CONTENTS);
			GridFSDBFile originGridFSFile = new GridFS(contentdb).find(new ObjectId(srcId));

			if (originGridFSFile!=null) {
				//extract file first
				String dir = System.getProperty("java.io.tmpdir");
				File tempdir = new File(dir);
				if (!tempdir.exists()) {
					tempdir.mkdirs();
				}
				File originFile = new File(dir + "\\" + srcId);
				
				if(!originFile.exists()) {
					try {
						originFile.createNewFile();
						FileCopyUtils.copy(originGridFSFile.getInputStream(), new FileOutputStream(originFile));
					} catch (IOException e) {
						return null;
					}
				}
				boolean isx = true;
				BufferedImage image;
				try {
					image = ImageIO.read(originFile);
					isx = image.getWidth()>image.getHeight();
				} catch (IOException e1) {
				}  
				
				String tempfile = dir + "\\" + targetFileName;
				
				
				//convert 1.jpg -resize x100 -gravity center -crop 100x100+0+0 +repage 2.jpg
				// when width>height  use x100 else use 100x
				
				StringBuffer command = new StringBuffer();
				command.append("convert ").append(originFile.getAbsolutePath()).append(" -resize ")
						.append(isx?("x" + s):(s + "x")).append(" -gravity center").append(" -crop " + s + "x" + s + "+0+0 +repage ")
						.append(tempfile);
				/*
				command[0] = "convert";
				command[1] = originFile.getAbsolutePath();
				command[2] = " -resize";
				command[3] = isx?("x" + s):(s + "x");//((w!=0)?(w + "x "):("x" + h));
				command[4] = "-gravity center";
				command[5] = " -crop " + s + "x" + s + "+0+0 +repage ";
				command[6] = tempfile;
				*/
				runtimeExec.execute(command.toString());
				File target = new File(tempfile);
				if (target.exists()) {
					GridFSInputFile gridfsthumbfile;
					try {
						gridfsthumbfile = thumbnailGridFS.createFile(new FileInputStream(target), targetFileName);
						gridfsthumbfile.save();
						gridfsthumbfile.setContentType(originGridFSFile.getContentType());
						target.delete();
					} catch (FileNotFoundException e) {
					}
				} else {
					return null;
				}
				
				try {
					originFile.delete();
					target.delete();
				} catch (Exception e) {
				}
				
			}
			targetGridFsFile = thumbnailGridFS.findOne(targetFileName);
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
