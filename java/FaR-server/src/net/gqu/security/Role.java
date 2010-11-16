package net.gqu.security;

import java.util.HashMap;
import java.util.Map;


public class Role {

	private String name;
	private long contentSize;
	private long totalSize;
	
	private boolean isOpen;

	public Role(Map<String, Object> one) {
		super();
		this.name = (String) one.get("name");
		this.contentSize = (Long) one.get("contentSize");
		this.totalSize = (Long) one.get("totalSize");
		this.isOpen = (Boolean) one.get("isOpen");
	}
	
	
	public Role() {
		super();
		// TODO Auto-generated constructor stub
	}



	public Map<String, Object> getMap() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("name", name);
		map.put("contentSize", contentSize);
		map.put("totalSize", totalSize);
		map.put("isOpen", isOpen);
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
		return isOpen;
	}

	public void setOpen(boolean isOpen) {
		this.isOpen = isOpen;
	}
	
	
	
}
