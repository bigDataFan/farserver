package com.ever365.vfile.protocol.webdav;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ever365.vfile.File;

public class OptionsMethod extends WebDAVMethod {

    public OptionsMethod() {
		
	}

	private static final String DAV_HEADER = "DAV";
    private static final String DAV_HEADER_CONTENT = "1,2";
    private static final String ALLOW_HEADER = "Allow";
    private static final String MS_HEADER = "MS-Author-Via";

    private static final String FILE_METHODS = "OPTIONS, GET, HEAD, POST, DELETE, PROPFIND, COPY, MOVE";
    private static final String COLLECTION_METHODS = FILE_METHODS + ", PUT";

    
	@Override
	protected void executeImpl(HttpServletRequest req, HttpServletResponse resp)
			throws WebDAVServerException{
		
		boolean isFolder = false;
		try {
			File file = fileService.getRootFile().getByPath(filePath);
	        
	    	if (file==null) {
	    		isFolder = true;
	    	} else {
	    		isFolder = file.isFolder();
	    	}
		} catch (Exception e) {
		}
            // Do nothing; just default to a folder
        // Add the header to advertise the level of support the server has
        resp.addHeader(DAV_HEADER, DAV_HEADER_CONTENT);

        // Add the proprietary Microsoft header to make Microsoft clients behave
        resp.addHeader(MS_HEADER, DAV_HEADER);

        // Add the header to show what methods are allowed
        resp.addHeader(ALLOW_HEADER, isFolder ? COLLECTION_METHODS : FILE_METHODS);

	}


	@Override
	protected void parseRequestBody(HttpServletRequest req)
			throws WebDAVServerException {
	}


	@Override
	protected void parseRequestHeaders(HttpServletRequest req)
			throws WebDAVServerException {
		// TODO Auto-generated method stub
		
	}

}
