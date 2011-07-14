package net.gqu.webscript.object;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import net.gqu.application.ApplicationService;
import net.gqu.webscript.object.google.ScriptCalendar;

import org.mozilla.javascript.NativeObject;

import com.ever365.security.BasicUserService;
import com.ever365.security.User;

public class ScriptObjectGenerator {

	private static final String MULTIPARAM_ENDFIX = "[]";
	private BasicUserService userService;
	private ApplicationService applicationService;
	
	public BasicUserService getUserService() {
		return userService;
	}
	

	public void setApplicationService(ApplicationService applicationService) {
		this.applicationService = applicationService;
	}


	public void setUserService(BasicUserService userService) {
		this.userService = userService;
	}

	public NativeObject createRequestParams(HttpServletRequest request) {

		NativeObject object = new NativeObject();
		Enumeration names = request.getParameterNames();
		
		while (names.hasMoreElements()) {
			String name = (String) names.nextElement();
			if (name.endsWith(MULTIPARAM_ENDFIX)) {
				object.put(name.substring(0,name.length()-MULTIPARAM_ENDFIX.length()), object,  request.getParameterValues(name));
			} else {
				object.put(name, object,  request.getParameter(name));
			}
		}
		return object;
	}
	
	
	
	public NativeObject createGoogleServiceObject(String username) {
		NativeObject object = new NativeObject();
		User user = userService.getUser(username);
		
		object.put("online", object, false);
		if (!user.getAttr(User.ATTR_GOOGLE_USER).equals("") && !user.getAttr(User.ATTR_GOOGLE_PWD).equals("")) {
			object.put("online", object, true);
			object.put("calendar", object, new ScriptCalendar(user.getAttr(User.ATTR_GOOGLE_USER),user.getAttr(User.ATTR_GOOGLE_PWD)));
		} else if (!user.getAttr(User.ATTR_GOOGLE_CAL_TOKEN).equals("")) {
			object.put("calendar", object, new ScriptCalendar(user.getAttr(User.ATTR_GOOGLE_CAL_TOKEN)));
		} 
		
		return object;
	}
	
	/*
	public NativeObject createContextObject(GQRequest request,InstalledApplication installedApplication, String remains) {
		NativeObject object = new NativeObject();
		object.put("application", object, applicationService.getApplication(installedApplication.getApp()));
		object.put("reqestPath", object, request.getRequest().getRequestURI());
		object.put("basePath", object, request.getBasePath());
		object.put("gsPath", object, remains);
		
		return object;
	}
	*/
}
