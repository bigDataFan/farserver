package com.ever365.vfile.protocol.webdav;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.utils.StringUtils;

import com.ever365.vfile.File;


public class MoveMethod extends WebDAVMethod {
	
	private boolean m_overwrite;

	public MoveMethod() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	protected void executeImpl(HttpServletRequest req, HttpServletResponse resp)
			throws WebDAVServerException, Exception {
		String destPath = getRelPath(WebDAV.getDestinationPath(req));
		
		if (filePath.equals(WebDAV.PathSeperator) || destPath.equals(WebDAV.PathSeperator)) {
			throw new WebDAVServerException(HttpServletResponse.SC_BAD_REQUEST);
		}
		
		String o_parent = StringUtils.getParentPath(filePath, WebDAV.PathSeperator);
		String t_parent = StringUtils.getParentPath(destPath, WebDAV.PathSeperator);
		String t_name = StringUtils.getFileName(destPath, WebDAV.PathSeperator);
		
		File file = fileService.getRootFile().getByPath(filePath);
		
		
		if (file == null) {
			throw new WebDAVServerException(HttpServletResponse.SC_NOT_FOUND);
		}
		
		if (o_parent.equals(t_parent) && !filePath.equals(destPath)) {
			//父路径相同  重命名
			fileService.rename(file.getDbObject(), t_name);
		} else {
			//否则是移动
			File targetParent = fileService.getRootFile().getByPath(t_parent);
			if (targetParent==null) {
				throw new WebDAVServerException(HttpServletResponse.SC_NOT_FOUND);
			}
			
			file.moveTo(targetParent, m_overwrite);
		}
	}

	@Override
	protected void parseRequestBody(HttpServletRequest req)
			throws WebDAVServerException {

	}

	@Override
	protected void parseRequestHeaders(HttpServletRequest req)
			throws WebDAVServerException {
		String strOverwrite = req.getHeader(WebDAV.HEADER_OVERWRITE);
		if (strOverwrite != null && strOverwrite.equals(WebDAV.T)) {
			m_overwrite = true;
		}

	}
	
	/*
	public String getDestinationPath(HttpServletRequest m_request) throws WebDAVServerException {
		  // Get the destination path for the copy

        String strDestination = m_request.getHeader(WebDAV.HEADER_DESTINATION);
      
        String m_strDestinationPath = null;
		if (strDestination != null && strDestination.length() > 0)
        {
            int offset = -1;

            if (strDestination.startsWith("http://"))
            {
                // Check that the URL is on this server and refers to the WebDAV
                // path, if not then return an error

                checkDestinationPath(strDestination, m_request);

                // Set the offset to the start of the

                offset = 7;
            }
            else if (strDestination.startsWith("https://"))
            {
                // Check that the URL is on this server and refers to the WebDAV
                // path, if not then return an error

                checkDestinationPath(strDestination, m_request);

                // Set the offset to the start of the

                offset = 8;
            }

            // Strip the start of the path if not a relative path

            if (offset != -1)
            {
                offset = strDestination.indexOf(WebDAV.PathSeperator, offset);
                if (offset != -1)
                {
                    String strPath = strDestination.substring(offset);
                    String servletPath = m_request.getServletPath();

                    offset = strPath.indexOf(servletPath);
                    if (offset != -1)
                        strPath = strPath.substring(offset + servletPath.length());

                    m_strDestinationPath = WebDAV.decodeURL(strPath);
                }
            }
        }
        return m_strDestinationPath;
	}
	
	public boolean isOverwrite(HttpServletRequest m_request) {
		 // Check if the copy should overwrite an existing file
        String strOverwrite = m_request.getHeader(WebDAV.HEADER_OVERWRITE);
		if (strOverwrite != null && strOverwrite.equals(WebDAV.T)) {
			return true;
		} else {
			return false;
		}
	}
	
	 /**
     * Check that the destination path is on this server and is a valid WebDAV
     * path for this server
     * 
     * @param path String
     * @exception WebDAVServerException
     */
	/*
	
    protected final void checkDestinationPath(String path, HttpServletRequest m_request) throws WebDAVServerException
    {
        try
        {
            // Parse the URL

            URL url = new URL(path);

            // Check if the path is on this WebDAV server

            boolean localPath = true;

            if (url.getPort() != -1 && url.getPort() != m_request.getLocalPort())
            {
                // Debug
                localPath = false;
            }
            else if (url.getHost().equalsIgnoreCase( m_request.getLocalName()) == false
                    && url.getHost().equals(m_request.getLocalAddr()) == false)
            {
            	// The target host may contain a domain or be specified as a numeric IP address
            	
            	String targetHost = url.getHost();
            	
            	if ( IPAddress.isNumericAddress( targetHost) == false)
            	{
	            	String localHost  = m_request.getLocalName();
	            	
	            	int pos = targetHost.indexOf( ".");
	            	if ( pos != -1)
	            		targetHost = targetHost.substring( 0, pos);
	            	
	            	pos = localHost.indexOf( ".");
	            	if ( pos != -1)
	            		localHost = localHost.substring( 0, pos);
	            	
	            	// compare the host names
	            	
	            	if ( targetHost.equalsIgnoreCase( localHost) == false)
	            		localPath = false;
            	}
            	else
            	{
            		try
            		{
	            		// Check if the target IP address is a local address
	            		
            			InetAddress targetAddr = InetAddress.getByName( targetHost);
            			if ( NetworkInterface.getByInetAddress( targetAddr) == null)
            				localPath = false;
            		}
            		catch (Exception ex)
            		{
            			// DEBUG
            			localPath = false;
            		}
            	}
            	
            }
            else if (url.getPath().indexOf(m_request.getServletPath()) == -1)
            {
                localPath = false;
            }

            // If the URL does not refer to this WebDAV server throw an
            // exception

            if (localPath != true)
                throw new WebDAVServerException(HttpServletResponse.SC_BAD_GATEWAY);
        }
        catch (MalformedURLException ex)
        {
            throw new WebDAVServerException(HttpServletResponse.SC_BAD_GATEWAY);
        }
    }
    */
}
