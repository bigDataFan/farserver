package net.gqu.webscript.object;

import java.io.InputStream;
import java.io.Serializable;
import java.util.Date;

public class ContentFile implements Serializable {
	
	private static final long serialVersionUID = 1L;
	private Date modified;
	private String fileName;
	private String mimetype;
	private long size;
	private InputStream inputStream;

	
	public InputStream getInputStream() {
		return inputStream;
	}

	public void setContent(InputStream inputStream) {
		this.inputStream = inputStream;
	}

	public long getSize() {
		return size;
	}

	public void setSize(long size) {
		this.size = size;
	}

	public String getMimetype() {
		return mimetype;
	}

	public void setMimetype(String mimetype) {
		this.mimetype = mimetype;
	}


	public Date getModified() {
		return modified;
	}

	public void setModified(Date modified) {
		this.modified = modified;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	
	
	
}
