package net.gqu.jscript.root;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

public class ScriptAgent {
	
	private HttpServletRequest request;
	
	
	
	private static Map<String, Analyser> analysers = new HashMap<String, Analyser>();
	
	{
		analysers.put(BlackBerryAnalyser.BLACK_BERRY, new BlackBerryAnalyser());
	}
	
	
	public ScriptAgent(HttpServletRequest request) {
		super();
		this.request = request;
	}

	public String getAgentType() {

		String uagent = request.getHeader("User-Agent");
		
		
		Set<String> keys = analysers.keySet();
		for (String key : keys) {
			if (uagent.indexOf(key)>-1) {
				return analysers.get(key).getType(uagent);
			}
		}
		return "-1";
	}
	
	
	interface Analyser {
		public String getType(String agent);
	}
	
	class BlackBerryAnalyser implements Analyser {
		
		public static final String BLACK_BERRY = "BlackBerry";

		@Override
		public String getType(String agent) {
			int bb = agent.indexOf(BLACK_BERRY);
			if (agent.length()>bb+15) {
				return agent.substring(bb, bb + 14);
			} else {
				return BLACK_BERRY; 
			}
		}
		
	}
	
}
