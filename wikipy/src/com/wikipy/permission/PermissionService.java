package com.wikipy.permission;

public interface PermissionService {

	public static final String READ = "r";
	public static final String WRITE = "w";
	public static final String ALL = "a";
	
	void setPermission(String nodeId, String auth, String permission);

	void removePermission(String nodeId, String auth, String permission);
	
	void hasPermission(String nodeId, String auth, String permission);
	
}
