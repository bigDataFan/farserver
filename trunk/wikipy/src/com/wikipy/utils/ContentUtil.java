package com.wikipy.utils;





public class ContentUtil {

	public static final String SYS_SCRIPT_FOLDER = "script";
	public static final String SYS_APP_FOLDER = "apps";
	public static final String SYS_USER_FOLDER = "users";
	public static final String SYS_CONTENT_FOLDER = "content";
	
	public static final String JS_EXT = "js";
	public static final String FTL_EXT = "ftl";
	
	
	public static final String getBaseUrl(String nodePath, String currentUser) {
		
		int p = nodePath.indexOf(SYS_SCRIPT_FOLDER);
		if (p==-1) {
			return null;
		}
		return "/" + currentUser + nodePath.substring(p + SYS_SCRIPT_FOLDER.length());
	}
	
	public static void main(String[] args) {
		System.out.println(ContentUtil.getBaseUrl("/APP/$script/bwu/aa.js", "sys"));
		System.out.println(ContentUtil.getBaseUrl("/APP/$script/forum/content/", "sys"));
		String aa = "/abc/def/cc";
		
	}
	
	
	/**
	 * get /abc/def/cc --> /$apps/abc/$script/def/get.cc.js
	 * get /aa  -->null;
	 * get /abc/def  --> /$apps/abc/$script/get.def.js
	 * @param method
	 * @param uri
	 * @return
	 */
	public static final String getJsPathFromRequestUri(String method, String uri, String ext) {
		String[] br = uri.split("/");
		if (br.length<=2) return null;
		StringBuffer sb = new StringBuffer();
		//sb.append("/").append(SYS_APP_FOLDER).append("/");
		//sb.append(br[1]);
		//sb.append("/").append(SYS_SCRIPT_FOLDER);
		for (int i = 1; i < br.length-1; i++) {
			sb.append("/" + br[i]);
		}
		sb.append("/").append(method.toLowerCase()).append(".").append(br[br.length-1]).append(".").append(ext);
		return sb.toString();
	}
	
	public static final String getJsPathFromKey(String key) {
		String[] splits = key.split("__");
		if (splits.length!=2) return null;
		return getJsPathFromRequestUri(splits[0], splits[1], JS_EXT);
	}
	
	public static final String getFtlPathFromKey(String key) {
		String[] splits = key.split("__");
		if (splits.length!=2) return null;
		return getJsPathFromRequestUri(splits[0], splits[1], FTL_EXT);
	}
	
	public static final String getScriptKeyFromJsPath(String jsPath) {
		String fileName = jsPath.substring(jsPath.lastIndexOf("/")+1);
		String[] splits = fileName.split("\\.");
		if (splits.length==3) {
			if (!splits[2].equals(JS_EXT)) {
				return null;
			} else {
				return splits[0].toLowerCase() + "__" + jsPath.substring(0, jsPath.lastIndexOf("/")+1) + splits[1];
				
			}
		} else {
			return null;
		}
	}
	
	/**
	 * back conversion of getJsPathFromRequestUri
	 * @param jsPath
	 * @return
	 */
	/*
	  public static final String getScriptKeyFromJsPath(String jsPath) {

		int p_script = jsPath.indexOf(SYS_SCRIPT_FOLDER);
		int p_app = jsPath.indexOf(SYS_APP_FOLDER);
		
		if (p_app==-1 || p_script==-1 || p_script<p_app) {
			return null;
		}
		String userName = jsPath.substring(p_app + SYS_APP_FOLDER.length()+1, p_script -1);
		String rest = jsPath.substring(p_script + SYS_SCRIPT_FOLDER.length());
		String restFolder = rest.substring(0, rest.lastIndexOf("/")+1); 
		String fileName = rest.substring(rest.lastIndexOf("/")+1);
		
		String[] splits = fileName.split("\\.");
		if (splits.length==3) {
			if (!splits[2].equals(JS_EXT)) return "/" + userName + rest;
			return splits[0].toLowerCase() + "__/" + userName + restFolder + splits[1];
		} else {
			return "/" + userName + rest;
		}
	}
	*/
	
	
	
}
