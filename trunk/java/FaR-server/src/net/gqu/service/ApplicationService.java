package net.gqu.service;

import java.util.Map;

import net.gqu.application.ApprovedApplication;
import net.gqu.application.InstalledApplication;
import net.gqu.security.User;

public interface ApplicationService {
	
	public static final String _ID = "_id";
	
	
	public static final String MAPPING = "mapping";
	public static final String APPLICATION = "application";
	public static final String USER = "user";
	
	
	public static final String DB_APP = "appsdb";
	
	Map<String, InstalledApplication> getUserInstalledApplications(User user);
	InstalledApplication install(String user, ApprovedApplication app, String mapping);
	boolean uninstalled(InstalledApplication installedApplication);
	InstalledApplication getInstalledByMapping(String user, String mapping);
	ApprovedApplication getApplication(String id);
	
}
