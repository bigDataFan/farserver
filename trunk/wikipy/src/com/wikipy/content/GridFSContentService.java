package com.wikipy.content;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;


import org.bson.types.ObjectId;

import com.mongodb.DB;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSInputFile;
import com.wikipy.mongodb.MongoDBDataSource;
import com.wikipy.utils.FileCopyUtils;

public class GridFSContentService  implements ContentService {
	
	public static final String THUMBNAILS = "thumbnails";
	public static final String CONTENTS = "contents";

	public void setDatasource(MongoDBDataSource datasource) {
		this.datasource = datasource;
	}

	public void setRuntimeExec(RuntimeExec runtimeExec) {
		this.runtimeExec = runtimeExec;
	}
	private MongoDBDataSource datasource;
	private RuntimeExec runtimeExec;
	
	@Override
	public ContentFile getContent(String id) {
		DB contentDB = datasource.getMongo().getDB(CONTENTS);
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
		DB contentDB = datasource.getMongo().getDB(CONTENTS);
		GridFS gridFS = new GridFS(contentDB);
		GridFSInputFile file = gridFS.createFile(contentFile.getInputStream(), contentFile.getFileName());
		file.setContentType(contentFile.getMimetype());
		file.save();
		ObjectId id = (ObjectId) file.getId();
		return id.toString();
	}

	@Override
	public boolean removeContent(String id) {
		DB contentDB = datasource.getMongo().getDB(CONTENTS);
		GridFS gridFS = new GridFS(contentDB);
		GridFSDBFile file = gridFS.find(new ObjectId(id));
		gridFS.remove(new ObjectId(id));
		return true;
	}

	@Override
	public ContentFile getImageThumbnail(String srcId, long w, long h) {
		String targetFileName = srcId + "-w" + w + "h" + h;
		DB thumbnailDB = datasource.getMongo().getDB(THUMBNAILS);
		GridFS thumbnailGridFS = new GridFS(thumbnailDB);
		
		GridFSDBFile targetGridFsFile = thumbnailGridFS.findOne(targetFileName);
		
		if (targetGridFsFile==null) {
			DB contentDB = datasource.getMongo().getDB(CONTENTS);
			GridFSDBFile originGridFSFile = new GridFS(contentDB).find(new ObjectId(srcId));

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
}
