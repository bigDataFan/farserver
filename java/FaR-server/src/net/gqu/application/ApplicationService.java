package net.gqu.application;

import java.util.List;
import java.util.Map;


public interface ApplicationService {
	
	public static final String KEY_MAPPING = "mapping";
	public static final String KEY_APPLICATION = "application";
	public static final String KEY_USER = "user";
	
	public static final String COLL_INSTALLED = "installed";
	
	public static final String APP_CONFIG_NAME = "name";
	public static final String APP_CONFIG_START = "start";
	public static final String APP_CONFIG_REPOSITORY = "repository";
	
	
	Map<String, Map<String, Object>> getUserInstalledApplications(String user);
	Map<String, Object> install(String user, String app, String mapping);
	boolean uninstall(String user, String app);
	
	Map<String, Object> getInstalledByMapping(String user, String mapping);
	
	Map<String, Object> getApplication(String app);
	
	List<Map<String, Object>> getAllInCurrentServer();
	long getInstallCount(String name);
	public String getDefaultApp();
}
