package com.ever365.office;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.security.AuthenticationUtil;
import com.ever365.vfile.File;
import com.ever365.vfile.VFileService;

public class OfficeService {

	private MongoDBDataSource dataSource;
	private VFileService fileService;
	
	
	public void addFile(String name, InputStream inputStream) {
		File userRoot = getUserRoot();

		Date date = new Date();
		int year = date.getYear() + 1900;
		int month = date.getMonth() + 1;
		int day = date.getDate();
		
		File todayDir = userRoot.makeDir(year + "/" + month + "/" + day);
		
		todayDir.createFile(name, inputStream);
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
	
	public List<Map<String, Object>> getDayFiles(String date) {
		String[] splits = date.split("-");
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		if (splits.length==3) {
			File folder = getUserRoot().getByPath(splits[0] + "/" + splits[1] + "/" + splits[2]);
			if (folder!=null) {
				List<File> children = folder.getChildren();
				for (File file : children) {
					
				}
			}
		}
		
		return result;
	}
	
	
}
