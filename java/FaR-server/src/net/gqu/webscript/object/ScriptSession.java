package net.gqu.webscript.object;

import javax.servlet.http.HttpSession;

public class ScriptSession {
	private HttpSession httpSession;
	
	public Object get(String arg0) {
		return (Object) httpSession.getAttribute(arg0);
	}
	
	public void set(String arg0, Object arg1) {
		httpSession.setAttribute(arg0, arg1);
	}
	
	public void remove(String arg0) {
		httpSession.removeAttribute(arg0);
	}

	public ScriptSession(HttpSession httpSession) {
		super();
		this.httpSession = httpSession;
	}
	
	public long getLastAccessedTime() {
		return httpSession.getLastAccessedTime();
	}

	public int getMaxInactiveInterval() {
		return httpSession.getMaxInactiveInterval();
	}
	
	public long getCreationTime() {
		return httpSession.getCreationTime();
	}

	public String getId() {
		return httpSession.getId();
	}
}
