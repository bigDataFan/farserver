package net.gqu.webscript;

import java.util.Date;

import org.mozilla.javascript.Script;

public class WebScript {
	public final static String FILE_END_FIX = ".gs";
	
	private String scriptContent;
	private Script script;
	
	private Date activeDate;	

	
	public WebScript() {
	}

	public WebScript(String content) {
		this.scriptContent = content;
	}

	public Script getScript() {
		return script;
	}

	public void setScript(Script script) {
		this.script = script;
	}

	public Date getActiveDate() {
		return activeDate;
	}

	public void setActiveDate(Date activeDate) {
		this.activeDate = activeDate;
	}

	public void setScriptContent(String scriptContent) {
		this.scriptContent = scriptContent;
	}
	

	public String getScriptContent() {
		return scriptContent;
	}
	
}

