package com.ever365.vfile.protocol.webdav;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.ever365.security.UserService;
import com.ever365.vfile.VFileService;

public abstract class WebDAVMethod {
	
	public static final String WEBDAV_MAPPING = "/webdav";
	public static final String APP_DAV = "app";
	public static final String SPACE_DAV = "space";
	
	protected String rootPath;
	protected String filePath = "/";
	private String responseType;
	protected VFileService fileService = null;
	protected UserService userService = null;
	
    public void setFileService(VFileService fileService) {
		this.fileService = fileService;
	}


	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	private static final boolean XMLPrettyPrint = true;
    
    
	public WebDAVMethod() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	

	 /**
     * Executes the method, wrapping the call to {@link #executeImpl()} in an appropriate transaction
     * and handling the error conditions.
     * @throws Exception 
     */
    public void execute(HttpServletRequest req, HttpServletResponse resp) throws Exception 
    {
    	initContext(req);
        // Parse the HTTP headers
        parseRequestHeaders(req);
 
        // Parse the HTTP body
        parseRequestBody(req);
       
        executeImpl(req, resp);
     
        afterModify();
    }
    
    protected  void initContext(HttpServletRequest request) throws WebDAVServerException, UnsupportedEncodingException {
    	 //paths = request.getRequestURI().substring(1).split(WebDAV.PathSeperator);
    	String pathinfo =  new String(request.getPathInfo().getBytes("ISO-8859-1"), "UTF-8");
    	
    	filePath = pathinfo;
    	 
    	//rootPath = WebDAV.PathSeperator + username + WebDAV.PathSeperator + responseType + WebDAV.PathSeperator + disk;
    }

    /**
     * Access the content repository to satisfy the request and generates the appropriate WebDAV
     * response.
     * 
     * @throws WebDAVServerException a general server exception
     * @throws Exception any unhandled exception
     */
    protected abstract void executeImpl(HttpServletRequest req, HttpServletResponse resp) throws WebDAVServerException, Exception;

    /**
     * Parses the given request body represented as an XML document and sets any necessary context
     * ready for execution.
     */
    protected abstract void parseRequestBody(HttpServletRequest req) throws WebDAVServerException;

    /**
     * Parses the HTTP headers of the request and sets any necessary context ready for execution.
     * @param req 
     */
    protected abstract void parseRequestHeaders(HttpServletRequest req) throws WebDAVServerException;

	 
    /**
     * Generates a list of namespace declarations for the response
     */
    protected String generateNamespaceDeclarations(Map<String,String> nameSpaces)
    {
        StringBuilder ns = new StringBuilder();

        ns.append(" ");
        ns.append(WebDAV.XML_NS);
        ns.append(":");
        ns.append(WebDAV.DAV_NS);
        ns.append("=\"");
        ns.append(WebDAV.DEFAULT_NAMESPACE_URI);
        ns.append("\"");

        // Add additional namespaces
        
        if ( nameSpaces != null)
        {
            Iterator<String> namespaceList = nameSpaces.keySet().iterator();
    
            while (namespaceList.hasNext())
            {
                String strNamespaceUri = namespaceList.next();
                String strNamespaceName = nameSpaces.get(strNamespaceUri);
                
                ns.append(" ").append(WebDAV.XML_NS).append(":").append(strNamespaceName).append("=\"");
                ns.append(strNamespaceUri).append("\" ");
            }
        }
        
        return ns.toString();
    }
    
    /**
     * Retrieves the request body as an XML document
     * 
     * @return The body of the request as an XML document or null if there isn't a body
     */
    protected Document getRequestBodyAsDocument(HttpServletRequest req) throws WebDAVServerException
    {
        Document body = null;

        if (req.getContentLength() > 0)
        {
            // TODO: Do we need to do anything for chunking support?

            try
            {
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                factory.setNamespaceAware(true);

                DocumentBuilder builder = factory.newDocumentBuilder();
                body = builder.parse(new InputSource(req.getReader()));
            }
            catch (ParserConfigurationException e)
            {
                throw new WebDAVServerException(HttpServletResponse.SC_BAD_REQUEST, e);
            }
            catch (SAXException e)
            {
                throw new WebDAVServerException(HttpServletResponse.SC_BAD_REQUEST, e);
            }
            catch (IOException e)
            {
                throw new WebDAVServerException(HttpServletResponse.SC_BAD_REQUEST, e);
            }
        }

        return body;
    }
	
    /**
     * Create an XML writer for the response
     * 
     * @return XMLWriter
     * @exception IOException
     */
    protected final XMLWriter createXMLWriter(HttpServletResponse resp) throws IOException
    {
        // Check if debug output or XML pretty printing is enabled
        XMLWriter writer = null;
        
        if (XMLPrettyPrint == true)
        {
            writer = new XMLWriter(resp.getWriter(), OutputFormat.createPrettyPrint());
        }
        else
        {
            writer = new XMLWriter(resp.getWriter(), OutputFormat.createCompactFormat());
        }
        return writer;
    }
    
    public boolean allowModify() {
    	return true;
    	
    }
    
    
    public void beforeModify() throws WebDAVServerException {
    	if ((this instanceof CopyMethod) 
    			|| (this instanceof PutMethod) 
    			|| (this instanceof PostMethod) 
    			|| (this instanceof MoveMethod)
    			|| (this instanceof MkcolMethod)
    			|| (this instanceof DeleteMethod)) {
    		if (!allowModify()) { 
    			throw new WebDAVServerException(HttpServletResponse.SC_FORBIDDEN);
    		}
    	}
    }
    
    public void afterModify() {
    	if ((this instanceof CopyMethod) 
    			|| (this instanceof PutMethod) 
    			|| (this instanceof PostMethod) 
    			|| (this instanceof MoveMethod)
    			|| (this instanceof MkcolMethod)
    			|| (this instanceof DeleteMethod)) {
    	}
    }
    
    protected String getRelPath(String path) {
    	if (path.startsWith(this.rootPath)) {
    		String n = path.substring(rootPath.length());
    		if (!n.endsWith(WebDAV.PathSeperator)) {
    			return n + WebDAV.PathSeperator;
    		} else {
    			return n;
    		}
    	} else {
    		return WebDAV.PathSeperator;
    	}
    }
	
 }