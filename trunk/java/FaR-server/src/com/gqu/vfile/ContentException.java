package com.gqu.vfile;

import java.io.IOException;

public class ContentException extends RuntimeException {
	
	public ContentException(String string, IOException e) {
		super(string);
	}
	
	public ContentException(String string) {
		super(string);
	}

	private static final long serialVersionUID = 8128327951806246713L;

}
