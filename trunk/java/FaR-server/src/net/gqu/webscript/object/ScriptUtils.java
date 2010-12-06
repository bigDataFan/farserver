package net.gqu.webscript.object;

import net.gqu.utils.StringUtils;

public class ScriptUtils extends StringUtils {

	private static ScriptUtils instance;

	private ScriptUtils() {
		super();
	}
	

	public static final ScriptUtils getInstance() {
		if (instance==null) {
			instance = new ScriptUtils();
		}
		
		return instance;
	}
	
	
	
	public static String[]  trimArrayString(String[] srcAry) {
		return org.springframework.util.StringUtils.trimArrayElements(srcAry);
	}
	
	
	
	
	
	public static void main(String[] args) {
		String[] src = new String[]{"", "dsfd","","fd"};
		
		String[] bb = ScriptUtils.getInstance().trimArrayString(src);
		src = ScriptUtils.getInstance().trimArrayString(src);
		
		System.out.println(src.length);
		
		
	}
	
}
