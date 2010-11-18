package net.gqu.security;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 */
public class User implements Serializable {

	private static final String KEY_LOGINED = "logined";

	private static final String KEY_DISABLED = "disabled";

	private static final String KEY_ROLE = "role";

	private static final String KEY_DB = "db";

	public static final String KEY_EMAIL = "email";

	private static final String KEY_PASSWORD = "password";

	public static final String KEY_NAME = "name";

	private static final long serialVersionUID = 1L;

	public static final String KEY_CONTENT_USED = "contentused";

	private String name;
	private String password;
	private String email;
	private String role;
	private long contentUsed;
	
	private boolean disabled;
	private long logined;
	private String db;
	

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
	
	
}