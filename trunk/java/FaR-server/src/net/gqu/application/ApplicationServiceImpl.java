package net.gqu.application;

import java.io.IOException;
import java.util.HashMap;
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
	private String mainServer = null; //"http://127.0.0.1:8080/GQMain/";
	private MongoDBProvider dbProvider;
	private BasicUserService userService;
	
	private Map<String, ApprovedApplication> applicationMap = new HashMap<String, ApprovedApplication>();
	
	public String getMainServer() {
		return mainServer;
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
	public ApprovedApplication getApplication(String id) {
		
		if (applicationMap.get(id)==null) {
			HttpResponse response = HttpLoader.load("http://www.g-qu.net/service/application/get?name=" + id);
			if (response!=null && response.getStatusLine().getStatusCode()==200) {
				try {
					JSONObject json = new JSONObject(StringUtils.getText(response.getEntity().getContent()));
					ApprovedApplication application = new ApprovedApplication(JSONUtils.jsonObjectToMap(json));
					applicationMap.put(id, application);
				} catch (JSONException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			
				
		}
		return applicationMap.get(id);
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
	public InstalledApplication install(String user, ApprovedApplication app, String mapping) {
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

}
