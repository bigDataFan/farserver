package com.wikipy.rentation;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.mozilla.javascript.NativeObject;

public class ScriptObjectGenerator {

	private static final String MULTIPARAM_ENDFIX = "[]";


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
	
}
