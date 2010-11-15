package net.gqu.content;

import net.gqu.jscript.root.ContentFile;

public interface ContentService {
	
	public String putContent(ContentFile cf);
	public ContentFile getContent(String id);
	public boolean removeFile(String id);
	
}
