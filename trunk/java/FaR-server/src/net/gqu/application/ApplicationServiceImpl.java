package net.gqu.application;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.gqu.mongodb.MongoDBProvider;
import net.gqu.repository.HttpLoader;
import net.gqu.security.BasicUserService;
import net.gqu.utils.JSONUtils;
import net.gqu.utils.StringUtils;

import org.apache.http.HttpResponse;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class ApplicationServiceImpl implements ApplicationService {

	private String mainServer = null; ;
	private MongoDBProvider dbProvider;
	private BasicUserService userService;
	private String registryLocation;
	private boolean develop;
	private String defaultApp;
	private String appDir;
	
	
	public void init() {
		if (develop && appDir!=null) {
			File dir = new File(appDir);
			if (dir.exists()) {
				File[] childs = dir.listFiles();
				for (int i = 0; i < childs.length; i++) {
					File configFile = new File(appDir + "/" + childs[i].getName() + "/far-app.json");
					if (configFile.exists()) {
						try {
							String text = StringUtils.getText(new FileInputStream(configFile));
							JSONObject json = new JSONObject(text);
							RegisteredApplication application = new RegisteredApplication(JSONUtils.jsonObjectToMap(json));
							application.setRepository(childs[i].getPath());
							applicationMap.put(application.getName(), application);
						} catch (Exception e) {
						}
					}
				}
			}
		}
	}
	
	
	public void setAppDir(String appDir) {
		this.appDir = appDir;
	}
	
	public String getDefaultApp() {
		return defaultApp;
	}


	public void setDefaultApp(String defaultApp) {
		this.defaultApp = defaultApp;
	}


	public String getRegistryLocation() {
		return registryLocation;
	}


	public boolean isDevelop() {
		return develop;
	}


	public String getAppDir() {
		return appDir;
	}


	public void setRegistryLocation(String registryLocation) {
		this.registryLocation = registryLocation;
	}

	private Map<String, RegisteredApplication> applicationMap = new HashMap<String, RegisteredApplication>();
	
	public String getMainServer() {
		return mainServer;
	}
	public void setDevelop(boolean develop) {
		this.develop = develop;
	}
	public void setMainServer(String mainServer) {
		this.mainServer = mainServer;
	}
	
	public void setUserService(BasicUserService userService) {
		this.userService = userService;
	}

	public MongoDBProvider getDbProvider() {
		return dbProvider;
	}

	public void setDbProvider(MongoDBProvider dbProvider) {
		this.dbProvider = dbProvider;
	}
	
	@Override
	public RegisteredApplication getApplication(String id) {
		if (applicationMap.containsKey(id)) {
			return applicationMap.get(id);
		}
		
		//remote load
		if (applicationMap.get(id)==null && !develop) {
			HttpResponse response = HttpLoader.load(registryLocation + id + ".json");
			if (response!=null && response.getStatusLine().getStatusCode()==200) {
				try {
					JSONObject json = new JSONObject(StringUtils.getText(response.getEntity().getContent()));
					RegisteredApplication application = new RegisteredApplication(JSONUtils.jsonObjectToMap(json));
					applicationMap.put(id, application);
				} catch (JSONException e) {
					applicationMap.put(id, null);
				} catch (IOException e) {
					e.printStackTrace();
					applicationMap.put(id, null);
				}
			}
		}
		return applicationMap.get(id);
		
		
	}

	@Override
	public Map<String, Object> getInstalledByMapping(String user, String mapping) {
		DBCollection coll = dbProvider.getMainDB().getCollection(ApplicationService.COLL_INSTALLED);
		BasicDBObject basicDBObject = new BasicDBObject();
		basicDBObject.put(KEY_USER, user);
		basicDBObject.put(KEY_MAPPING, mapping);
		
		DBObject o = coll.findOne(basicDBObject);
		if (o==null) {
			return null;
		}
		return o.toMap();
	}

	@Override
	public Map<String, Map<String, Object>> getUserInstalledApplications(
			String user) {
		DBCollection coll = dbProvider.getMainDB().getCollection(ApplicationService.COLL_INSTALLED);
		
		DBCursor cursor = coll.find(new BasicDBObject(KEY_USER, user));
		Map<String, Map<String, Object>> result = new HashMap<String, Map<String, Object>>();
		
		while (cursor.hasNext()) {
			DBObject obj = cursor.next();
			result.put((String) obj.get(KEY_MAPPING), obj.toMap());
		}
		return result;
	}
	
	private InstalledApplication getInstalledFromDBObject(DBObject dbo) {
		InstalledApplication installedApplication = new InstalledApplication();
		installedApplication.setApp((String) dbo.get(KEY_APPLICATION));
		installedApplication.setMapping((String) dbo.get(KEY_MAPPING));
		installedApplication.setUser((String) dbo.get(KEY_USER));
		installedApplication.setId(((ObjectId) dbo.get(MongoDBProvider._ID)).toString());
		return installedApplication;
	}

	@Override
	public Map<String, Object> install(String user, String appName, String mapping) {
		
		RegisteredApplication registedApp = getApplication(appName);
		if (registedApp==null) {
			return null;
		}
		
		DBCollection coll = dbProvider.getMainDB().getCollection(ApplicationService.COLL_INSTALLED);

		BasicDBObject basicDBObject = new BasicDBObject();
		basicDBObject.put(KEY_USER, user);
		basicDBObject.put(KEY_APPLICATION, appName);
		basicDBObject.put(KEY_MAPPING, mapping==null?appName :mapping);
		coll.update(basicDBObject, basicDBObject, true, false);
		
		return basicDBObject.toMap();
		/*
		InstalledApplication installedApplication = new InstalledApplication();
		installedApplication.setApp(appName);
		installedApplication.setUser(user);
		installedApplication.setMapping(basicDBObject.getString(MAPPING));
		installedApplication.setId(basicDBObject.getString(MongoDBProvider._ID));
		*/
	}

	@Override
	public boolean uninstall(String user, String appName) {
		DBCollection coll = dbProvider.getMainDB().getCollection(ApplicationService.COLL_INSTALLED);
		Map<String, Object> query = new HashMap<String, Object>();
		query.put(KEY_USER, user);
		query.put(KEY_APPLICATION, appName);
		coll.remove(new BasicDBObject(query));
		return true;
	}

	@Override
	public List<RegisteredApplication> getAllInCurrentServer() {
		ArrayList<RegisteredApplication> list = new ArrayList<RegisteredApplication>(applicationMap.values());
		return list;
	}

	@Override
	public long getInstallCount(String name) {
		DBCollection coll = dbProvider.getMainDB().getCollection(ApplicationService.COLL_INSTALLED);
		DBCursor cursor = coll.find(new BasicDBObject(KEY_APPLICATION, name));
		return cursor.count();
	}
}
