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

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.utils.FileCopyUtils;
import net.gqu.utils.StringUtils;

import com.ever365.security.AuthenticationUtil;
import com.ever365.vfile.File;


/**
 * Implements the WebDAV GET method
 * 
 * @author gavinc
 */
public class GetMethod extends WebDAVMethod
{
    
	private static final String APPLICATION_OCTET_STREAM = "application/octet-stream";
	private static final String TEXT_HTML_CHARSET_UTF_8 = "text/html;charset=UTF-8";
	public GetMethod() {
		m_returnContent = true;
	}

	protected boolean m_returnContent;
	/**
     * Parse the request body
     * 
     * @exception WebDAVServerException
     */
    protected void parseRequestBody() throws WebDAVServerException
    {
        // Nothing to do in this method
    }

    /**
     * Exceute the WebDAV request
     * 
     * @exception WebDAVServerException
     */
    protected void executeImpl(HttpServletRequest req, HttpServletResponse resp) throws WebDAVServerException, Exception
    {
    	File file = fileService.getRootFile().getByPath(filePath);
    	if (file==null) {
			throw new WebDAVServerException(HttpServletResponse.SC_NOT_FOUND);
		}
        
    	if (file.isFolder()) {
    		resp.setHeader(WebDAV.HEADER_CONTENT_TYPE, TEXT_HTML_CHARSET_UTF_8);
    		generateDirectoryListing(filePath, file, req, resp);
    	} else {
    		
    		resp.setHeader(WebDAV.HEADER_ETAG, file.getModified().toString());
    		resp.setHeader(WebDAV.HEADER_LAST_MODIFIED, WebDAV.formatCreationDate(file.getModified()));
    		resp.setHeader(WebDAV.HEADER_CONTENT_LENGTH, Long.toString(file.getSize()));
    		resp.setHeader(WebDAV.HEADER_CONTENT_TYPE, APPLICATION_OCTET_STREAM);    
    		
    		if (this.m_returnContent) {
    			FileCopyUtils.copy(file.getInputStream(), resp.getOutputStream());
    		}
    	}
    }

    /**
     * Parses the given ETag header into a list of separate ETags
     * 
     * @param strETagHeader The header to parse
     * @return A list of ETags
     */
    private ArrayList parseETags(String strETagHeader)
    {
        ArrayList<String> list = new ArrayList<String>();

        StringTokenizer tokenizer = new StringTokenizer(strETagHeader, WebDAV.HEADER_VALUE_SEPARATOR);
        while (tokenizer.hasMoreTokens())
        {
            list.add(tokenizer.nextToken().trim());
        }

        return list;
    }

    /**
     * Generates a HTML representation of the contents of the path represented by the given node
     * 
     * @param fileInfo the file to use
     */
    private void generateDirectoryListing(String path, File file, HttpServletRequest m_request, HttpServletResponse m_response)
    {
        Writer writer = null;
		String basePath = WEBDAV_MAPPING  + path;
		
		
        try
        {
            writer = m_response.getWriter();
            // Send back the start of the HTML
            writer.write("<html><head><title>");
            writer.write("Ever365 DAV Listing");
            writer.write("</title>");
            writer.write("<style>");
            writer.write("body { font-family: Arial, Helvetica; font-size: 12pt; background-color: white; }\n");
            writer.write("table { font-family: Arial, Helvetica; font-size: 12pt; background-color: white; }\n");
            writer.write(".listingTable { border: solid black 1px; }\n");
            writer.write(".textCommand { font-family: verdana; font-size: 10pt; }\n");
            writer.write(".textLocation { font-family: verdana; font-size: 11pt; font-weight: bold; color: #2a568f; }\n");
            writer.write(".textData { font-family: verdana; font-size: 10pt; }\n");
            writer.write(".tableHeading { font-family: verdana; font-size: 10pt; font-weight: bold; color: white; background-color: #2a568f; }\n");
            writer.write(".rowOdd { background-color: #eeeeee; }\n");
            writer.write(".rowEven { background-color: #dddddd; }\n");
            writer.write("</style></head>\n");
            writer.flush();

            // Send back the table heading
            writer.write("<body>\n");
            writer.write("<table cellspacing='2' cellpadding='3' border='0' width='100%'>\n");
            writer.write("<tr><td colspan='4' class='textLocation'>");
            writer.write("文件列表");
            writer.write(' ');
            String encodeHTML = WebDAVHelper.encodeHTML(rootPath + path);
			writer.write(encodeHTML);
            writer.write("</td></tr>\n");
            writer.write("<tr><td height='10' colspan='4'></td></tr></table>");

            writer.write("<table cellspacing='2' cellpadding='3' border='0' width='100%' class='listingTable'>\n");
            writer.write("<tr><td class='tableHeading' width='*'>");
            writer.write("文件名称");
            writer.write("</td>");
            writer.write("<td class='tableHeading' width='10%'>");
            writer.write("大小");
            writer.write("</td>");
            writer.write("<td class='tableHeading' width='20%'>");
            writer.write("所有者");
            writer.write("</td>");
            writer.write("<td class='tableHeading' width='25%'>");
            writer.write("修改日期");
            writer.write("</td>");
            writer.write("</tr>\n");

            // Start with a link to the parent folder so we can navigate back up, unless we are at the root level
            if (!path.equals(WebDAVHelper.PathSeperator))
            {
                writer.write("<tr class='rowOdd'>");
                writer.write("<td colspan='4' class='textData'><a href=\"");
                writer.write(WebDAVHelper.encodeHTML(StringUtils.getParentPath(basePath, WebDAV.PathSeperator)));
                writer.write("\">");
                writer.write("[");
                writer.write("上一级");
                writer.write("]</a>");
                writer.write("</tr>\n");
            }

            // Send back what we have generated so far
            writer.flush();
            int rowId = 0;
            List<File> list = file.getChildren();
            for (File c : list) {
            	
                // Output the details for the current node
                writer.write("<tr class='");
                if ((rowId++ & 1) == 1)
                {
                    writer.write("rowOdd");
                }
                else
                {
                    writer.write("rowEven");
                }
                writer.write("'><td class='textData'><a href=\"");
                writer.write(basePath);

                // name field
                String fname = c.getName();

                writer.write(WebDAVHelper.encodeURL(fname));
                writer.write("\">");
                writer.write(WebDAVHelper.encodeHTML(fname));
                writer.write("</a>");

                // size field
                writer.write("</td><td class='textData'>");
                if (!c.isFolder())
                {
                	writer.write(formatSize(Long.toString(c.getSize())));
                } else {
                	writer.write("&nbsp;");
                }
                writer.write("</td><td class='textData'>");
                //owner
                writer.write(AuthenticationUtil.getCurrentUserName());
                writer.write("</td><td class='textData'>");
                
                // modified date field
                writer.write(WebDAV.formatModifiedDate(c.getModified()));
                writer.write("</td></tr>\n");
                
                // flush every few rows
                if ((rowId & 15) == 0)
                {
                    writer.flush();
                }
			}
            
            writer.write("</table></body></html>");
        }
        catch (Throwable e)
        {

            if (writer != null)
            {
                try
                {
                    writer.write("</table><table><tr><td style='color:red'>");
                    writer.write("文件夹错误");
                    writer.write("</td></tr></table></body></html>");
                    writer.flush();
                }
                catch (IOException ioe)
                {
                }
            }
        }
    }

    /**
     * Formats the given size for display in a directory listing
     * 
     * @param strSize The content size
     * @return The formatted size
     */
    private String formatSize(String strSize)
    {
        String strFormattedSize = strSize;

        int length = strSize.length();
        if (length < 4)
        {
            strFormattedSize = strSize + " B";
        }
        else if (length >= 4 && length < 7)
        {
            String strLeft = strSize.substring(0, length - 3);
            String strRight = strSize.substring(length - 3, length - 2);

            StringBuilder buffer = new StringBuilder(strLeft);
            if (!strRight.equals('0'))
            {
                buffer.append('.');
                buffer.append(strRight);
            }
            buffer.append(" K");

            strFormattedSize = buffer.toString();
        }
        else
        {
            String strLeft = strSize.substring(0, length - 6);
            String strRight = strSize.substring(length - 6, length - 5);

            StringBuilder buffer = new StringBuilder(strLeft);
            if (!strRight.equals('0'))
            {
                buffer.append('.');
                buffer.append(strRight);
            }
            buffer.append(" M");

            strFormattedSize = buffer.toString();
        }

        return strFormattedSize;
    }


	@Override
	protected void parseRequestHeaders(HttpServletRequest req)
			throws WebDAVServerException {
		// TODO Auto-generated method stub
		
	}


	@Override
	protected void parseRequestBody(HttpServletRequest req)
			throws WebDAVServerException {
		// TODO Auto-generated method stub
		
	}
}
