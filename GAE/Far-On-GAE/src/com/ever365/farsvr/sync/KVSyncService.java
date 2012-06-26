package com.ever365.farsvr.sync;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import com.ever365.farsvr.rest.RestParam;
import com.ever365.farsvr.rest.RestService;
import com.ever365.farsvr.security.AuthenticationUtil;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

public class KVSyncService {

	 private static final Logger log = Logger.getLogger(KVSyncService.class.getName());
	 
	private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	
	private MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	private ArrayList<String> updated = new ArrayList<String>();
	
	private String genKey(String kind, String key) {
		return kind + "^" + AuthenticationUtil.getCurrentUser() + "^" + key;
	}
	
	@RestService(method="POST", uri="/key/update")
	public void saveKey(
			@RestParam(value="kind") String kind,
			@RestParam(value="key") String key,@RestParam(value="value") String value) {
		updated.add(genKey(kind, key));
		syncCache.put(genKey(kind, key), value);
	}
	
	@RestService(method="GET", uri="/key/get")
	public Map<String, Object> getKey(
			@RestParam(value="kind") String kind,
			@RestParam(value="key") String key) {
		
		Map<String, Object>  result = new HashMap<String, Object>();
		String gkey = genKey(kind, key);

		result.put("user", AuthenticationUtil.getCurrentUser());
		result.put("city", AuthenticationUtil.city.get());
		result.put("time", System.currentTimeMillis());
		result.put("ticket", AuthenticationUtil.ticket.get());
		
		Object v = syncCache.get(gkey);
		if (v==null) {
			try {
				Entity entity = datastore.get(KeyFactory.createKey(kind, AuthenticationUtil.getCurrentUser() + "^" + key));
				if (entity!=null) {
					log.fine("read key:" + gkey);
					v = ((Text)entity.getProperty("value")).getValue();
					syncCache.put(gkey, v);
				} else {
					log.fine("read key not found:" + gkey);
					syncCache.put(gkey, "[]");
				}
			} catch (Exception e) {
				log.fine("read key not found with e:" + key);
				syncCache.put(gkey, "[]");
			}
		}
		if (v==null) {
			v = "[]";
		}
		
		result.put("value", v);
		return result;
	}
	
	@RestService(method="GET", uri="/writeall")
	public Integer persistance() {
		
		List<String> toRemoved = new ArrayList<String>();
		int i = 0;
		for (String key : updated) {
			toRemoved.add(key);
			i++;
			if (i==100) break;
		}
		
		for (String key : toRemoved) {
			if (syncCache.contains(key)) {
				String[] keys = key.split("\\^");
				Entity entity = new Entity(keys[0], keys[1] + "^" +keys[2]); 
				entity.setProperty("value", new Text((String) syncCache.get(key)));
				datastore.put(entity);
				log.fine("writen key:" + key);
			}
		}
		updated.removeAll(toRemoved);
		
		return updated.size();
	}
}
