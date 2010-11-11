package net.gqu.repository;

import org.apache.http.HttpResponse;

public class GoogleLoader implements Loader {

	@Override
	public HttpResponse getStream(String repository, String path) {
		return HttpLoader.load(repository + path);
	}

	@Override
	public String getText(String repository, String path) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean canload(String root) {
		if (root.startsWith("http://") && root.indexOf("googlecode.com")>-1) {
			return true;
		} else {
			return false;
		}
	}

}
