package net.gqu.security;

import java.util.HashMap;
import java.util.Map;

import org.bson.types.ObjectId;


public class Role {

	public static final String KEY_ENABLED = "enabled";
	public static final String KEY_OPEN = "open";
	public static final String KEY_TOTAL_SIZE = "totalSize";
	public static final String KEY_CONTENT_SIZE = "contentSize";
	public static final String KEY_NAME = "name";
	private String name;
	private ObjectId id;
	private long contentSize;
	private long totalSize;
	
	private boolean open;
	private boolean enabled;

	public Role(Map<String, Object> one) {
		super();
		this.name = (String) one.get(KEY_NAME);
		this.contentSize = (Long) one.get(KEY_CONTENT_SIZE);
		this.totalSize = (Long) one.get(KEY_TOTAL_SIZE);
		this.open = (Boolean) one.get(KEY_OPEN);
		this.enabled = (Boolean) one.get(KEY_ENABLED);
		this.id = (ObjectId)one.get("_id");
	}
	
	
	public Role() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ObjectId getId() {
		return id;
	}


	public void setId(ObjectId id) {
		this.id = id;
	}


	public boolean isEnabled() {
		return enabled;
	}


	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}


	public Map<String, Object> getMap() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put(KEY_NAME, name);
		map.put(KEY_CONTENT_SIZE, contentSize);
		map.put(KEY_TOTAL_SIZE, totalSize);
		map.put(KEY_OPEN, open);
		map.put(KEY_ENABLED, enabled);
		if (id!=null) {
			map.put("id", id.toString());
		}
		return map;
	}
	
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public long getContentSize() {
		return contentSize;
	}

	public void setContentSize(long contentSize) {
		this.contentSize = contentSize;
	}

	public long getTotalSize() {
		return totalSize;
	}

	public void setTotalSize(long totalSize) {
		this.totalSize = totalSize;
	}


	public boolean isOpen() {
		return open;
	}


	public void setOpen(boolean open) {
		this.open = open;
	}
	
	
}
