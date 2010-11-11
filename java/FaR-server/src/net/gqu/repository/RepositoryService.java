package net.gqu.repository;

import net.gqu.application.ApprovedApplication;

public interface RepositoryService {

	LoadResult getRaw(ApprovedApplication application, String path);
	String clean(ApprovedApplication application);
	
}
