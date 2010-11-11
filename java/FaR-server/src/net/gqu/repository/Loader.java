package net.gqu.repository;

import org.apache.http.HttpResponse;

public interface Loader {

	HttpResponse getStream(String repository, String path);
	String getText(String repository, String path);
	boolean canload(String root);
}
