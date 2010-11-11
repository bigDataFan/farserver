package net.gqu.jscript.root;

import javax.servlet.http.HttpSession;

public class ScriptSession {
	private HttpSession httpSession;
	
	public Object get(String arg0) {
		return httpSession.getAttribute(arg0);
	}
	
	public ScriptSession(HttpSession httpSession) {
		super();
		this.httpSession = httpSession;
	}

	public Object getAttribute(String arg0) {
		return httpSession.getAttribute(arg0);
	}

	public long getLastAccessedTime() {
		return httpSession.getLastAccessedTime();
	}

	public int getMaxInactiveInterval() {
		return httpSession.getMaxInactiveInterval();
	}

	public void removeAttribute(String arg0) {
		httpSession.removeAttribute(arg0);
	}

	public void setAttribute(String arg0, Object arg1) {
		httpSession.setAttribute(arg0, arg1);
	}
	public long getCreationTime() {
		return httpSession.getCreationTime();
	}

	public String getId() {
		return httpSession.getId();
	}

	public void set(String arg0, Object arg1) {
		httpSession.setAttribute(arg0, arg1);
	}

}
