package net.gqu.jscript.root;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.Scriptable;

public class ScriptObjectGenerator {

	public static Scriptable createRequestParams(HttpServletRequest request, String remains) {

		NativeObject object = new NativeObject();
		Enumeration names = request.getParameterNames();
		
		while (names.hasMoreElements()) {
			String name = (String) names.nextElement();
			object.put(name, object, request.getParameter(name));
		}
		
		return object;
	}
}
