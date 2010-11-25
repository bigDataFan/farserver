package net.gqu.freemarker;

import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;

import net.gqu.application.ApplicationService;
import net.gqu.repository.LoadResult;
import net.gqu.repository.RepositoryService;
import net.gqu.utils.StringUtils;
import freemarker.cache.TemplateLoader;

public class RepositoryTemplateLoader implements TemplateLoader {
	
	private RepositoryService repositoryService;
	private ApplicationService applicationService;

	
	public RepositoryTemplateLoader(RepositoryService repositoryService,
			ApplicationService applicationService) {
		super();
		this.repositoryService = repositoryService;
		this.applicationService = applicationService;
	}

	@Override
	public void closeTemplateSource(Object templateSource) throws IOException {
		
	}
	
	@Override
	public Object findTemplateSource(String name) throws IOException {
		int i = name.indexOf('.');
		String app = name.substring(0,i);
		String path = name.substring(i+1);
		LoadResult lr = repositoryService.getRaw(applicationService.getApplication(app),path);
		return lr;
	}

	@Override
	public long getLastModified(Object templateSource) {
		return System.currentTimeMillis();
	}

	@Override
	public Reader getReader(Object templateSource, String encoding)
			throws IOException {
		LoadResult lr = (LoadResult)templateSource;
		if (lr.getStatus()==404) {
			throw new IOException();
		} else {
			String content = StringUtils.getText(lr.getInputStream());
			return new StringReader(content);
		}
	}

}
