package net.gqu.jscript.root;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import net.gqu.application.InstalledApplication;
import net.gqu.jscript.root.google.ScriptCalendar;
import net.gqu.security.AuthenticationUtil;
import net.gqu.security.BasicUserService;
import net.gqu.security.User;
import net.gqu.webscript.GQServlet.GQRequest;

import org.mozilla.javascript.NativeObject;

public class ScriptObjectGenerator {

	private BasicUserService userService;
	
	
	
	
	public BasicUserService getUserService() {
		return userService;
	}

	public void setUserService(BasicUserService userService) {
		this.userService = userService;
	}

	public NativeObject createRequestParams(HttpServletRequest request, String remains) {

		NativeObject object = new NativeObject();
		Enumeration names = request.getParameterNames();
		
		while (names.hasMoreElements()) {
			String name = (String) names.nextElement();
			object.put(name, object,  request.getParameter(name));
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
	
	public NativeObject createContextObject(GQRequest request,InstalledApplication installedApplication, String remains) {
		NativeObject object = new NativeObject();
		object.put("user", object, installedApplication.getUser());
		object.put("application", object, installedApplication.getUser());
		object.put("fileSize", object, installedApplication.getUser());
		object.put("totalSize", object, installedApplication.getUser());
		object.put("reqestPath", object, request.getRequest().getRequestURI());
		object.put("basePath", object, request.getBasePath());
		object.put("gsPath", object, remains);
		
		return object;
	}
}
