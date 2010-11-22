package net.gqu.jscript.root;

import java.io.InputStream;
import java.util.Date;

import org.mozilla.javascript.NativeObject;

import net.gqu.content.ContentService;
import net.gqu.security.BasicUserService;

public class ScriptContent {
	
	private ContentService contentService;
	public ScriptContent(ContentService contentService,
			BasicUserService userService) {
		super();
		this.contentService = contentService;
	}

	public String put(NativeObject no) {
		ContentFile contentFile = new ContentFile();
		contentFile.setContent((InputStream) no.get(ScriptRequest.INPUTSTREAM, no));
		contentFile.setMimetype((String) no.get(ScriptRequest.MIMETYPE, no));
		contentFile.setFileName((String) no.get(ScriptRequest.FILENAME, no));
		contentFile.setSize((Long) no.get(ScriptRequest.SIZE, no));
		contentFile.setModified(new Date());
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
