package com.ever365.vfile.protocol.webdav;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ever365.vfile.File;

public class DeleteMethod extends WebDAVMethod {

	public DeleteMethod() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	protected void executeImpl(HttpServletRequest req, HttpServletResponse resp)
			throws WebDAVServerException, Exception {
		File file = fileService.getRootFile().getByPath(filePath);
    	if (file==null) {
			throw new WebDAVServerException(HttpServletResponse.SC_NOT_FOUND);
		}
    	file.remove();
	}

	@Override
	protected void parseRequestBody(HttpServletRequest req)
			throws WebDAVServerException {
		// TODO Auto-generated method stub

	}

	@Override
	protected void parseRequestHeaders(HttpServletRequest req)
			throws WebDAVServerException {

	}

}
