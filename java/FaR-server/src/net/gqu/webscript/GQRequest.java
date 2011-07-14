package net.gqu.webscript;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.gqu.application.ApplicationService;

public class GQRequest {

	private HttpServletRequest request;
	private Map<String, Object> approvedApplication;
	private String[] pathList;
	private String jspath;
	private String ftlpath;
	
	public static ThreadLocal<GQRequest> current = new ThreadLocal<GQRequest>();
	
	public static GQRequest parse(HttpServletRequest request, ApplicationService applicationService) {
		GQRequest gqRequest =  new GQRequest(request, applicationService);
		current.set(gqRequest);
		return gqRequest;
	}
	
	private GQRequest(HttpServletRequest request, ApplicationService applicationService) {
		super();
		this.request = request;
		pathList = getPathList(request);
		if (pathList.length<1) {
			throw new HttpStatusExceptionImpl(400);
		}
		approvedApplication = applicationService.getApplication(pathList[0]);
		if (approvedApplication==null) {
			throw new HttpStatusExceptionImpl(404, null);
		}
		
		StringBuffer sb = new StringBuffer();
		for (int i = 1; i < pathList.length-1; i++) {
			sb.append("/" + pathList[i]);
		}
		String fileName = pathList[pathList.length-1];
		
		jspath  = sb.toString() + "/" + request.getMethod().toLowerCase() + "." + fileName.substring(0,fileName.length()-3) + ".js";
		ftlpath = sb.toString() + "/" + request.getMethod().toLowerCase() + "." + fileName.substring(0,fileName.length()-3) + ".ftl";
	}
	
	public Map<String, Object> getApprovedApplication() {
		return approvedApplication;
	}

	public String getJsPath() {
		return jspath;
	}
	public String getFtlPath() {
		return ftlpath;
	}
	
	public HttpServletRequest getRequest() {
		return request;
	}



	private String[] getPathList(HttpServletRequest request) {
		String pathInfo = request.getRequestURI();
		if (pathInfo.charAt(0)=='/') {
			pathInfo = pathInfo.substring(1);
		}
		String[] pathLists = pathInfo.split("/");
		return pathLists;
	}
    	
    }