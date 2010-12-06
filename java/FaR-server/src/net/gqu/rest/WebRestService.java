package net.gqu.rest;

import java.io.BufferedReader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import net.gqu.application.ApplicationService;
import net.gqu.application.ApprovedApplication;
import net.gqu.application.InstalledApplication;
import net.gqu.cache.EhCacheService;
import net.gqu.exception.HttpStatusExceptionImpl;
import net.gqu.security.AuthenticationUtil;
import net.gqu.security.BasicUserService;
import net.gqu.security.Role;
import net.gqu.security.User;
import net.gqu.utils.GUID;

import org.bson.types.ObjectId;

import com.google.gdata.client.GoogleService;
import com.google.gdata.client.calendar.CalendarService;
import com.google.gdata.util.AuthenticationException;

public class WebRestService {

	private ApplicationService applicationService;
	private EhCacheService cacheService;
	private BasicUserService userService;
	
	public void setCacheService(EhCacheService cacheService) {
		this.cacheService = cacheService;
	}

	public void setApplicationService(ApplicationService applicationService) {
		this.applicationService = applicationService;
	}
	
	public BasicUserService getUserService() {
		return userService;
	}

	public void setUserService(BasicUserService userService) {
		this.userService = userService;
	}

	@RestService(method="POST", uri="/application/install")
	public Map<String, Object> installApp(@RestParam(value="application")String application, @RestParam(value="mapping")String mapping) {
		if (!AuthenticationUtil.isCurrentLogon()) {
			throw new HttpStatusExceptionImpl(401);
		}
		
		ApprovedApplication app = applicationService.getApplication(application);
		
		if (app==null) {
			throw new HttpStatusExceptionImpl(404);
		}
		
		InstalledApplication installed = applicationService.install(AuthenticationUtil.getCurrentUser(), app, mapping);
		
		Map<String, Object> result = new HashMap<String, Object>();
		
		result.put(ApplicationService.APPLICATION, installed.getApp());
		result.put(ApplicationService.USER, installed.getUser());
		result.put(ApplicationService._ID, installed.getId());
		result.put(ApplicationService.MAPPING, installed.getMapping());
		return result;
	}
	
	
	@RestService(method="POST", uri="/user/googlepwd")
	public void saveGooglePwd(@RestParam(value="googleuser")String user, @RestParam(value="googlepwd")String pwd) {
		GoogleService googleService = new CalendarService("gqu-web");
		try {
			googleService.setUserCredentials(user, pwd);
			User duser = userService.getUser(AuthenticationUtil.getCurrentUserName());
			duser.getAttrs().put(User.ATTR_GOOGLE_USER, user);
			duser.getAttrs().put(User.ATTR_GOOGLE_PWD, pwd);
			userService.updateUser(duser);
		} catch (AuthenticationException e) {
		}
	}


	@RestService(method="POST", uri="/admin/role/list")
	public Map<String, Object> getRoles() {
		if (!AuthenticationUtil.isCurrentUserAdmin()) throw new HttpStatusExceptionImpl(403);
		
		List<Role> roles = userService.getRoles();
		
		Map<String, Object> result = new HashMap<String, Object>();
		
		List<Map<String, Object>> rolesMap = new ArrayList<Map<String,Object>>();
		
		for (Role role : roles) {
			rolesMap.add(role.getMap());
		}
		result.put("total", roles.size());
		result.put("rows", rolesMap);
		
		return result;
	}

	@RestService(method="POST", uri="/admin/role/remove")
	public void removeRole(@RestParam(value="id")String id) {
		if (!AuthenticationUtil.isCurrentUserAdmin()) throw new HttpStatusExceptionImpl(403);
		userService.removeRole(id);
	}

	
	
	@RestService(method="POST", uri="/admin/role/save")
	public String addRole(@RestParam(value="id")String id, @RestParam(value="name")String name, 
			@RestParam(value="contentSize")String contentSize,
			@RestParam(value="totalSize")String totalSize,
			@RestParam(value="open")String open,
			@RestParam(value="enabled")String enabled
			) {
		if (!AuthenticationUtil.isCurrentUserAdmin()) throw new HttpStatusExceptionImpl(403);
		
		
		if (name==null || name.equals("")) return "name can't be empty";
		long filesize = 0;
		long total  = 0;
		try{
			filesize = new Integer(contentSize);
			total = new Integer(totalSize);
		} catch (Exception e) {
			return "size should be integer";
		}
		
		boolean opened = false;
		if ("true".equals(open)) {
			opened = true;	
		}
		
		boolean benabled = false;
		if ("true".equals(enabled)) {
			benabled = true;	
		}
		
		Role role = new Role();
		role.setName(name);
		role.setContentSize(filesize);
		role.setTotalSize(total);
		role.setEnabled(benabled);
		role.setOpen(opened);
		if (id!=null && !"".equals(id)) {
			role.setId(new ObjectId(id));
		}
		userService.updateRole(role);
		return "OK";
	}
	
	@RestService(method="POST", uri="/admin/user/list")
	public Map<String, Object> filterUser(@RestParam(value="sort") String sort, @RestParam(value="order")String order, 
			@RestParam(value="page")String page, @RestParam(value="rows")String rows) {
		if (!AuthenticationUtil.isCurrentUserAdmin()) throw new HttpStatusExceptionImpl(403);
		Integer p = Integer.valueOf(page);
		Integer r = Integer.valueOf(rows);
		return userService.getUsersJsonMap(sort, order, (p-1)*r, r);
	}

	@RestService(method="POST", uri="/admin/user/save")
	public void saveUser(@RestParam(value="name") String name, @RestParam(value="role")String role,@RestParam(value="email")String email,
			@RestParam(value="password")String password, @RestParam(value="disabled")String disabled) {
		if (!AuthenticationUtil.isCurrentUserAdmin()) throw new HttpStatusExceptionImpl(403);
		
		User user = userService.getUser(name); 
		if (user==null) {
			userService.createUser(name,password,role, email, new Boolean(disabled));
		} else {
			user.setRole(role);
			user.setEmail(email);
			user.setPassword(password);
			user.setDisabled(new Boolean(disabled));
			userService.updateUser(user);
		}
	}
	
	@RestService(method="POST", uri="/admin/user/import")
	public String importUser(@RestParam(value="data") String data, @RestParam(value="role") String role) {
		if (!AuthenticationUtil.isCurrentUserAdmin()) throw new HttpStatusExceptionImpl(403);
		
		BufferedReader br = new BufferedReader(new StringReader(data));
		StringBuffer result = new StringBuffer();
		while (true) {
			try {
				String l = br.readLine();
				if (l==null) break;
				String[] a = l.split(",");
				userService.createUser(a[0], a[1], role, a[2], false);
				result.append(a[0]).append(',');
				
			} catch (Throwable e) {
			}
		}
		
		return result.toString();
	}
	
	@RestService(method="GET", uri="/admin/system/infos")
	public Map<String, Object> getSystemInfos() {
		return GUID.getSystemInfo();
	}
			
	@RestService(method="GET", uri="/admin/user/apps")
	public Set<String> getUserApps(@RestParam(value="username") String name) {
		if (!AuthenticationUtil.isCurrentUserAdmin()) throw new HttpStatusExceptionImpl(403);
		Map<String, InstalledApplication> installed = applicationService.getUserInstalledApplications(name);
		return installed.keySet();
	}
	
	@RestService(method="POST", uri="/admin/application/list")
	public Map<String, Object> showAllApps() {
		if (!AuthenticationUtil.isCurrentUserAdmin()) throw new HttpStatusExceptionImpl(403);
		List<ApprovedApplication> all = applicationService.getAllInCurrentServer();
		List<Map> jsoned = new ArrayList<Map>();
		for (ApprovedApplication aa : all) {
			Map<String, Object> map = aa.getMaps();
			map.put("installed", applicationService.getInstallCount(aa.getName()));
			jsoned.add(map);
		}
		
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("total", all.size());
		result.put("rows", jsoned);
		return result;
		
	}
	
	@RestService(method="GET", uri="/admin/application/clean")
	public String cleanAppCache(@RestParam(value="name")String application) {
		if (!AuthenticationUtil.isCurrentUserAdmin()) throw new HttpStatusExceptionImpl(403);
		cacheService.getApplicationCache(application).removeAll();
		return "OK";
	}
}
