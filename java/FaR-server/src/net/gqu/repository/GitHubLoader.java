package net.gqu.repository;

import org.apache.http.HttpResponse;

public class GitHubLoader implements Loader {
	
	private static final String HTTP_GITHUB_COM = "http://github.com";
	private static final String GIT_GITHUB_COM = "git://github.com";

	@Override
	public HttpResponse getStream(String repository, String path) {
		
		if (repository.startsWith(GIT_GITHUB_COM)) {
			return HttpLoader.load(HTTP_GITHUB_COM 
					+ repository.substring(GIT_GITHUB_COM.length(), repository.length()-4) + "/raw/master/" + path);
		} else {
			return HttpLoader.load( 
					  repository.substring(0, repository.length()-4) + "/raw/master/" + path);
		}
	}
	
	@Override
	public String getText(String repository, String path) {
		return null;
	}

	@Override
	public boolean canload(String root) {
		if (root.startsWith(GIT_GITHUB_COM)||root.startsWith(HTTP_GITHUB_COM)) {
			return true;
		} else {
			return false;
		}
	}
}
