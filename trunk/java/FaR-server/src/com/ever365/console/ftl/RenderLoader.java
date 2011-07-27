package com.ever365.console.ftl;

import java.io.IOException;
import java.io.Reader;

import com.ever365.console.RendererService;

import freemarker.cache.TemplateLoader;

public class RenderLoader implements TemplateLoader {
	private RendererService rendererService;
	
	public RenderLoader(RendererService rendererService) {
		super();
		this.rendererService = rendererService;
	}

	@Override
	public void closeTemplateSource(Object arg0) throws IOException {

	}

	@Override
	public Object findTemplateSource(String name) throws IOException {
		return rendererService.getViewRenderFTL(name);
	}

	@Override
	public long getLastModified(Object arg0) {
		return System.currentTimeMillis();
	}

	@Override
	public Reader getReader(Object arg0, String arg1) throws IOException {
		return null;
	}

}
