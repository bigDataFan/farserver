package net.gqu.webscript.object;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import net.gqu.exception.HttpStatusExceptionImpl;
import net.gqu.utils.StringUtils;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadBase.FileSizeLimitExceededException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.mozilla.javascript.NativeObject;
/**
 * Http服务处理类 
 */

public class ScriptRequest {
	public static final String NAME = "name";
	public static final String ISFILE = "isfile";
	public static final String SIZE = "size";
	public static final String MIMETYPE = "mimetype";
	public static final String INPUTSTREAM = "inputstream";
	public static final String FILENAME = "filename";
	private static final String GET = "get";
	private static final String UTF_8 = "utf-8";
	private static final String ISO_8859_1 = "ISO-8859-1";
	private HttpServletRequest request;
	private String remainPath;
	
	private StringBuffer sb = new StringBuffer();
	ScriptCookie[] cookies = null;
	private FileItemFactory factory;
	private long fileSizeMax = -1;
	
	
	public ScriptRequest(HttpServletRequest req) {
		request = req;
	}
	public String getPath() {
		return remainPath;
	}
	public void setRemainPath(String remainPath) {
		this.remainPath = remainPath;
	}
	
	public boolean isMultipart() {
		return ServletFileUpload.isMultipartContent(request);
	}

	public void setFactory(FileItemFactory factory) {
		this.factory = factory;
	}
	public void setFileSizeMax(long fileSizeMax) {
		this.fileSizeMax = fileSizeMax;
	}

	public NativeObject[] getMultipartParams() {
		ServletFileUpload upload = new ServletFileUpload(factory);
		
		if (fileSizeMax!=-1) {
			upload.setFileSizeMax(fileSizeMax);
		}
		NativeObject object = new NativeObject();
		try {
			List<FileItem> items = upload.parseRequest(request);
			ArrayList<NativeObject> result = new ArrayList<NativeObject>();
			
			for (FileItem fileItem : items) {
				NativeObject no = new NativeObject();
				if (fileItem.isFormField()) {
					no.put(NAME, no, fileItem.getFieldName());
					no.put("value", no, fileItem.getString());
				} else {
					try {
						if (fileItem.getSize()>0) {
							no.put(NAME, no, fileItem.getFieldName());
							no.put(FILENAME, no, fileItem.getName());
							no.put(INPUTSTREAM, no, fileItem.getInputStream());
							no.put(MIMETYPE, no, fileItem.getContentType());
							no.put(SIZE, no, fileItem.getSize());
							no.put(ISFILE, no, true);
						}
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
				result.add(no);
			}
			return result.toArray(new NativeObject[result.size()]);
		} catch (FileSizeLimitExceededException e) {
			throw new HttpStatusExceptionImpl(503);
		} catch (Exception e) {
			throw new HttpStatusExceptionImpl(503);
		}
	}
	
	public String getSessionId() {
		return request.getSession().getId();
	}
	
	public ScriptCookie[] getCookies() {
		if (cookies==null) {
			Cookie[] cs = request.getCookies();
			cookies = new ScriptCookie[cs.length];
			
			for (int i = 0; i < cs.length; i++) {
				cookies[i] = new ScriptCookie(cs[i]);
			}
		}
		return cookies;
	}
	
	public String getSessionAttr( String key) {
		return (String) request.getSession().getAttribute(key);
	}
	
	public void setSessionAttr(String key, String value) {
		request.getSession().setAttribute(key, value);
	}
	
	
	public Object getAttribute(String arg0) {
		return request.getAttribute(arg0);
	}

	public String getHeader(String arg0) {
		return request.getHeader(arg0);
	}

	public String getParameter(String arg0) {
		try {
			if (request.getMethod().equalsIgnoreCase(GET)) {
	 			String value = request.getParameter(arg0);
				if (value!=null) {
					return new String(value.getBytes(ISO_8859_1),UTF_8);
				}
			} else {
				return request.getParameter(arg0);
			}
		} catch (UnsupportedEncodingException e) {
		}
		return null;
	}
	
	public String[] getParameters(String args) {
		try {
			String[] value = request.getParameterValues(args);
			if (request.getMethod().equalsIgnoreCase(GET)) {
				String[] result = new String[value.length];
				for (int i = 0; i < value.length; i++) {
					result[i] = new String(value[i].getBytes(ISO_8859_1),UTF_8);
				}
				return result;
			}
			return value;
			
		} catch (UnsupportedEncodingException e) {
		}
		return null;
	}

	public Object getParameter(String arg0,Object defaultvalue) {
		return request.getParameter(arg0)==null?defaultvalue:request.getParameter(arg0);
	}
	
	
	public String getPathInfo() {
		return request.getPathInfo();
	}

	public String getQueryString() {
		return request.getQueryString();
	}

	public String getBaseUrl() {
		String[] splits = request.getRequestURI().split("/");
		
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < 4; i++) {
			sb.append(splits[i]).append("/");
		}
		
		return sb.toString();
	}



	/**
	 * 直接设置http返回状态码，用来处理出错情况 
	 * 代码执行到此则直接返回
	 * @param code 
	 */
	public void setCode(int code) {
		throw new HttpStatusExceptionImpl(code, null);
	}
	
	/**
	 * 直接设置http返回状态码，用来处理出错情况 
	 * 代码执行到此则直接返回
	 * @param code 
	 */
	public void code(int code) {
		throw new HttpStatusExceptionImpl(code, null);
	}
	
	public void msg(String msg) {
		if(sb.length()>10000) {
			return;
		} else {
			sb.append(msg);
		}
	}
	
	public String getMsg() {
		return sb.toString();
	}
	
	
	public String getRemoteAddr() {
		return request.getRemoteAddr();
	}
		
}
