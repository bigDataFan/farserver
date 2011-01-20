package net.gqu.repository;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.gqu.application.ApplicationService;

import org.apache.http.HttpResponse;

public class RepositoryServiceImpl implements RepositoryService {
	
	private List<Loader> loaders = new ArrayList<Loader>();

	private boolean develop = false;
	
	public void setDevelop(boolean develop) {
		this.develop = develop;
	}

	public void setLoaders(List<Loader> loaders) {
		this.loaders = loaders;
	}

	public RepositoryServiceImpl() {
	}

	@Override
	public String clean(String application) {
		return null;
	}
	
	@Override
	public LoadResult getRaw(Map<String, Object> application, String path) {
		
		LoadResult lr = new LoadResult();
		if (develop) {
			File file = new File(application.get(ApplicationService.APP_CONFIG_REPOSITORY) + "/" + path);
			if (file.exists()) {
				lr.setStatus(200);
				try {
					lr.setInputStream(new FileInputStream(file));
				} catch (FileNotFoundException e) {
					e.printStackTrace();
				}
				lr.setLength(file.length());
			} else {
				lr.setStatus(404);
			}
		} else {
			for (Loader loader : loaders) {
				if (loader.canload((String)application.get(ApplicationService.APP_CONFIG_REPOSITORY))) {
					HttpResponse response = loader.getStream((String)application.get(ApplicationService.APP_CONFIG_REPOSITORY) , path);
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
		}
		
		return lr;
	}
	
}
