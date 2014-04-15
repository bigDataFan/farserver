package com.ever365.ecm.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jws.WebParam.Mode;

import org.bson.types.ObjectId;

import com.ever365.ecm.authority.AuthenticationUtil;
import com.ever365.ecm.authority.PersonService;
import com.ever365.ecm.content.ContentDAO;
import com.ever365.ecm.entity.Entity;
import com.ever365.ecm.entity.EntityDAO;
import com.ever365.ecm.repo.Model;
import com.ever365.ecm.repo.Repository;
import com.ever365.ecm.repo.RepositoryDAO;
import com.ever365.rest.RestParam;
import com.ever365.rest.RestService;

public class PublicService {
	
	private EntityDAO entityDAO;
	private ContentDAO contentDAO;
	private RepositoryDAO repositoryDAO;
	
	public void setRepositoryDAO(RepositoryDAO repositoryDAO) {
		this.repositoryDAO = repositoryDAO;
	}
	public EntityDAO getEntityDAO() {
		return entityDAO;
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
	
	private Map<String, List<Map<String, Object>>> homeData;
	private Map<String, Map<String, Object>> cachedEntity = new HashMap<String, Map<String,Object>>();
	
	
	@RestService(uri="/list", method="GET", authenticated=false)
	public List<Map<String, Object>> getList(@RestParam(value="type")String type) {
		
		List<Map<String,Object>> data = homeData.get(type);
		if (data ==null) {
			Repository adminRepo = repositoryDAO.getRepository("usr://" + PersonService.ADMIN, false);
			Entity targetParent = entityDAO.getEntityByPath(adminRepo.getRootEntity(), type);
			if(targetParent==null) {
				return Collections.EMPTY_LIST;
			}
			
			Map<String, Object> t = new HashMap<String, Object>();
			t.put(Model.PROP_PARENT_ID.getLocalName(), new ObjectId(targetParent.getId()));
			
			Map<String, Object> order = new HashMap<String, Object>(1);
			order.put(Model.PROP_MODIFIED.getLocalName(), -1);
			List<Entity> filteredList = entityDAO.filter(t, order, 0, 10);
			
			data = simplifyEntityList(filteredList);
			
			homeData.put(type, data);
		}
		
		return data;
	}
	
	@RestService(uri="/clear", method="GET", runAsAdmin=true)
	public void clearData(@RestParam(value="type") String type) {
		if (type==null) {
			homeData.clear();
		} else {
			homeData.put(type, null);
		}
	}
	/*
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
	*/
	
	public List<Map<String, Object>> simplifyEntityList(List<Entity> entityList) {
		List<Map<String, Object>> rm = new ArrayList<Map<String, Object>>();
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
