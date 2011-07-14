package com.ever365.security;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import net.gqu.application.ApplicationService;

/**
 */
public class User implements Serializable {

	private static final String KEY_FIRST_APP = "firstApp";
	private static final String KEY_MOBILE_APP = "mobileApp";
	
	public static final String KEY_LOGINED = "logined";
	public static final String KEY_DISABLED = "disabled";
	public static final String KEY_ROLE = "role";
	public static final String KEY_DB = "db";
	public static final String KEY_EMAIL = "email";
	public static final String KEY_PASSWORD = "password";
	public static final String KEY_NAME = "name";
	public static final String KEY_ATTRS = "attrs";
	public static final long serialVersionUID = 1L;
	public static final String KEY_CONTENT_USED = "contentused";

	public static final String ATTR_GOOGLE_USER = "googleuser";
	public static final String ATTR_GOOGLE_PWD = "googlepassword";
	public static final String ATTR_GOOGLE_CAL_TOKEN = "googlecaltoken";
	
	private String name;
	private String password;
	private String email;
	private String role;
	private long contentUsed;
	private Map<String, String> attrs;
	
	private boolean disabled;
	private long logined;
	private String db;
	private String firstApp;
	private String mobileApp;

	
	
	public String getMobileApp() {
		return mobileApp;
	}

	public void setMobileApp(String mobileApp) {
		this.mobileApp = mobileApp;
	}

	public String getFirstApp() {
		return firstApp;
	}

	public void setFirstApp(String firstApp) {
		this.firstApp = firstApp;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public User(Map<String, Object> one) {
		super();
		this.name = (String) one.get(KEY_NAME);
		this.password = (String) one.get(KEY_PASSWORD);
		this.email = (String) one.get(KEY_EMAIL);
		this.db = (String) one.get(KEY_DB);
		this.role = (String) one.get(KEY_ROLE);
		this.disabled = (Boolean)one.get(KEY_DISABLED);
		this.logined = (Long)one.get(KEY_LOGINED);
		this.contentUsed = (Long)one.get(KEY_CONTENT_USED);
		this.firstApp = (one.get(KEY_FIRST_APP)==null)?null:(String)one.get(KEY_FIRST_APP);
		this.mobileApp = (one.get(KEY_MOBILE_APP)==null)?null:(String)one.get(KEY_MOBILE_APP);
		if (one.get(KEY_ATTRS)!=null) {
			this.attrs = (Map)one.get(KEY_ATTRS);
		}
	}
	
	public Map<String, String> getAttrs() {
		if (attrs==null) {
			attrs = new HashMap<String, String>();
		}
		return attrs;
	}
	public void setAttrs(Map<String, String> attrs) {
		this.attrs = attrs;
	}
	
	public Map<String, Object> getMap() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put(KEY_NAME, name);
		map.put(KEY_PASSWORD, password);
		map.put(KEY_EMAIL, email);
		map.put(KEY_DB, db);
		map.put(KEY_ROLE, role);
		map.put(KEY_DISABLED, disabled);
		map.put(KEY_LOGINED, logined);
		map.put(KEY_CONTENT_USED, contentUsed);
		map.put(KEY_ATTRS, attrs);
		map.put(KEY_FIRST_APP, firstApp);
		map.put(KEY_MOBILE_APP, mobileApp);
		return map;
	}
	
	public long getLogined() {
		return logined;
	}

	public void setLogined(long logined) {
		this.logined = logined;
	}

	public String getDb() {
		return db;
	}

	public void setDb(String db) {
		this.db = db;
	}

	public User() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public boolean isDisabled() {
		return disabled;
	}

	public void setDisabled(boolean disabled) {
		this.disabled = disabled;
	}

	public long getContentUsed() {
		return contentUsed;
	}

	public void setContentUsed(long contentUsed) {
		this.contentUsed = contentUsed;
	}
	
	public String getAttr(String key) {
		if (this.attrs == null) {
			return "";
		}
		return (this.attrs.get(key)==null)?"":this.attrs.get(key);
	}
}