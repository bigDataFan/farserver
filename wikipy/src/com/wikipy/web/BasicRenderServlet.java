package com.wikipy.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bson.types.ObjectId;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.wikipy.content.ContentService;
import com.wikipy.repository.RepositoryService;
import com.wikipy.utils.StringUtils;

/**
 * Servlet implementation class BasicRenderServlet
 */
public class BasicRenderServlet extends HttpServlet {
	public static final String TEXT_HTML_CHARSET_UTF_8 = "text/html;charset=UTF-8";
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public BasicRenderServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
	private ContentService contentService;
	private RepositoryService repositoryService;

	@Override
	public void init(ServletConfig config) throws ServletException {
		// TODO Auto-generated method stub
		super.init(config);
		super.init(config);
		WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
		contentService = (ContentService) ctx.getBean("contentService");
		repositoryService = (RepositoryService) ctx.getBean("repositoryService");
	}
	
	
	private String rootNode;
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String path = request.getPathInfo();
		
		String webappUri = request.getRequestURI().split("/")[1];
		
		String servletPath = request.getServletPath();
		if (path.equals("/")) {
			if (rootNode==null) {
				Map<String, Object> query = new HashMap<String, Object>();
				query.put(RepositoryService.PROP_PATH, "/");
				Map<String, Object> item = repositoryService.queryOneItem(query);
				rootNode = item.get("_id").toString();
			}
			response.sendRedirect("/" + webappUri + servletPath + "/" + rootNode + "/page/1");
			return;
		}
		
		String[] splits = path.split("/");
		
		if (splits.length!=4) {
			response.sendError(404);
			return;
		}
		int perpage = 100;
		String parentPath = splits[1];
		int page = new Integer(splits[3]);
		
		response.setContentType(TEXT_HTML_CHARSET_UTF_8);
		PrintWriter writer = response.getWriter();
		writer.write("<html><head><title>");
        writer.write(parentPath);
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
        
        Map itemMap = repositoryService.getItem(parentPath);
        
        writer.write("当前目录:" + itemMap.get("_path")
        		+ "   <a href=\"/" + webappUri + servletPath + "/" + itemMap.get("_parent_id") + "/page/1" 
        		+ "\">转到上一级 </a>  <a href=\"/" + webappUri + "/client/node.jsp?parentid=" + parentPath + "\">增加</a>");
        
        writer.write("<table cellspacing='2' cellpadding='3' border='0' width='100%' class='listingTable'>\n");
        writer.write("<tr><td class='tableHeading' width='*'>");
        writer.write("Name");
        writer.write("</td>");
        writer.write("<td class='tableHeading' width='20%'>");
        writer.write("Title");
        writer.write("</td>");
        writer.write("<td class='tableHeading' width='40%'>");
        writer.write("Description");
        writer.write("</td>");
        writer.write("<td class='tableHeading' width='20%'>");
        writer.write("Date");
        writer.write("</td>");
        writer.write("<td class='tableHeading' width='10%'>");
        writer.write("Attachments");
        writer.write("</td>");
        
        writer.write("</tr>\n");
        
        Collection<Map<String, Object>> children = repositoryService.listChildRen(parentPath, null, (page-1)* perpage, 100, null, null);
        int rowId = 0;
        for (Map<String, Object> map : children) {
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
              writer.write("/" + webappUri + servletPath + "/" + map.get("_id") + "/page/1\">");
              
              writer.write((String)map.get("_name") + "</a></td>");
              
              writer.write("<td class='textData'>");
              writer.write((String)map.get("_title") + "</td>");
              
              writer.write("<td class='textData'>");
              writer.write(map.get("_desc") + "</td>");
              writer.write("<td class='textData'>");
              writer.write(StringUtils.getFormateDate(new Date(((ObjectId)map.get("_id")).getTime())) + "</td>");
              
              writer.write("<td class='textData'>");
              int attachcount = 0;
              if (map.get("_attaches")!=null) {
            	  attachcount = ((Collection)map.get("_attaches")).size();
              }
              writer.write(attachcount + "</td>");
              
              
              writer.write("</tr>");
		}
        
        writer.write("</table></body></html>");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
