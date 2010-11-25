package net.gqu.main;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class Application {

	private String owner;
	private String name;
	private String description;
	private String alias;
	
	private String start;
	private int stage;
	private int type;
	
	public static Integer STAGE_UNDER_DEV = 0;
	public static Integer STAGE_RELEASED = 1; 
	public static Integer STAGE_COMMERTIAL = 2;
	
	public static Integer TYPE_STATIC_WEBAPP = 0; //static site
	public static Integer GQU_WEBAPP = 1; //g qu web app for multi user
	public static Integer GQU_WEBAPP_ALONE = 2; //g qu web app but can't be installed;
	
	private String details;
	private int installed;
	private String[] categories;
	private Date created;
	
	private boolean suspend;
	private String repository;
	
	public Application(Map map) {
		//this.id = ((ObjectId) map.get("_id")).toString();
		this.name = (String) map.get("name");
		this.owner = (String) map.get("owner");
		this.description = (String) map.get("description");
		this.alias = (String) map.get("alias");
		this.stage = (Integer) map.get("stage");
		this.type = (Integer) map.get("type");
		this.details = (String) map.get("details");
		
		this.installed = (Integer) map.get("installed");
		this.categories = (String[]) map.get("categories");
		this.created = (Date) map.get("created");
		
		this.suspend = (Boolean) (map.get("suspend")==null)?false:(Boolean)map.get("suspend");
		this.repository = (String) map.get("repository");
	}
	
	
	
	public int getStage() {
		return stage;
	}



	public void setStage(int stage) {
		this.stage = stage;
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



	public Application() {
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

	public int getInstalled() {
		return installed;
	}

	public void setInstalled(int installed) {
		this.installed = installed;
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

	public boolean isSuspend() {
		return suspend;
	}

	public void setSuspend(boolean suspend) {
		this.suspend = suspend;
	}
	
	public String getStart() {
		return start;
	}

	public void setStart(String start) {
		this.start = start;
	}
	
	

	public Map<String, Object> getMaps() {
		Map<String, Object> maps = new HashMap<String, Object>();
		maps.put("owner", owner);
		maps.put("alias", getAlias());
		maps.put("name", name);
		maps.put("stage", stage);
		maps.put("type", type);
		maps.put("description", description);
		maps.put("installed",installed);
		maps.put("category",categories);
		maps.put("created",created.getTime());
		maps.put("start", start);
		maps.put("details", details);
		maps.put("repository", repository);
		return maps;
	}
	

}
