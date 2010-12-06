package net.gqu.main;

import java.util.Map;

import net.gqu.rest.RestParam;
import net.gqu.rest.RestService;
import net.gqu.security.AuthenticationUtil;

public class GloabalRestApplicationService {

	private GlobalApplicationService applicationService;
	
	
	
	public GlobalApplicationService getApplicationService() {
		return applicationService;
	}

	public void setApplicationService(GlobalApplicationService applicationService) {
		this.applicationService = applicationService;
	}

	public GloabalRestApplicationService() {
		super();
	}
	@RestService(method="POST", uri="/global/application/create")
	public Map<String, Object> createApp(@RestParam(value="name")String name,
			@RestParam(value="alias")String alias,
			@RestParam(value="description")String description,
			@RestParam(value="repository")String repository,
			@RestParam(value="stage")String stage,
			@RestParam(value="type")String type,
			@RestParam(value="details")String details,
			@RestParam(value="categories")String categories,
			@RestParam(value="start")String start
	) {
		if (AuthenticationUtil.isCurrentLogon()) {
			Application app = applicationService.createApplication(name, alias, description, repository, start,
					Integer.parseInt(stage), Integer.parseInt(type), details, categories.split(" "), AuthenticationUtil.getCurrentUser());
			return app.getMaps();
		}
		return null;
	}
	
	@RestService(method="POST", uri="/global/application/update")
	public Map<String, Object> updateApp(@RestParam(value="name")String name,
			@RestParam(value="alias")String alias,
			@RestParam(value="description")String description,
			@RestParam(value="repository")String repository,
			@RestParam(value="stage")String stage,
			@RestParam(value="type")String type,
			@RestParam(value="details")String details,
			@RestParam(value="categories")String categories,
			@RestParam(value="start")String start
	) {
		if (AuthenticationUtil.isCurrentLogon()) {
			Application app = applicationService.updateApplication(name, alias, description, repository, start, Integer.parseInt(stage), Integer.parseInt(type), categories, categories.split(" "), AuthenticationUtil.getCurrentUser());
			return app.getMaps();
		}
		return null;
	}
	
	@RestService(method="GET", uri="/global/application/get")
	public Map<String, Object> getApp(@RestParam(value="name")String name) {
		return applicationService.getApplication(name);
	}

}

