package com.ever365.rest;

import java.io.IOException;
import java.io.InputStream;
import java.net.SocketException;
import java.net.URLEncoder;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.gqu.utils.FileCopyUtils;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.ever365.security.AuthenticationUtil;
import com.ever365.vfile.File;
import com.ever365.vfile.VFileService;

/**
 * Servlet implementation class DownloadServlet
 */
public class DownloadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
	private VFileService fileService;
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DownloadServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    @Override
	public void init(ServletConfig config) throws ServletException {
		WebApplicationContext ctx = WebApplicationContextUtils
		.getRequiredWebApplicationContext(config.getServletContext());
		fileService = (VFileService) ctx.getBean("fileService");
	}
	
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		File file = fileService.getFileById(request.getParameter("id"));
		
		if (file==null) {
			response.sendError(404);
			return;	
		}
		
		if (!file.getCreator().equals(AuthenticationUtil.getCurrentUser())) {
			response.sendError(403);
			return;
		}
		
		response.setCharacterEncoding("UTF-8");
		response.setContentType("Content-Type: application/octet-stream");
		
		response.setHeader("Content-Disposition", "attachment; filename=\""
				+ URLEncoder.encode(file.getName(), "utf-8") + "\";");
		//response.setContentType(MimeTypeUtils.guess(file.getName()));
		
		
		response.setHeader("Accept-Ranges", "bytes");
		try {
			boolean processedRange = false;
			String range = request.getHeader("Content-Range");
			if (range == null) {
				range = request.getHeader("Range");
			}
			if (range != null) // 支持断点续传和多线程下载
			{
				long l = file.getSize(); // get the length
				long p = 0;
				response.reset();
				response.setHeader("Accept-Ranges", "bytes");
				if (request.getHeader("Range") != null) {
					response.setStatus(javax.servlet.http.HttpServletResponse.SC_PARTIAL_CONTENT);
					String sclient = request.getHeader("Range");
					sclient = sclient.substring("bytes=".length());
					if (sclient.charAt(sclient.length() - 1) == '-')
						sclient = sclient
								.substring(0, sclient.length() - 1); // 由于flashget等软件都只写文件起始字节而不写结束字节的值，所以此处不需要获取-号后面的值
					// by
					// liziqiang
					p = Long.parseLong(sclient);
				}
				response.setHeader("Content-Length", new Long(l - p).toString());
				if (p != 0) {
					response.setHeader("Content-Range", "bytes "
							+ new Long(p).toString() + "-"
							+ new Long(l - 1).toString() + "/"
							+ new Long(l).toString());
				}
				long k = 0;
				int ibuffer = 65536;
				byte[] bytes = new byte[ibuffer];
				InputStream fileinputstream = file.getInputStream();
				try {
					if (p != 0)
						fileinputstream.skip(p);
					while (k < l) {
						int j = fileinputstream.read(bytes, 0, ibuffer);
						response.getOutputStream().write(bytes, 0, j);
						response.getOutputStream().flush();
						k += j;
					}
					processedRange = true;
				} catch (Exception e) {
					System.err.println(e.getMessage());
				} finally {
					fileinputstream.close();
				}

			}

			if (processedRange == false) {
				// As per the spec:
				// If the server ignores a byte-range-spec because it is
				// syntactically
				// invalid, the server SHOULD treat the request as if the
				// invalid Range
				// header field did not exist.
				long size = file.getSize();
				response.setHeader("Content-Range", "bytes 0-"
						+ Long.toString(size - 1L) + "/"
						+ Long.toString(size));
				response.setHeader("Content-Length", Long.toString(size));
				FileCopyUtils.copy(file.getInputStream(), response.getOutputStream());
			}
		} catch (SocketException e1) {
			// the client cut the connection - our mission was accomplished
			// apart from a little error message
		} 
		
		
	}

}
