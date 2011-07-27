package com.ever365.vfile.protocol.webdav;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dom4j.DocumentHelper;
import org.dom4j.io.XMLWriter;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.helpers.AttributesImpl;

import com.ever365.vfile.File;


public class PropFindMethod extends WebDAVMethod {

    public PropFindMethod() {
	}

	// Request types
	protected static final int GET_ALL_PROPS = 0;
	protected static final int GET_NAMED_PROPS = 1;
	protected static final int FIND_PROPS = 2;

    // Find depth and request type
    protected int m_mode = GET_ALL_PROPS;
    // Available namespaces list
    protected HashMap<String, String> m_namespaces = new HashMap<String, String>();

    private AttributesImpl nullAttr = new AttributesImpl();
    
	@Override
	protected void executeImpl(HttpServletRequest req, HttpServletResponse resp)
			throws WebDAVServerException, Exception {

	
		File file = fileService.getRootFile().getByPath(filePath);
			
		if (file==null) {
			throw new WebDAVServerException(HttpServletResponse.SC_NOT_FOUND);
		}
		resp.setStatus(WebDAV.WEBDAV_SC_MULTI_STATUS);
		resp.setContentType(WebDAV.XML_CONTENT_TYPE);
		
		XMLWriter xml = createXMLWriter(resp);
		
		xml.startDocument();
		
		String nsdec = generateNamespaceDeclarations(m_namespaces);
		
		xml.startElement(
				WebDAV.DAV_NS,
				WebDAV.XML_MULTI_STATUS + nsdec,
				WebDAV.XML_NS_MULTI_STATUS + nsdec,
				new AttributesImpl());
		
		
		if (file.isFolder() && !filePath.endsWith(WebDAV.PathSeperator)) {
			filePath = filePath + WebDAV.PathSeperator;
		}
		
		String basePath = WEBDAV_MAPPING  + filePath;
		generateResponseForNode(req, xml, file, basePath);
			
			//getDepth(req)!=WebDAV.DEPTH_0 &&
			if (file.isFolder()) {
				List<File> children = file.getChildren();
				for (File child : children) {
					generateResponseForNode(req, xml, child, basePath + child.getName());
					
				}
			}
			
		
		// Close the outer XML element
		xml.endElement(WebDAV.DAV_NS, WebDAV.XML_MULTI_STATUS, WebDAV.XML_NS_MULTI_STATUS);
		// Send remaining data
		xml.flush();
		
		
	}

	@Override
	protected void parseRequestBody(HttpServletRequest req) throws WebDAVServerException {
		 Document body = getRequestBodyAsDocument(req);
	        if (body != null)
	        {
	            Element rootElement = body.getDocumentElement();
	            NodeList childList = rootElement.getChildNodes();
	            Node node = null;

	            for (int i = 0; i < childList.getLength(); i++)
	            {
	                Node currentNode = childList.item(i);
	                switch (currentNode.getNodeType())
	                {
	                case Node.TEXT_NODE:
	                    break;
	                case Node.ELEMENT_NODE:
	                    if (currentNode.getNodeName().endsWith(WebDAV.XML_ALLPROP))
	                    {
	                        m_mode = GET_ALL_PROPS;
	                    }
	                    else if (currentNode.getNodeName().endsWith(WebDAV.XML_PROP))
	                    {
	                        m_mode = GET_NAMED_PROPS;
	                        node = currentNode;
	                    }
	                    else if (currentNode.getNodeName().endsWith(WebDAV.XML_PROPNAME))
	                    {
	                        m_mode = FIND_PROPS;
	                    }

	                    break;
	                }
	            }

	            if (m_mode == GET_NAMED_PROPS)
	            {
	                ArrayList<WebDAVProperty> m_properties = new ArrayList<WebDAVProperty>();
	                childList = node.getChildNodes();

	                for (int i = 0; i < childList.getLength(); i++)
	                {
	                    Node currentNode = childList.item(i);
	                    switch (currentNode.getNodeType())
	                    {
	                    case Node.TEXT_NODE:
	                        break;
	                    case Node.ELEMENT_NODE:
	                        m_properties.add(createProperty(currentNode));
	                        break;
	                    }
	                }
	            }
	        }

	}
	
	 /**
     * Creates a WebDAVProperty from the given XML node
     */
    private WebDAVProperty createProperty(Node node)
    {
        WebDAVProperty property = null;

        String strName = node.getLocalName();
        String strNamespaceUri = node.getNamespaceURI();

        if (strNamespaceUri.equals(WebDAV.DEFAULT_NAMESPACE_URI))
        {
            property = new WebDAVProperty(strName);
        }
        else
        {
            property = new WebDAVProperty(strName, strNamespaceUri, getNamespaceName(strNamespaceUri));
        }

        return property;
    }
    
    /**
     * Retrieves the namespace name for the given namespace URI, one is
     * generated if it doesn't exist
     */
    private String getNamespaceName(String strNamespaceUri)
    {
        String strNamespaceName = m_namespaces.get(strNamespaceUri);
        if (strNamespaceName == null)
        {
            strNamespaceName = "ns" + m_namespaces.size();
            m_namespaces.put(strNamespaceUri, strNamespaceName);
        }

        return strNamespaceName;
    }
    
	

	@Override
	protected void parseRequestHeaders(HttpServletRequest req)
			throws WebDAVServerException {
	}
	
	
	public int getDepth(HttpServletRequest req) {
		String strDepth = req.getHeader(WebDAV.HEADER_DEPTH);
        int m_depth = WebDAV.DEPTH_INFINITY;
		if (strDepth != null && strDepth.length() > 0)
        {
            if (strDepth.equals(WebDAV.ZERO))
            {
                m_depth = WebDAV.DEPTH_0;
            }
            else if (strDepth.equals(WebDAV.ONE))
            {
                m_depth = WebDAV.DEPTH_1;
            }
            else
            {
                m_depth = WebDAV.DEPTH_INFINITY;
            }
        }
        return m_depth;
	}
	
	 /**
     * Generates the required response XML for the current node
     * 
     * @param xml XMLWriter
     * @param node NodeRef
     * @param path String
     */
    protected void generateResponseForNode(HttpServletRequest req, XMLWriter xml, File file, String path) throws Exception
    {
        boolean isFolder = file.isFolder(); 
        
        // Output the response block for the current node
        xml.startElement(
                WebDAV.DAV_NS,
                WebDAV.XML_RESPONSE,
                WebDAV.XML_NS_RESPONSE,
                nullAttr);

        // Build the href string for the current node
        String strHRef = path;//WebDAV.getURLForPath(req, path, isFolder);

        xml.startElement(WebDAV.DAV_NS, WebDAV.XML_HREF, WebDAV.XML_NS_HREF, nullAttr);
        xml.write(strHRef);
        xml.endElement(WebDAV.DAV_NS, WebDAV.XML_HREF, WebDAV.XML_NS_HREF);

        generateAllPropertiesResponse(xml, file, isFolder);
        
        // Close off the response element
        xml.endElement(WebDAV.DAV_NS, WebDAV.XML_RESPONSE, WebDAV.XML_NS_RESPONSE);
    }
    
    
    
    
    /**
     * Generates the XML response for a PROPFIND request that asks for all known
     * properties
     * 
     * @param xml XMLWriter
     * @param node NodeRef
     * @param isDir boolean
     */
    protected void generateAllPropertiesResponse(XMLWriter xml, File file, boolean isDir) throws Exception
    {
        // Output the start of the properties element


        xml.startElement(WebDAV.DAV_NS, WebDAV.XML_PROPSTAT, WebDAV.XML_NS_PROPSTAT, nullAttr);
        xml.startElement(WebDAV.DAV_NS, WebDAV.XML_PROP, WebDAV.XML_NS_PROP, nullAttr);


        // If the node is a folder then return as a collection type

        xml.startElement(WebDAV.DAV_NS, WebDAV.XML_RESOURCE_TYPE, WebDAV.XML_NS_RESOURCE_TYPE, nullAttr);
        if (isDir)
            xml.write(DocumentHelper.createElement(WebDAV.XML_NS_COLLECTION));
        xml.endElement(WebDAV.DAV_NS, WebDAV.XML_RESOURCE_TYPE, WebDAV.XML_NS_RESOURCE_TYPE);

        
        // Get the node name
        xml.startElement(WebDAV.DAV_NS, WebDAV.XML_DISPLAYNAME, WebDAV.XML_NS_DISPLAYNAME, nullAttr);
        xml.write(file.getName());
        xml.endElement(WebDAV.DAV_NS, WebDAV.XML_DISPLAYNAME, WebDAV.XML_NS_DISPLAYNAME);

        // Output the source
        //
        // NOTE: source is always a no content element in our implementation

        xml.write(DocumentHelper.createElement(WebDAV.XML_NS_SOURCE));


        xml.startElement(WebDAV.DAV_NS, WebDAV.XML_CREATION_DATE, WebDAV.XML_NS_CREATION_DATE, nullAttr);
        xml.write(WebDAV.formatCreationDate(new Date(file.getObjectId().getTime())));
        xml.endElement(WebDAV.DAV_NS, WebDAV.XML_CREATION_DATE, WebDAV.XML_NS_CREATION_DATE);
        
        xml.startElement(WebDAV.DAV_NS, WebDAV.XML_GET_LAST_MODIFIED, WebDAV.XML_NS_GET_LAST_MODIFIED, nullAttr);
        xml.write(WebDAV.formatModifiedDate(file.getModified()));
        xml.endElement(WebDAV.DAV_NS, WebDAV.XML_GET_LAST_MODIFIED, WebDAV.XML_NS_GET_LAST_MODIFIED);

        if (file.getSize()>-1) {
            xml.startElement(WebDAV.DAV_NS, WebDAV.XML_GET_CONTENT_LENGTH, WebDAV.XML_NS_GET_CONTENT_LENGTH, nullAttr);
            xml.write("" + file.getSize());
            xml.endElement(WebDAV.DAV_NS, WebDAV.XML_GET_CONTENT_LENGTH, WebDAV.XML_NS_GET_CONTENT_LENGTH);
        }

        // For a file node output the content language and content type

        if (isDir == false)
        {
            xml.startElement(WebDAV.DAV_NS, WebDAV.XML_GET_CONTENT_LANGUAGE, WebDAV.XML_NS_GET_CONTENT_LANGUAGE,
                    nullAttr);
            // TODO:
            xml.endElement(WebDAV.DAV_NS, WebDAV.XML_GET_CONTENT_LANGUAGE, WebDAV.XML_NS_GET_CONTENT_LANGUAGE);


            // Output the content type
            xml.startElement(WebDAV.DAV_NS, WebDAV.XML_GET_CONTENT_TYPE, WebDAV.XML_NS_GET_CONTENT_TYPE, nullAttr);
            xml.write("application/octet-stream");
            xml.endElement(WebDAV.DAV_NS, WebDAV.XML_GET_CONTENT_TYPE, WebDAV.XML_NS_GET_CONTENT_TYPE);

            // Output the etag

            xml.startElement(WebDAV.DAV_NS, WebDAV.XML_GET_ETAG, WebDAV.XML_NS_GET_ETAG, nullAttr);
            xml.write(file.getModified().toString());
            xml.endElement(WebDAV.DAV_NS, WebDAV.XML_GET_ETAG, WebDAV.XML_NS_GET_ETAG);
        }

        // Close off the response

        xml.endElement(WebDAV.DAV_NS, WebDAV.XML_PROP, WebDAV.XML_NS_PROP);

        xml.startElement(WebDAV.DAV_NS, WebDAV.XML_STATUS, WebDAV.XML_NS_STATUS, nullAttr);
        xml.write(WebDAV.HTTP1_1 + " " + HttpServletResponse.SC_OK + " " + WebDAV.SC_OK_DESC);
        xml.endElement(WebDAV.DAV_NS, WebDAV.XML_STATUS, WebDAV.XML_NS_STATUS);

        xml.endElement(WebDAV.DAV_NS, WebDAV.XML_PROPSTAT, WebDAV.XML_NS_PROPSTAT);
    }
    
    
    
    
    
    
    
    /**
     * Generates the XML response for a PROPFIND request that asks for a
     * specific set of properties
     * 
     * @param xml XMLWriter
     * @param node NodeRef
     * @param isDir boolean
     */
    private void generateNamedPropertiesResponse(XMLWriter xml, Node node) throws Exception
    {
      
    }


}
