package net.gqu.webscript.object;

import java.util.List;
import java.util.Map;

import net.gqu.application.ApplicationService;

import com.ever365.security.UserService;

public class ScriptSystem {
	
	private ApplicationService applicationService;
	private UserService userService;
	
	public ScriptSystem(ApplicationService applicationService,
			UserService userService) {
		super();
		this.applicationService = applicationService;
		this.userService = userService;
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
		return applicationService.getAllInCurrentServer();
	}
	
	public Map<String, Object> install(String user, String app, String mapping) {
		return applicationService.install(user, app, mapping);
	}
	
	public boolean uninstall(String user, String app) {
		return applicationService.uninstall(user, app);
	}
	
	
	
}
