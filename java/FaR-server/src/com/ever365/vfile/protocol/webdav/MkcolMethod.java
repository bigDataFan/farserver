package com.ever365.vfile.protocol.webdav;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.utils.StringUtils;

import com.ever365.vfile.File;


public class MkcolMethod extends WebDAVMethod {	
	
	public MkcolMethod() {
		// TODO Auto-generated constructor stub
	}

	@Override
	protected void executeImpl(HttpServletRequest req, HttpServletResponse resp)
			throws WebDAVServerException, Exception {

        
        String parentPath = StringUtils.getParentPath(filePath, WebDAV.PathSeperator);
        String folderName =  StringUtils.getFileName(filePath, WebDAV.PathSeperator);
        
        File parentFile = fileService.getRootFile().getByPath(parentPath);
        
        if (parentFile==null) {
        	throw new WebDAVServerException(HttpServletResponse.SC_NOT_FOUND);
        }
        
        // make sure that we are not trying to use a folder
        if (!parentFile.isFolder())
        {
            throw new WebDAVServerException(HttpServletResponse.SC_BAD_REQUEST);
        }
        
        File exsit = parentFile.getByPath(folderName);
        
        if (exsit==null) {
			parentFile.createFolder(folderName);
			resp.setStatus(HttpServletResponse.SC_CREATED);
        } else {
        	resp.setStatus(HttpServletResponse.SC_CONFLICT);
        }
	}

	@Override
	protected void parseRequestBody(HttpServletRequest req)
			throws WebDAVServerException {
		// TODO Auto-generated method stub

	}

	@Override
	protected void parseRequestHeaders(HttpServletRequest req)
			throws WebDAVServerException {
		// TODO Auto-generated method stub

	}

}
