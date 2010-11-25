package net.gqu.repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import net.gqu.application.ApprovedApplication;

import org.apache.http.HttpResponse;

public class RepositoryServiceImpl implements RepositoryService {
	
	private List<Loader> loaders = new ArrayList<Loader>();

	
	
	public void setLoaders(List<Loader> loaders) {
		this.loaders = loaders;
	}

	public RepositoryServiceImpl() {
	}

	@Override
	public String clean(ApprovedApplication application) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public LoadResult getRaw(ApprovedApplication application, String path) {
		
		LoadResult lr = new LoadResult();
		for (Loader loader : loaders) {
			if (loader.canload(application.getRepository())) {
				HttpResponse response = loader.getStream(application.getRepository(), path);
				try {
					lr.setStatus(response.getStatusLine().getStatusCode());
					lr.setInputStream(response.getEntity().getContent());
					lr.setLength(response.getEntity().getContentLength());
				} catch (IllegalStateException e) {
					lr.setStatus(404);
				} catch (IOException e) {
					lr.setStatus(404);
				} catch (Throwable e) {
					lr.setStatus(404);
				}
			}
		}
		return lr;
	}
	
}
