package net.gqu.webscript;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Admin
 *
 */
public class WebCache {

	private Map<String, String> results = new HashMap<String, String>();

	public void clear() {
		results.clear();
	}

	public String get(Object key) {
		return results.get(key);
	}

	public String put(String key, String value) {
		return results.put(key, value);
	}

	public String remove(Object key) {
		return results.remove(key);
	}
	
	
}
