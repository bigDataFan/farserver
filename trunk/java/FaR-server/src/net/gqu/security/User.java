package net.gqu.security;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import org.bson.types.ObjectId;

/**
 */
public class User implements Serializable {

	private static final long serialVersionUID = 1L;

	private String id;

	private String name;
	private String password;
	private String email;
	private String role;
	
	private boolean disabled;

	private String db;
	
	public String getId() {
		return id;
	}
	
	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public User(Map<String, Object> one) {
		super();
		this.name = (String) one.get("name");
		this.password = (String) one.get("password");
		this.email = (String) one.get("email");
		this.db = (String) one.get("db");
		this.role = (String) one.get("role");
		this.id = ((ObjectId) one.get("_id")).toString();
	}
	
	public Map<String, Object> getMap() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("name", name);
		map.put("password", password);
		map.put("email", email);
		map.put("db", db);
		map.put("role", role);
		map.put("_id", id);
		return map;
	}
	
	public String getDb() {
		return db;
	}

	public void setDb(String db) {
		this.db = db;
	}

	public User() {
	}

	public void setId(String id) {
		this.id = id;
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

	
	
	
	
	
}