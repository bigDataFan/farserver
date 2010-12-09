package net.gqu.application;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;


/**
 * A registered application which is loaded remotely
 * @author liuhan
 */

public class RegisteredApplication {

	private String owner;
	private String name;
	private String description;
	private String alias;
	
	private String start;
	private int type;
	
	public static Integer STAGE_UNDER_DEV = 0;
	public static Integer STAGE_RELEASED = 1; 
	public static Integer STAGE_COMMERTIAL = 2;
	
	private String details;
	private String[] categories;
	private Date created;
	
	private String repository;
	private String version;
	
	public RegisteredApplication(Map map) {
		this.name = (String) map.get("name");
		this.owner = (String) map.get("owner");
		this.description = map.get("description")==null ? null : (String)map.get("description");
		this.alias = map.get("alias")==null? null : (String) map.get("alias");
		this.type = map.get("type")==null? 0: (Integer) map.get("type");
		this.details = map.get("details")==null? null: (String) map.get("details");
		this.start = map.get("start")==null? null: (String) map.get("start");
		this.categories = map.get("categories")==null? (new String[0]) : (String[]) map.get("categories");
		this.repository = (String) map.get("repository");
		this.version = (map.get("version")==null)?"1.0":(String) map.get("version");
	}

	public int getType() {
		return type;
	}



	public void setType(int type) {
		this.type = type;
	}

	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	public RegisteredApplication() {
	}
	
	public String getRepository() {
		return repository;
	}



	public void setRepository(String repository) {
		this.repository = repository;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getVersion() {
		return version;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAlias() {
		return alias==null? name: alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String[] getCategories() {
		return categories;
	}

	public void setCategories(String[] categories) {
		this.categories = categories;
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public String getStart() {
		return start;
	}

	public void setStart(String start) {
		this.start = start;
	}

	/*
	public Map<String, Object> getMaps() {
		Map<String, Object> maps = new HashMap<String, Object>();
		maps.put("owner", owner);
		maps.put("alias", getAlias());
		maps.put("name", name);
		maps.put("type", type);
		maps.put("description", description);
		maps.put("category",categories);
		maps.put("created",created);
		maps.put("start", start);
		maps.put("details", details);
		maps.put("repository", repository);
		return maps;
	}
	*/

}
