package net.gqu.content;

import java.io.InputStream;

public interface ContentService {
	
	public void putFile();
	public InputStream getStream(String id);
	
	
}
