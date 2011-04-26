package com.wikipy.aspect.feeds;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.wikipy.repository.RepositoryService;

public class JobDAO {
	
	private RepositoryService repositoryService;
	private String inteval;
	
	public Collection<Map<String, Object>> getJobToRun() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put(RepositoryService.PROP_ASPECT, "feeds");
		return repositoryService.selectItems(map);
	}
	
	
}
