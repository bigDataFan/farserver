package net.gqu.repository;

import java.util.Map;


public interface RepositoryService {
	LoadResult getRaw(Map<String, Object> application, String path);
	String clean(String application);
}
