package com.wikipy.job;

import java.util.Map;

public interface ImportClient {
	
	void doImport(Map<String, Object> map);
	Map<String, Object> check(Map<String, Object> map);
	
}
