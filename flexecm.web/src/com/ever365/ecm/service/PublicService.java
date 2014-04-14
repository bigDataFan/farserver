package com.ever365.ecm.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ever365.ecm.content.ContentDAO;
import com.ever365.ecm.entity.Entity;
import com.ever365.ecm.entity.EntityDAO;
import com.ever365.ecm.repo.Model;
import com.ever365.rest.RestParam;
import com.ever365.rest.RestService;
import com.ever365.utils.MapUtils;

public class PublicService {
	
	private EntityDAO entityDAO;
	private ContentDAO contentDAO;
	public EntityDAO getEntityDAO() {
		return entityDAO;
	}
	private List<String> tags; 
	
	public List<String> getTags() {
		return tags;
	}
	public void setTags(List<String> tags) {
		this.tags = tags;
	}
	public void setEntityDAO(EntityDAO entityDAO) {
		this.entityDAO = entityDAO;
	}
	public ContentDAO getContentDAO() {
		return contentDAO;
	}
	public void setContentDAO(ContentDAO contentDAO) {
		this.contentDAO = contentDAO;
	}
	
	private Map<String, List<Object>> homeData;
	private Map<String, Map<String, Object>> cachedEntity = new HashMap<String, Map<String,Object>>();
	
	@RestService(uri="/index", method="GET", authenticated=false)
	public Map<String, List<Object>> homeData() {
		return homeData;
	}
	
	public List<Map<String, Object>> roll(@RestParam(value="skip")Integer skip,
			@RestParam(value="limit")Integer limit) {
		return null;
	}
	
	@RestService(uri="/tags", method="GET")
	public List<String> recTags() {
		return tags;
	}
	
	@RestService(uri="/init", method="GET", runAsAdmin=true)
	public void initHomeData() {
		homeData = new HashMap<String, List<Object>>();
		for (String tag : this.tags) {
			Map<String, Object> t = new HashMap<String, Object>();
			t.put(Model.FACETED.getLocalName(), tag);
			t.put(Model.PUBLISHED.getLocalName(), true);
			List<Entity> entityList = entityDAO.filter(t, null, null, 10);
			List<Object> rm = simplifyEntityList(entityList);
			homeData.put(tag, rm);
		}
		// recent list
		Map<String, Object> t = new HashMap<String, Object>();
		t.put(Model.PUBLISHED.getLocalName(), true);
		Map<String, Object> order = new HashMap<String, Object>(1);
		order.put(Model.PROP_MODIFIED.getLocalName(), -1);
		List<Entity> entityList = entityDAO.filter(t, order, null, 10);
		homeData.put("recent", simplifyEntityList(entityList));
	}
	
	public List<Object> simplifyEntityList(List<Entity> entityList) {
		List<Object> rm = new ArrayList<Object>();
		for (Entity entity : entityList) {
			Map<String, Object> extractedMap = new HashMap<String, Object>(); 
			extractedMap.put("name", entity.getName());
			extractedMap.put("size", entity.getSize());
			extractedMap.put("ext", entity.getPropertyStr(Model.PROP_FILE_EXT));
			extractedMap.put("tn", entity.getPropertyStr(Model.PROP_FILE_THUMBNAIL));
			extractedMap.put("icon", entity.getPropertyStr(Model.PROP_FILE_ICON));
			extractedMap.put("id", entity.getId());
			extractedMap.put("creator", entity.getCreator());
			extractedMap.put("seq", entity.getProperty(Model.PUBLISHED_SEQ));
			rm.add(extractedMap);
		}
		return rm;
	}
	
	
	public Map<String, Object> getCachedEntity(String id) {
		if (cachedEntity.get(id)!=null) return cachedEntity.get(id);
		
		Map<String, Object> filter = new HashMap<String, Object>(1);
		filter.put(Model.PUBLISHED_SEQ.getLocalName(), new Long(id));
		List<Entity> entities = entityDAO.filter(filter, null, null, 1);
		if (entities.size()==1) {
			Map<String, Object> m = (Map<String, Object>)simplifyEntityList(entities).get(0);
			cachedEntity.put(id, m);
			return m;
		} else {
			return null;
		}
	}
}
