package net.gqu.repository;

import net.gqu.application.RegisteredApplication;

public interface RepositoryService {

	LoadResult getRaw(RegisteredApplication application, String path);
	String clean(RegisteredApplication application);
	
}
