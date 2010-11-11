package net.gqu.content;

import java.io.InputStream;

public interface ContentService {
	
	public String putContent(InputStream is);
	public InputStream getContent(String id);
	public boolean removeFile(String id);
	
}
