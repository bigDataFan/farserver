/*
 * Copyright (C) 2005-2007 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing"
 */
package com.ever365.vfile.protocol.webdav;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.utils.StringUtils;

import com.ever365.vfile.File;


/**
 * Implements the WebDAV PUT method
 * 
 * @author Gavin Cornwell
 */
public class PutMethod extends WebDAVMethod
{
	
	private boolean m_overwrite;
	
    public PutMethod() {
	}

	@Override
	protected void executeImpl(HttpServletRequest req, HttpServletResponse resp)
			throws WebDAVServerException, Exception {

		boolean created = false;
        String parentPath = StringUtils.getParentPath(filePath, WebDAV.PathSeperator);
        String fileName =  StringUtils.getFileName(filePath, WebDAV.PathSeperator);
        
        
        File parentFile = fileService.getRootFile().getByPath(parentPath);
        
        if (parentFile==null) {
        	throw new WebDAVServerException(HttpServletResponse.SC_NOT_FOUND);
        }
        
        // make sure that we are not trying to use a folder
        if (!parentFile.isFolder())
        {
            throw new WebDAVServerException(HttpServletResponse.SC_BAD_REQUEST);
        }
        
        File exsit = parentFile.getByPath(fileName);
        
		if (exsit==null) {
			parentFile.createFile(fileName, req.getInputStream());
        	created = true;
        } else if (m_overwrite){ 
        	exsit.update(req.getInputStream());
        }
		//runtime.getCounterService().getAndIncreaseM(space.getRoot().getId(), contentRef.getSize());
		
        // Set the response status, depending if the node existed or not
        resp.setStatus(created ? HttpServletResponse.SC_CREATED : HttpServletResponse.SC_NO_CONTENT);
	}

	@Override
	protected void parseRequestHeaders(HttpServletRequest req)
			throws WebDAVServerException {
		String strOverwrite = req.getHeader(WebDAV.HEADER_OVERWRITE);
		if (strOverwrite != null && strOverwrite.equals(WebDAV.T)) {
			m_overwrite = true;
		}
	}

	@Override
	protected void parseRequestBody(HttpServletRequest req)
			throws WebDAVServerException {
		// TODO Auto-generated method stub
	}
}
