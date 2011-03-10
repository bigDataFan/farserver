package net.gqu.repository;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Map;

import net.gqu.application.ApplicationService;

public class WebAppRootRepositoryService implements RepositoryService {
	private String webappPath;
	
	public void setWebappPath(String webappPath) {
		this.webappPath = webappPath;
	}

	@Override
	public LoadResult getRaw(Map<String, Object> application, String path) {
		LoadResult lr = new LoadResult();
		File file = new File(webappPath + "/" + application.get(ApplicationService.APP_CONFIG_NAME) + "/" + path);
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
		return lr;
	}

	@Override
	public String clean(String application) {
		return null;
	}

}
