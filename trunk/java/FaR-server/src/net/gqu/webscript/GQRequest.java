package net.gqu.webscript;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.gqu.application.ApplicationService;
import net.gqu.security.Role;
import net.gqu.security.User;
import net.gqu.utils.StringUtils;

public class GQRequest {

	private HttpServletRequest request;
	private Map<String, Object> approvedApplication;
	private String[] pathList;
	private String jspath;
	private String ftlpath;
	private String remainPath;
	private String[] pathArray;
	private User contextUser;
	private Role role;
	
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
		
		
		Map<String, Object> map = applicationService.getInstalledByMapping(pathList[0], pathList[1]);
		if (map==null) {
			if (applicationService.getApplication(pathList[1])==null) {
				throw new HttpStatusExceptionImpl(404, null);
			} else {
				map = applicationService.install(pathList[0], pathList[1], pathList[1]);
			}
		} 
		
		if (approvedApplication==null) {
			throw new HttpStatusExceptionImpl(404, null);
		}
		
		
		int pos = -1;
		
		if (pathList.length==1 || (pathList.length==2&&pathList[1].equals(""))) {
			throw new HttpStatusExceptionImpl(307, (String)approvedApplication.get(ApplicationService.APP_CONFIG_START));
		} else {
			pathArray = StringUtils.subArray(pathList, 1);
		}
		
		
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < pathArray.length; i++) {
			if(pathArray[i].endsWith(WebScript.FILE_END_FIX)) {
				pos = i;
				break;
			}
			sb.append("/" + pathArray[i]);
		}
		
		jspath  = sb.toString() + "/" + request.getMethod().toLowerCase() + "." + pathArray[pos].substring(0,pathArray[pos].length()-3) + ".js";
		ftlpath = sb.toString() + "/" + request.getMethod().toLowerCase() + "." + pathArray[pos].substring(0,pathArray[pos].length()-3) + ".ftl";
		remainPath = StringUtils.cancatStringArray(pathArray, pos+1, '/');
	}
    	
	public String getFilePath() {
		String staticFilePath = StringUtils.cancatStringArray(pathArray, 0, '/');
		return staticFilePath;
	}
	
	public String[] getPathArray() {
		return pathArray;
	}

	public Map<String, Object> getApprovedApplication() {
		return approvedApplication;
	}

	public String getTailPath() {
		return remainPath;
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

	public User getContextUser() {
		return contextUser;
	}

	public Role getRole() {
		return role;
	}

	private String[] getPathList(HttpServletRequest request) {
		String pathInfo = request.getPathInfo();
		if (pathInfo.charAt(0)=='/') {
			pathInfo = pathInfo.substring(1);
		}
		String[] pathLists = pathInfo.split("/");
		return pathLists;
	}
    	
    }