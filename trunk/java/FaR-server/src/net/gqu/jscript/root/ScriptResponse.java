package net.gqu.jscript.root;

import java.io.IOException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import net.gqu.exception.HttpStatusExceptionImpl;


public class ScriptResponse {
	private HttpServletResponse response;
	
	public ScriptResponse(HttpServletResponse response) {
		super();
		this.response = response;
	}

	public ScriptCookie createCookie(String key, String value) {
		Cookie cookie = new Cookie(key, value);
		
		return new ScriptCookie(cookie);
	}
	
	public void addCookie(ScriptCookie cookie) {
		response.addCookie(cookie.getCookie());
	}

	public void addHeader(String arg0, String arg1) {
		response.addHeader(arg0, arg1);
	}

	public void sendError(int arg0) throws IOException {
		throw new HttpStatusExceptionImpl(arg0);
	}

	public void sendRedirect(String arg0) throws IOException {
		response.sendRedirect(arg0);
	}
	
	
	
	
	
}
