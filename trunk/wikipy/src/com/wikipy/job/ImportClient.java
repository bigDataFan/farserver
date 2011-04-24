package com.wikipy.job;

import java.util.Map;

public interface ImportClient {
	
	void importMap(Map<String, Object> map);
	Map<String, Object> check(Map<String, Object> map);
	
}
