package net.gqu.rest;

import java.util.HashMap;
import java.util.Map;

import net.gqu.application.ApprovedApplication;
import net.gqu.application.InstalledApplication;
import net.gqu.cache.EhCacheService;
import net.gqu.exception.HttpStatusExceptionImpl;
import net.gqu.security.AuthenticationUtil;
import net.gqu.security.User;
import net.gqu.service.ApplicationService;

public class ApplicationRestService {

	private ApplicationService applicationService;
	private EhCacheService cacheService;
	
	
	public void setCacheService(EhCacheService cacheService) {
		this.cacheService = cacheService;
	}

	public void setApplicationService(ApplicationService applicationService) {
		this.applicationService = applicationService;
	}

	@RestService(method="POST", uri="/application/install")
	public Map<String, Object> installApp(@RestParam(value="application")String application, @RestParam(value="mapping")String mapping) {
		if (!AuthenticationUtil.isCurrentLogon()) {
			throw new HttpStatusExceptionImpl(401);
		}
		
		User user = AuthenticationUtil.getCurrentUser();
		ApprovedApplication app = applicationService.getApplication(application);
		
		if (app==null) {
			throw new HttpStatusExceptionImpl(404);
		}
		
		InstalledApplication installed = applicationService.install(user, app, mapping);
		
		Map<String, Object> result = new HashMap<String, Object>();
		
		result.put(ApplicationService.APPLICATION, installed.getApp());
		result.put(ApplicationService.USER, installed.getUser());
		result.put(ApplicationService._ID, installed.getId());
		result.put(ApplicationService.MAPPING, installed.getMapping());
		return result;
	}
	
	@RestService(method="GET", uri="/application/clean")
	public String cleanAppCache(@RestParam(value="application")String application) {
		cacheService.getApplicationCache(application).removeAll();
		return "OK";
	}
	
}
