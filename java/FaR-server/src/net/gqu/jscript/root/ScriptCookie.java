package net.gqu.jscript.root;

import javax.servlet.http.Cookie;

public class ScriptCookie {
	private Cookie cookie;
	
	public ScriptCookie(Cookie cookie) {
		super();
		this.cookie = cookie;
	}

	public String getComment() {
		return cookie.getComment();
	}

	public String getDomain() {
		return cookie.getDomain();
	}

	public int getMaxAge() {
		return cookie.getMaxAge();
	}

	public String getName() {
		return cookie.getName();
	}

	public String getPath() {
		return cookie.getPath();
	}

	public String getValue() {
		return cookie.getValue();
	}

	public int getVersion() {
		return cookie.getVersion();
	}

	public void setComment(String purpose) {
		cookie.setComment(purpose);
	}

	public void setDomain(String pattern) {
		cookie.setDomain(pattern);
	}
	
	public void setMaxAge(int expiry) {
		cookie.setMaxAge(expiry);
	}
	public void setPath(String uri) {
		cookie.setPath(uri);
	}
	public void setSecure(boolean flag) {
		cookie.setSecure(flag);
	}
	public void setValue(String newValue) {
		cookie.setValue(newValue);
	}
	public void setVersion(int v) {
		cookie.setVersion(v);
	}

	public Cookie getCookie() {
		return cookie;
	}
	
}
