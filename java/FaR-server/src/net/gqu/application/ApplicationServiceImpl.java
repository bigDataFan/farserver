package net.gqu.application;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
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
	
	public static final String INSTALLED_COLL_NAME = "installed";
	private String mainServer = null; ;
	private MongoDBProvider dbProvider;
	private BasicUserService userService;
	private String registryLocation;
	private boolean develop;
	
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
		
		if (develop) {
			RegisteredApplication ra = new RegisteredApplication();
			ra.setName(id);
			ra.setOwner("system");
			ra.setAlias("");
			ra.setCategories(new String[]{});
			ra.setCreated(new Date());
			return ra;
		} else {
			if (applicationMap.containsKey(id)) {
				return applicationMap.get(id);
			}
			if (applicationMap.get(id)==null) {
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
		
	}
	
	
	

	@Override
	public InstalledApplication getInstalledByMapping(String user, String mapping) {
		DBCollection coll = dbProvider.getMainDB().getCollection(INSTALLED_COLL_NAME);
		BasicDBObject basicDBObject = new BasicDBObject();
		basicDBObject.put(USER, user);
		basicDBObject.put(MAPPING, mapping);
		
		DBObject o = coll.findOne(basicDBObject);
		
		if (o==null) {
			return null;
		}
		return getInstalledFromDBObject(o);
	}

	@Override
	public Map<String, InstalledApplication> getUserInstalledApplications(
			String user) {
		DBCollection coll = dbProvider.getMainDB().getCollection(INSTALLED_COLL_NAME);
		BasicDBObject basicDBObject = new BasicDBObject();
		basicDBObject.put(USER, user);
		
		DBCursor cursor = coll.find(basicDBObject);
		Map<String, InstalledApplication> result = new HashMap<String, InstalledApplication>();
		
		while (cursor.hasNext()) {
			DBObject obj = cursor.next();
			result.put((String) obj.get(MAPPING), getInstalledFromDBObject(obj));
		}
		return result;
	}
	
	private InstalledApplication getInstalledFromDBObject(DBObject dbo) {
		InstalledApplication installedApplication = new InstalledApplication();
		installedApplication.setApp((String) dbo.get(APPLICATION));
		installedApplication.setMapping((String) dbo.get(MAPPING));
		installedApplication.setUser((String) dbo.get(USER));
		installedApplication.setId(((ObjectId) dbo.get(_ID)).toString());
		return installedApplication;
	}

	@Override
	public InstalledApplication install(String user, RegisteredApplication app, String mapping) {
		DBCollection coll = dbProvider.getMainDB().getCollection(INSTALLED_COLL_NAME);

		BasicDBObject basicDBObject = new BasicDBObject();
		basicDBObject.put(USER, user);
		basicDBObject.put(APPLICATION, app.getName());
		basicDBObject.put(MAPPING, mapping==null?app.getName():mapping);
		coll.update(basicDBObject, basicDBObject, true, false);
		
		InstalledApplication installedApplication = new InstalledApplication();
		installedApplication.setApp(app.getName());
		installedApplication.setUser(user);
		installedApplication.setMapping(basicDBObject.getString(MAPPING));
		installedApplication.setId(basicDBObject.getString(_ID));
		return installedApplication;
	}

	@Override
	public boolean uninstalled(InstalledApplication installedApplication) {
		return false;
	}

	@Override
	public List<RegisteredApplication> getAllInCurrentServer() {
		DBCollection coll = dbProvider.getMainDB().getCollection(INSTALLED_COLL_NAME);
		List<String> apps = coll.distinct(APPLICATION);
		
		List<RegisteredApplication> result = new ArrayList<RegisteredApplication>();
		
		for (String appName : apps) {
			result.add(getApplication(appName));
		}
		
		return result;
	}

	@Override
	public List<InstalledApplication> getInstalled(String name) {
		DBCollection coll = dbProvider.getMainDB().getCollection(INSTALLED_COLL_NAME);
		DBCursor cursor = coll.find(new BasicDBObject(APPLICATION, name));
		
		List<InstalledApplication> result = new ArrayList<InstalledApplication>();
		
		while (cursor.hasNext()) {
			DBObject dbo = cursor.next();
			InstalledApplication ia = new InstalledApplication();
			ia.setUser((String) dbo.get(USER));
			ia.setMapping((String) dbo.get(MAPPING));
			ia.setApp((String) dbo.get(APPLICATION));
			result.add(ia);
		}
		return result;
	}

	@Override
	public long getInstallCount(String name) {
		DBCollection coll = dbProvider.getMainDB().getCollection(INSTALLED_COLL_NAME);
		DBCursor cursor = coll.find(new BasicDBObject(APPLICATION, name));
		return cursor.count();
	}
}
