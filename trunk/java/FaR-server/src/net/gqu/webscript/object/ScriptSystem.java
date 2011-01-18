package net.gqu.webscript.object;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.gqu.application.ApplicationService;
import net.gqu.application.RegisteredApplication;
import net.gqu.security.BasicUserService;

public class ScriptSystem {
	
	private ApplicationService applicationService;
	private BasicUserService userService;
	
	public ScriptSystem(ApplicationService applicationService,
			BasicUserService userService) {
		super();
		this.applicationService = applicationService;
		this.userService = userService;
	}
	public RegisteredApplication getApplication(String app) {
		return applicationService.getApplication(app);
	}
	public long getInstallCount(String name) {
		return applicationService.getInstallCount(name);
	}
	public Map<String, Object> getInstalledByMapping(String user, String mapping) {
		return applicationService.getInstalledByMapping(user, mapping);
	}
	public Map<String, Map<String, Object>> getUserInstalledApplications(
			String user) {
		return applicationService.getUserInstalledApplications(user);
	}
	
	
	public List<Map<String, Object>> getAllApplications() {
		List<RegisteredApplication> list = applicationService.getAllInCurrentServer();
		
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		
		for (RegisteredApplication map : list) {
			result.add(map.getMaps());
		}
		return result;
	}
	
	
	
	public Map<String, Object> install(String user, String app, String mapping) {
		return applicationService.install(user, app, mapping);
	}
	
	public boolean uninstall(String user, String app) {
		return applicationService.uninstall(user, app);
	}
	
	
	
}
