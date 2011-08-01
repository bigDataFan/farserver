package com.ever365.office;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.rest.registry.RestParam;
import com.ever365.rest.registry.RestService;
import com.ever365.security.AuthenticationUtil;
import com.ever365.vfile.File;
import com.ever365.vfile.VFileService;

public class OfficeService {

	private MongoDBDataSource dataSource;
	private VFileService fileService;
	
	@RestService(method="GET", uri="/office/hi")
	public void hi() {
	}
	
	public void setDataSource(MongoDBDataSource dataSource) {
		this.dataSource = dataSource;
	}


	public void setFileService(VFileService fileService) {
		this.fileService = fileService;
	}


	@RestService(method="POST", uri="/office/upload", multipart=true)
	public String addFile(@RestParam(value="Filename")String name, @RestParam(value="Filedata")InputStream inputStream) {
		File userRoot = getUserRoot();

		Date date = new Date();
		int year = date.getYear() + 1900;
		int month = date.getMonth() + 1;
		int day = date.getDate();
		
		File todayDir = userRoot.makeDir(year + "/" + month + "/" + day);
		
		todayDir.createFile(name, inputStream);
		return "{success: true}";
	}

	private File getUserRoot() {
		String currentUser = AuthenticationUtil.getCurrentUserName();
		
		File userRoot = null;
		
		if (AuthenticationUtil.isCurrentUserGuest()) {
			File root = fileService.getRootFile();
			userRoot = root.makeDir("/temp/" + currentUser);
		} else {
			userRoot = fileService.getRootFile().makeDir(currentUser);
		}
		return userRoot;
	}
	
	@RestService(method="GET", uri="/office/daylist")
	public List<Map<String, Object>> getDayFiles(@RestParam(value="date")String date) {
		String[] splits = date.split("-");
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		if (splits.length==3) {
			File folder = getUserRoot().getByPath(splits[0] + "/" + splits[1] + "/" + splits[2]);
			if (folder!=null) {
				List<File> children = folder.getChildren();
				for (File file : children) {
					Map<String, Object> m = new HashMap<String, Object>();
					m.put("name", file.getName());
					m.put("size", file.getSize());
					m.put("modified", file.getModified());
					m.put("id", file.getObjectId().toString());
					result.add(m);
				}
			}
		}
		return result;
	}
	
	
	
}
