package com.ever365.farsvr.sync;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ever365.farsvr.rest.RestParam;
import com.ever365.farsvr.rest.RestService;
import com.ever365.farsvr.security.AuthenticationUtil;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.EmbeddedEntity;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.PropertyContainer;
import com.google.appengine.api.datastore.Query;

public class BasicSyncService {
	
	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	
	
	@RestService(method="POST", uri="/keysave")
	public void saveKey(
			@RestParam(value="kind") String kind,
			@RestParam(value="key") String key,@RestParam(value="value") String value) {
		try {
			Entity entity;
			entity = datastore.get(KeyFactory.createKey(kind, key));
		} catch (EntityNotFoundException e) {
			e.printStackTrace();
		}
	}
	
	
	@RestService(method="GET", uri="/db/config")
	public Map<String, Object> getConfigaration(@RestParam(value="app") String app) {
		
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("user", AuthenticationUtil.getCurrentUserName());
		result.put("now", new Date().getTime());
		
		Query q = new Query("Config");
		
		q.addFilter("user", Query.FilterOperator.EQUAL, AuthenticationUtil.getCurrentUserName());
		q.addFilter("app", Query.FilterOperator.EQUAL, app);
		
		PreparedQuery pq = datastore.prepare(q);

		for (Entity e : pq.asIterable()) {
			result.put((String)e.getProperty("key"), e.getProperty("value"));
		}
		return result;
	}

	@RestService(method="POST", uri="/db/setconfig")
	public void setConfigaration(@RestParam(value="app") String app,
			@RestParam(value="name") String name,
			@RestParam(value="value") String value
			) {
		Entity e = new Entity("Config");
		e.setProperty("user", AuthenticationUtil.getCurrentUser());
		e.setProperty("app", app);
		e.setProperty("value", value);
		datastore.put(e);
	}

	@RestService(method="POST", uri="/db/sync")
	public Map<String, Object> sync(@RestParam(value="updated")Long updated, @RestParam(value="db") String coll, @RestParam(value="list") String list) {
		try {
			Map<String, Object> result = new HashMap<String, Object>();
			List<String> deleted = new ArrayList<String>();
			
			JSONArray source = new JSONArray(list);
			
			Map<String, String> added = new HashMap<String, String>(); 
			
			if (source.length()>0) {
				for (int i = 0; i < source.length(); i++) {
					JSONObject jso = source.getJSONObject(i);
					
					if (jso.has("_deleted")) {
						datastore.delete(KeyFactory.createKey(coll, AuthenticationUtil.getCurrentUserName() + "." + jso.getString("id")));
						deleted.add(jso.getString("id"));
					} else if (jso.has("id")) {
						//Map<String, Object> map = JSONUtils.jsonObjectToMap(jso);
						Entity newEntity = new Entity(coll, AuthenticationUtil.getCurrentUserName() + "." + jso.getString("id"));
						
						EmbeddedEntity ee = jsonObjectToEntity(jso);
						newEntity.setPropertiesFrom(ee);
						
						newEntity.setProperty("user", AuthenticationUtil.getCurrentUser());
						datastore.put(newEntity);
						if (jso.has("___id")) {
							added.put(jso.getString("___id"), jso.getString("id"));
						}
					}
				}
			}
			
			List<Map<String, Object>> newer = new ArrayList<Map<String,Object>>();
			if (updated==0) {
				//获取所有记录
				Query q = new Query(coll);
				q.addFilter("user", Query.FilterOperator.EQUAL, AuthenticationUtil.getCurrentUserName());
				PreparedQuery pq = datastore.prepare(q);
				
				for (Entity e : pq.asIterable()) {
					
					HashMap<String, Object> m = new HashMap<String, Object>();
					m.putAll(entityToMap(e));
					m.put("id", e.getKey().getName().substring(AuthenticationUtil.getCurrentUserName().length()+1));
					newer.add(m);
				}
			}
			/*
			 else {
				//获取所有记录
				Query q = new Query(coll);
				q.addFilter("user", Query.FilterOperator.EQUAL, AuthenticationUtil.getCurrentUserName());
				q.addFilter("updated", Query.FilterOperator.GREATER_THAN_OR_EQUAL, updated);
				PreparedQuery pq = datastore.prepare(q);
				for (Entity e : pq.asIterable()) {
					HashMap<String, Object> m = new HashMap<String, Object>();
					
					m.putAll(entityToMap(e));
					m.put("id", e.getKey().getName().substring(e.getKey().getName().indexOf("-")+1));
					newer.add(m);
				}
			}
			*/
			result.put("added", added);
			result.put("updated", newer);
			result.put("deleted", deleted);
			return result;
		} catch (JSONException e) {
			
			e.printStackTrace();
			return null;
		}
	}

	@RestService(method="POST", uri="/db/sync/getall")
	public List<Map<String, Object>> fullGet(@RestParam(value="db") String coll) {
		List<Map<String, Object>> newer = new ArrayList<Map<String,Object>>();
		
		//获取所有记录
		Query q = new Query(coll);
		q.addFilter("user", Query.FilterOperator.EQUAL, AuthenticationUtil.getCurrentUserName());
		PreparedQuery pq = datastore.prepare(q);
		
		for (Entity e : pq.asIterable()) {
			HashMap<String, Object> m = new HashMap<String, Object>();
			m.putAll(entityToMap(e));
			m.put("id", e.getKey().getName().substring(AuthenticationUtil.getCurrentUserName().length()+1));
			newer.add(m);
		}
		return newer;
	}
	
	@RestService(method="POST", uri="/db/sync/putall")
	public void fullPut(@RestParam(value="db") String coll, @RestParam(value="list") String list) {
		try {
			//删除所有记录
			Query q = new Query(coll);
			q.addFilter("user", Query.FilterOperator.EQUAL, AuthenticationUtil.getCurrentUserName());
			PreparedQuery pq = datastore.prepare(q);
			
			for (Entity e : pq.asIterable()) {
				datastore.delete(e.getKey());
			}
			
			JSONArray source = new JSONArray(list);
			for (int i = 0; i < source.length(); i++) {
				JSONObject jso = source.getJSONObject(i);
				
				String id = System.currentTimeMillis() + "" + i;
				if (jso.has("id")) {
					id = jso.getString("id");
				}
				Entity newEntity = new Entity(coll, AuthenticationUtil.getCurrentUserName() + "." + id);
				
				
				EmbeddedEntity ee = jsonObjectToEntity(jso);
				newEntity.setPropertiesFrom(ee);
				
				newEntity.setProperty("user", AuthenticationUtil.getCurrentUser());
				datastore.put(newEntity);
			}
		} catch (JSONException e) {
			System.out.println("wrong json format on putall: " + coll + " user:" + AuthenticationUtil.getCurrentUser() );
		}
	}
	
	@RestService(method="POST", uri="/import")
	public void importJSON(@RestParam(value="collection") String coll, @RestParam(value="list") String list) {
		JSONArray source;
		try {
			source = new JSONArray(list);
			List<Entity> entities = new ArrayList<Entity>();
			for (int i = 0; i < source.length(); i++) {
				JSONObject jso = source.getJSONObject(i);
				
				String id = System.currentTimeMillis() + "" + i;
				if (jso.has("id")) {
					id = jso.getString("id");
				}
				Entity newEntity = null;
				if (jso.has("creator")) {
					newEntity = new Entity(coll, jso.getString("creator") + "." + id);
					newEntity.setProperty("user", jso.getString("creator"));
				} else{
					newEntity = new Entity(coll, "admin." + id);
				}
				
				EmbeddedEntity ee = jsonObjectToEntity(jso);
				newEntity.setPropertiesFrom(ee);
				entities.add(newEntity);
			}
			datastore.put(entities);
		} catch (JSONException e) {
		}
	}
	
	public List<Object> jsonArrayToList(JSONArray jsonArray) {
		List<Object> ret = new ArrayList<Object>();
		Object value = null;
		int length = jsonArray.length();
		for (int i = 0; i < length; i++) {
			try {
				value = jsonArray.get(i);
			} catch (JSONException e) {
			}
			if (value instanceof JSONArray) {
				ret.add(jsonArrayToList((JSONArray) value));
			} else if (value instanceof JSONObject) {
				ret.add(jsonObjectToEntity((JSONObject) value));
			} else {
				ret.add(value);
			}
		}

		return (ret.size() != 0) ? ret : null;
	}
	
	public Map<String, Object> entityToMap(PropertyContainer pc) {
		Map<String, Object> result = new HashMap<String, Object>();
		Map<String, Object> pps = pc.getProperties();
		
		for (String key : pps.keySet()) {
			Object value = pps.get(key); 
			if (value instanceof List) {
				result.put(key, listConvert((List)value));
			} else if (value instanceof EmbeddedEntity) {
				result.put(key, entityToMap((EmbeddedEntity)value));
			} else {
				result.put(key, value);
			}
		}
		return result;
	}
	
	public List<Object> listConvert(List<Object> list) {
		List<Object> result = new ArrayList<Object>();
		for (Object v : list) {
			if (v instanceof List) {
				result.add(listConvert((List)v));
			} else if (v instanceof EmbeddedEntity) {
				result.add(entityToMap((EmbeddedEntity)v));
			} else {
				result.add(v);
			}
		}
		return result;
	}
	
	
	public EmbeddedEntity jsonObjectToEntity(JSONObject jso) {
		EmbeddedEntity ee = new EmbeddedEntity();
		for (Iterator<?> keys = jso.keys(); keys.hasNext();) {
			String key = (String) keys.next();
			if (key.equals("_id")) continue;
			Object v = null;
			try {
				v = jso.get(key);
				if (v==null || v.toString().equals("null")) {
					v = null;
				} else {
					if (v instanceof JSONArray) {
						ee.setProperty(key, jsonArrayToList((JSONArray) v));
					} else if (v instanceof JSONObject) {
						ee.setProperty(key, jsonObjectToEntity((JSONObject) v));
					} else {
						ee.setProperty(key, v);
					}
				}
			} catch (JSONException e) {
			}
		}
		return ee;
	}
	
	
	
}
