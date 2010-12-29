package net.gqu.content;

import net.gqu.webscript.object.ContentFile;

public interface ContentService {
	
	public String putContent(ContentFile cf);
	public ContentFile getContent(String id);
	public boolean removeContent(String id);
	public ContentFile getImageThumbnail(String srcId, long w, long h);
	public ContentFile getImageThumbnail(String srcId, long s);
}
