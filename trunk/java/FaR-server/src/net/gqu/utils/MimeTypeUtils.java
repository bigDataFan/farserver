package net.gqu.utils;

import java.io.IOException;
import java.util.Map;
import java.util.Properties;

public class MimeTypeUtils {
	
	
	public static final String APPLICATION_OCTET_STREAM = "application/octet-stream";
	static Properties properties = new Properties();
	static 
	{
		try {
			properties.load(MimeTypeUtils.class.getResourceAsStream("mimetype.properties"));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	public static String guess(String file) {
		int p = file.lastIndexOf(".");
		if (p>-1) {
			String ending = file.substring(p+1).toLowerCase();
			Object c = properties.get(ending);
			if (c!=null) {
				return (String)c;
			}
		}
		return APPLICATION_OCTET_STREAM;
	}
	
	private Map<String, String> formats;
	
	public String getContentType(String type) {
		String c = formats.get(type);
		if (c==null) {
			return APPLICATION_OCTET_STREAM;
		} else {
			return c;
		}
	}

	public void setFormats(Map<String, String> formats) {
		this.formats = formats;
	}
	
	public static void main(String[] args) {
		System.out.println(MimeTypeUtils.guess("abc.JPG"));
		System.out.println(MimeTypeUtils.guess("abx.x"));
		System.out.println(MimeTypeUtils.guess("bbb.doc"));
	}
}
