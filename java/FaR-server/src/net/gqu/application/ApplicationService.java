package net.gqu.application;

import java.util.List;
import java.util.Map;


public interface ApplicationService {
	
	public static final String KEY_MAPPING = "mapping";
	public static final String KEY_APPLICATION = "application";
	public static final String KEY_USER = "user";
	
	public static final String COLL_INSTALLED = "installed";
	
	Map<String, Map<String, Object>> getUserInstalledApplications(String user);
	Map<String, Object> install(String user, String app, String mapping);
	boolean uninstall(String user, String app);
	
	Map<String, Object> getInstalledByMapping(String user, String mapping);
	
	RegisteredApplication getApplication(String app);
	
	List<RegisteredApplication> getAllInCurrentServer();
	long getInstallCount(String name);
	public String getDefaultApp();
}
