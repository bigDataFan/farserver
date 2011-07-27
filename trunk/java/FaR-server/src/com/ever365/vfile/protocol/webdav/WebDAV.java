package com.ever365.vfile.protocol.webdav;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.StringTokenizer;

import javax.servlet.http.HttpServletRequest;

public class WebDAV {

		private static final String UTF_8 = "UTF-8";
		 // WebDAV XML namespace
	    
	    public static final String DAV_NS   = "D";
	    public static final String DAV_NS_PREFIX = DAV_NS + ":";
	    
	    // PROPFIND depth
	    
	    public static final int DEPTH_0 = 0;
	    public static final int DEPTH_1 = 1;
	    public static final int DEPTH_INFINITY = -1;
	    public static final short TIMEOUT_INFINITY = -1;

	    // WebDAV HTTP response codes
	    
	    public static final int WEBDAV_SC_MULTI_STATUS = 207;
	    public static final int WEBDAV_SC_LOCKED = 423;

	    // HTTP response code descriptions
	    
	    public static final String SC_OK_DESC = "OK";
	    public static final String SC_NOT_FOUND_DESC = "Not Found";

	    // HTTP methods
	    
	    public static final String METHOD_PUT = "PUT";
	    public static final String METHOD_POST = "POST";
	    public static final String METHOD_GET = "GET";
	    public static final String METHOD_DELETE = "DELETE";
	    public static final String METHOD_HEAD = "HEAD";
	    public static final String METHOD_OPTIONS = "OPTIONS";
	    public static final String METHOD_PROPFIND = "PROPFIND";
	    public static final String METHOD_PROPPATCH = "PROPPATCH";
	    public static final String METHOD_MKCOL = "MKCOL";
	    public static final String METHOD_MOVE = "MOVE";
	    public static final String METHOD_COPY = "COPY";
	    public static final String METHOD_LOCK = "LOCK";
	    public static final String METHOD_UNLOCK = "UNLOCK";

	    // HTTP headers
	    
	    public static final String HEADER_CONTENT_LENGTH = "Content-Length";
	    public static final String HEADER_CONTENT_TYPE = "Content-Type";
	    public static final String HEADER_DEPTH = "Depth";
	    public static final String HEADER_DESTINATION = "Destination";
	    public static final String HEADER_ETAG = "ETag";
	    public static final String HEADER_EXPECT = "Expect";
	    public static final String HEADER_EXPECT_CONTENT = "100-continue";
	    public static final String HEADER_IF = "If";
	    public static final String HEADER_IF_MATCH = "If-Match";
	    public static final String HEADER_IF_MODIFIED_SINCE = "If-Modified-Since";
	    public static final String HEADER_IF_NONE_MATCH = "If-None-Match";
	    public static final String HEADER_IF_RANGE = "If-Range";
	    public static final String HEADER_IF_UNMODIFIED_SINCE = "If-Unmodified-Since";
	    public static final String HEADER_LAST_MODIFIED = "Last-Modified";
	    public static final String HEADER_LOCK_TOKEN = "Lock-Token";
	    public static final String HEADER_OVERWRITE = "Overwrite";
	    public static final String HEADER_RANGE = "Range";
	    public static final String HEADER_TIMEOUT = "Timeout";

	    // If-Modified/If-Unmodified date format
	    
	    public static final String HEADER_IF_DATE_FORMAT = "EEE, dd MMM yyyy HH:mm:ss zzz";
	    
	    // General string constants
	    
	    public static final String ASTERISK = "*";
	    public static final String DEFAULT_NAMESPACE_URI = "DAV:";
	    public static final String DIR_SEPARATOR = "/";
	    public static final String FAKE_TOKEN = "faketoken";
	    public static final String HTTP1_1 = "HTTP/1.1";
	    public static final String INFINITE = "Infinite";
	    public static final String INFINITY = "infinity";
	    public static final String OPAQUE_LOCK_TOKEN = "opaquelocktoken:";
	    public static final String NAMESPACE_SEPARATOR = ":";
	    public static final String SECOND = "Second-";
	    public static final String HEADER_VALUE_SEPARATOR = ",";
	    public static final String ZERO = "0";
	    public static final String ONE = "1";
	    public static final String T = "T";

	    // Strings used in WebDAV XML payload
	    
	    public static final String XML_NS = "xmlns";
	    
	    public static final String XML_ACTIVE_LOCK = "activelock";
	    public static final String XML_ALLPROP = "allprop";
	    public static final String XML_COLLECTION = "collection";
	    public static final String XML_CREATION_DATE = "creationdate";
	    public static final String XML_DEPTH = "depth";
	    public static final String XML_DISPLAYNAME = "displayname";
	    public static final String XML_EXCLUSIVE = "exclusive";
	    public static final String XML_GET_CONTENT_LANGUAGE = "getcontentlanguage";
	    public static final String XML_GET_CONTENT_LENGTH = "getcontentlength";
	    public static final String XML_GET_CONTENT_TYPE = "getcontenttype";
	    public static final String XML_GET_ETAG = "getetag";
	    public static final String XML_GET_LAST_MODIFIED = "getlastmodified";
	    public static final String XML_HREF = "href";
	    public static final String XML_LOCK_DISCOVERY = "lockdiscovery";
	    public static final String XML_LOCK_SCOPE = "lockscope";
	    public static final String XML_LOCK_TOKEN = "locktoken";
	    public static final String XML_LOCK_TYPE = "locktype";
	    public static final String XML_MULTI_STATUS = "multistatus";
	    public static final String XML_OWNER = "owner";
	    public static final String XML_PROP = "prop";
	    public static final String XML_PROPNAME = "propname";
	    public static final String XML_PROPSTAT = "propstat";
	    public static final String XML_RESOURCE_TYPE = "resourcetype";
	    public static final String XML_RESPONSE = "response";
	    public static final String XML_SHARED = "shared";
	    public static final String XML_SOURCE = "source";
	    public static final String XML_STATUS = "status";
	    public static final String XML_SUPPORTED_LOCK = "supportedlock";
	    public static final String XML_TIMEOUT = "timeout";
	    public static final String XML_WRITE = "write";

	    // Namespaced versions of payload elements
	    
	    public static final String XML_NS_ACTIVE_LOCK = DAV_NS_PREFIX + "activelock";
	    public static final String XML_NS_ALLPROP = DAV_NS_PREFIX + "allprop";
	    public static final String XML_NS_COLLECTION = DAV_NS_PREFIX + "collection";
	    public static final String XML_NS_CREATION_DATE = DAV_NS_PREFIX + "creationdate";
	    public static final String XML_NS_DEPTH = DAV_NS_PREFIX + "depth";
	    public static final String XML_NS_DISPLAYNAME = DAV_NS_PREFIX + "displayname";
	    public static final String XML_NS_EXCLUSIVE = DAV_NS_PREFIX + "exclusive";
	    public static final String XML_NS_GET_CONTENT_LANGUAGE = DAV_NS_PREFIX + "getcontentlanguage";
	    public static final String XML_NS_GET_CONTENT_LENGTH = DAV_NS_PREFIX + "getcontentlength";
	    public static final String XML_NS_GET_CONTENT_TYPE = DAV_NS_PREFIX + "getcontenttype";
	    public static final String XML_NS_GET_ETAG = DAV_NS_PREFIX + "getetag";
	    public static final String XML_NS_GET_LAST_MODIFIED = DAV_NS_PREFIX + "getlastmodified";
	    public static final String XML_NS_HREF = DAV_NS_PREFIX + "href";
	    public static final String XML_NS_LOCK_DISCOVERY = DAV_NS_PREFIX + "lockdiscovery";
	    public static final String XML_NS_LOCK_SCOPE = DAV_NS_PREFIX + "lockscope";
	    public static final String XML_NS_LOCK_TOKEN = DAV_NS_PREFIX + "locktoken";
	    public static final String XML_NS_LOCK_TYPE = DAV_NS_PREFIX + "locktype";
	    public static final String XML_NS_MULTI_STATUS = DAV_NS_PREFIX + "multistatus";
	    public static final String XML_NS_OWNER = DAV_NS_PREFIX + "owner";
	    public static final String XML_NS_PROP = DAV_NS_PREFIX + "prop";
	    public static final String XML_NS_PROPNAME = DAV_NS_PREFIX + "propname";
	    public static final String XML_NS_PROPSTAT = DAV_NS_PREFIX + "propstat";
	    public static final String XML_NS_RESOURCE_TYPE = DAV_NS_PREFIX + "resourcetype";
	    public static final String XML_NS_RESPONSE = DAV_NS_PREFIX + "response";
	    public static final String XML_NS_SHARED = DAV_NS_PREFIX + "shared";
	    public static final String XML_NS_SOURCE = DAV_NS_PREFIX + "source";
	    public static final String XML_NS_STATUS = DAV_NS_PREFIX + "status";
	    public static final String XML_NS_SUPPORTED_LOCK = DAV_NS_PREFIX + "supportedlock";
	    public static final String XML_NS_TIMEOUT = DAV_NS_PREFIX + "timeout";
	    public static final String XML_NS_WRITE = DAV_NS_PREFIX + "write";
	    
	    public static final String XML_CONTENT_TYPE = "text/xml; charset=UTF-8";
	    
	    // Alfresco specific properties
	    
	    public static final String XML_ALF_AUTHTICKET    = "authticket";
	    public static final String XML_NS_ALF_AUTHTICKET = DAV_NS_PREFIX + "authticket";
	    
	    // Path seperator
	    
	    public static final String PathSeperator   = "/";
	    public static final char PathSeperatorChar = '/';
	    
	    // Lock token seperator
	    
	    public static final String LOCK_TOKEN_SEPERATOR = ":";
	    
	    // Root path
	    
	    private static final String RootPath = PathSeperator;
	    
	    // Map WebDAV property names to Alfresco property names
	    
	    
	    // WebDAV creation date/time formatter
	    
	    private static SimpleDateFormat _creationDateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
	    
	    //  HTTP header date/time formatter
	    //  NOTE: According to RFC2616 dates should always be in English and in
	    //        the GMT timezone see http://rfc.net/rfc2616.html#p20 for details
	    
	    private static SimpleDateFormat _httpDateFormatter = new SimpleDateFormat(HEADER_IF_DATE_FORMAT, Locale.ENGLISH);
	    
	    /**
	     * Formats the given date so that it conforms with the Last-Modified HTTP header
	     * 
	     * @param date The date to format
	     * @return The formatted date string
	     */
	    public static String formatModifiedDate(Date date)
	    {
	        return _httpDateFormatter.format(date);
	    }

	    /**
	     * Formats the given date so that it conforms with the Last-Modified HTTP header
	     * 
	     * @param date long
	     * @return The formatted date string
	     */
	    public static String formatModifiedDate(long ldate)
	    {
	        return _httpDateFormatter.format(new Date(ldate));
	    }

	    /**
	     * Formats the given date so that it conforms with the WebDAV creation date/time format
	     * 
	     * @param date The date to format
	     * @return The formatted date string
	     */
	    public static String formatCreationDate(Date date)
	    {
	        return _creationDateFormatter.format(date);
	    }

	    /**
	     * Formats the given date so that it conforms with the WebDAV creation date/time format
	     * 
	     * @param date long
	     * @return The formatted date string
	     */
	    public static String formatCreationDate(long ldate)
	    {
	        return _creationDateFormatter.format(new Date(ldate));
	    }

	    /**
	     * Formats the given date for use in the HTTP header
	     * 
	     * @param date Date
	     * @return String
	     */
	    public static String formatHeaderDate(Date date)
	    {
	        return _httpDateFormatter.format( date);
	    }
	    
	    /**
	     * Formats the given date for use in the HTTP header
	     * 
	     * @param date long
	     * @return String
	     */
	    public static String formatHeaderDate(long date)
	    {
	        return _httpDateFormatter.format( new Date(date));
	    }
		
	    public static String getDestinationPath(HttpServletRequest request) {
			String strPath = net.gqu.webscript.URLDecoder.decode(request.getHeader(WebDAV.HEADER_DESTINATION));
			String servletPath = request.getServletPath();
			//
			int rootpos = strPath.indexOf(servletPath);
			
			if (rootpos != -1) {
				strPath = strPath.substring(rootpos + servletPath.length());
			}
			if (strPath == null) {
				strPath = request.getServletPath();
			}
			return strPath;
		
			
	    }
	    
		public static String getRepositoryPath(HttpServletRequest request) {
			String strPath = null;
			
			try {
				strPath = URLDecoder.decode(request.getRequestURI(), UTF_8);
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
			String servletPath = request.getServletPath();
			int rootpos = strPath.indexOf(servletPath);
			
			if (rootpos != -1) {
				strPath = strPath.substring(rootpos + servletPath.length());
			}
			if (strPath == null) {
				strPath = request.getServletPath();
			}
			return strPath;
		}
		
		  /**
	     * Returns a URL that could be used to access the given path.
	     * 
	     * @param request HttpServletRequest
	     * @param path String
	     * @param isCollection boolean
	     * @return String
	     */
	    public static String getURLForPath(HttpServletRequest request, String path, boolean isCollection)
	    {
	        StringBuilder urlStr = new StringBuilder(request.getRequestURI());
	        String servletPath = request.getServletPath();
	        
	        int rootPos = urlStr.indexOf(servletPath);
	        if (rootPos != -1)
	        {
	            urlStr.setLength(rootPos + servletPath.length());
	        }
	        
	        if (urlStr.charAt(urlStr.length() - 1) != PathSeperatorChar)
	        {
	            urlStr.append(PathSeperator);
	        }
	        
	        if (path.equals(RootPath) == false)
	        {
	            // split the path and URL encode each path element
	            for (StringTokenizer t = new StringTokenizer(path, PathSeperator); t.hasMoreTokens(); /**/)
	            {
	                urlStr.append( WebDAVHelper.encodeURL(t.nextToken()) );
	                if (t.hasMoreTokens())
	                {
	                    urlStr.append(PathSeperator);
	                }
	            }
	        }
	        
	        // If the URL is to a collection add a trailing slash
	        if (isCollection && urlStr.charAt( urlStr.length() - 1) != PathSeperatorChar)
	        {
	            urlStr.append( PathSeperator);
	        }
	        
	        // Return the URL string
	        return urlStr.toString();
	    }	
}
