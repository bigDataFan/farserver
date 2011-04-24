package com.wikipy.job;

import java.util.HashMap;
import java.util.Map;

public class ImportersRegistry {

	private Map<String, ImportClient> importers = new HashMap<String, ImportClient>();
	
	
	public ImportClient getImporter(String type) {
		return importers.get(type);
	}
	public void setImporters(Map<String, ImportClient> importers) {
		this.importers = importers;
	}
	
}
