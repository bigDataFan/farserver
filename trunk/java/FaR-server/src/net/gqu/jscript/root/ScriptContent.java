package net.gqu.jscript.root;

import java.io.InputStream;

import net.gqu.content.ContentService;
import net.gqu.security.BasicUserService;

public class ScriptContent {
	
	private ContentService contentService;
	public ScriptContent(ContentService contentService,
			BasicUserService userService) {
		super();
		this.contentService = contentService;
	}


	public String put(InputStream inputStream, String fileName, String mimetype) {
		ContentFile contentFile = new ContentFile();
		contentFile.setContent(inputStream);
		contentFile.setMimetype(mimetype);
		contentFile.setFileName(fileName);
		return contentService.putContent(contentFile);
	}
	
	
	public String put(ContentFile contentFile) {
		return contentService.putContent(contentFile);
	}
	
	public void remove(String id) {
		contentService.removeContent(id);
	}
	
	public ContentFile get(String id) {
		return contentService.getContent(id);
	}
}
