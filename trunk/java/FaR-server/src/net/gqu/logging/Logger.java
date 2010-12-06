package net.gqu.logging;

import org.mozilla.javascript.Context;

public class Logger {

	
	public void system(String obj) {
		StackTraceElement st = Thread.currentThread().getStackTrace()[3];
		
		Object data = Context.getCurrentContext().getDebuggerContextData();
	};

	
	public void info(String obj) {
		StackTraceElement st = Thread.currentThread().getStackTrace()[3];
		System.out.println(getCurrentLineInfo() + "  " + obj);
	};
	
	public void debug(String obj) {
		
	};
	
	
	public void fatal(String obj) {
		
	};
	
	
	private String getCurrentLineInfo() {
		return Thread.currentThread().getStackTrace()[3].getLineNumber() + "";
	}
	
}
