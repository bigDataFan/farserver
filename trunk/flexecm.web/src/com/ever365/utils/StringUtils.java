package com.ever365.utils;

public class StringUtils {

	public static final Long tofileSize(String size) {
		try {
			if (size.endsWith("M")||size.endsWith("m")) {
				Float f = new Float(size.substring(0, size.length()-1)) * 1024 * 1024;
				return f.longValue();
			} else if (size.endsWith("K") || size.endsWith("k")) {
				Float f = new Float(size.substring(0, size.length()-1)) * 1024;
				return f.longValue();
			} else if (size.endsWith("G") || size.endsWith("g")) {
				Float f = new Float(size.substring(0, size.length()-1)) * 1024 * 1024 * 1024;
				return f.longValue();
			} else if (size.endsWith("B") || size.endsWith("b")) {
				Float f = new Float(size.substring(0, size.length()-1));
				return f.longValue();
			} else {
				return new Long(size);
			}
		} catch (Exception e) {
			return 0L;
		}
	}
	
	public static final String middle(String source, String start, String end) {
		int posx = source.indexOf(start);
		
		if (posx>-1) {
			posx += start.length();
		}
		
		int posy = source.indexOf(end, posx);
		
		if (posy==-1) {
			posy = source.length();
		}
		return source.substring(posx, posy);
	}
	
}
