package net.gqu.application;

import java.util.List;
import java.util.Map;


public interface ApplicationService {
	
	public static final String _ID = "_id";
	
	
	public static final String MAPPING = "mapping";
	public static final String APPLICATION = "application";
	public static final String USER = "user";
	
	
	public static final String DB_APP = "appsdb";
	
	Map<String, InstalledApplication> getUserInstalledApplications(String user);
	InstalledApplication install(String user, RegisteredApplication app, String mapping);
	boolean uninstalled(InstalledApplication installedApplication);
	InstalledApplication getInstalledByMapping(String user, String mapping);
	RegisteredApplication getApplication(String id);
	List<RegisteredApplication> getAllInCurrentServer();

	List<InstalledApplication> getInstalled(String name);
	long getInstallCount(String name);
}
