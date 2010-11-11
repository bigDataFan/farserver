package net.gqu.cache;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.constructs.blocking.BlockingCache;


public class EhCacheService {

	private CacheManager manager = CacheManager.create();

	public Cache getUserCache() {
		Cache cache = manager.getCache("user");
		if (cache==null) {
			cache = new Cache("user", 10000, false, true, 0, 0); //one day
			manager.addCache(cache);
		}
		return cache;
	}
	
	public Cache getCookieCache() {
		Cache cache = manager.getCache("cookie");
		if (cache==null) {
			cache = new Cache("cookie", 10000, false, false, 0, 24*60*60); //one day
			manager.addCache(cache);
		}
		return cache;
	}
	
	public Cache getScriptCache() {
		Cache cache = manager.getCache("wscript");
		if (cache==null) {
			cache = new Cache("wscript", 10000, false, true, 0, 0); 
			manager.addCache(cache);
		}
		return cache;
	}
	
	
	public Cache getApplicationCache(String id) {
		Cache cache = manager.getCache("application." + id);
		if (cache==null) {
			cache = new Cache("application." + id, 1000, true, true, 0, 0); //overflow to disk and never expire
			manager.addCache(cache);
		}
		return cache;
	}
	public void cleanApplicationCache(String id) {
		Cache cache = manager.getCache("application." + id);
		if (cache!=null) {
			cache.removeAll();
		}
	}
	
	/*
	public Cache getWebCache() {
		Cache cache = manager.getCache("webcache");
		if (cache==null) {
			cache = new Cache("webcache", 100000, false, false, 10*60, 0); //10 minutes
			manager.addCache(cache);
		}
		return cache;
	}
	*/
	
	public Cache getUserMappingCache() {
		Cache cache = manager.getCache("usermapping");
		if (cache==null) {
			cache = new Cache("usermapping", 50000, false, true, 0, 0); //one day
			manager.addCache(cache);
		}
		return cache;
	}

	public BlockingCache getWebCache() {
		BlockingCache webcache = (BlockingCache) manager.getEhcache("webcache");
		if (webcache==null) {
			Cache cache = new Cache("webcache", 10000, false, false, 30*60, 30*60); //one day
			webcache = new BlockingCache(cache);
			manager.addCache(webcache);
		}
		return webcache;
	}


	public Cache getCounterCache() {
		//storing webscript cache and content cache
		Cache cache = manager.getCache("counter");
		
		if (cache==null) {
			cache = new Cache("counter", 100000, false, true, 0, 0); //for ever
			manager.addCache(cache);
		}
		return cache;
	}


	public Cache getSpaceCache() {
		//storing webscript cache and content cache
		Cache cache = manager.getCache("space");
		
		if (cache==null) {
			cache = new Cache("space", 100000, false, true, 0, 0); //for ever
			manager.addCache(cache);
		}
		return cache;
	}
	
	
	public Cache getImageCache() {
		Cache cache = manager.getCache("imageThumbnail");
		
		if (cache==null) {
			cache = new Cache("imageThumbnail", 10000, false, false, 30*60, 30*60); //for ever
			manager.addCache(cache);
		}
		return cache;
	}
	
}
