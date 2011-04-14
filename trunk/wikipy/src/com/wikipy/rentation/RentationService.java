package com.wikipy.rentation;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.Script;

import com.wikipy.utils.RhinoUtils;
import com.wikipy.web.HttpStatusExceptionImpl;

import freemarker.template.Template;

public class RentationService {

	private RentationDAO rentationDAO;
	private ScriptExecService scriptExecService;
	
	private Map<String, Pair<Script, Template>> renders = new ConcurrentHashMap<String, Pair<Script, Template>>();
	
	
	public String render(String renderId, Map<String, Object> httpParams) {
		Pair<Script, Template> pair= renders.get(renderId);
		
		if  (pair==null) {
			pair = new Pair<Script, Template>();
			Map<String, Object> map = rentationDAO.getRentation(renderId);
			if (map==null) {
				return "the render does not exist";
			}
			if (map.get("js")!=null) {
				try {
					Script script = scriptExecService.compile((String)map.get("js"), renderId);
					pair.setJs(script);
				} catch (Exception e) {
					throw new HttpStatusExceptionImpl(433, e.getMessage());
				}
			}
			if (map.get("ftl")!=null) {
				
			}
			renders.put(renderId, pair);
		}
		
		Object wsresult;
		if (pair.getJs()!=null) {
			wsresult = scriptExecService.executeScript(pair.getJs(), httpParams, false);
			httpParams.put("model", wsresult);
		}
		return renderId;
		
	}
	
	protected Map<String, Object> getFtlParameters(Map<String, Object> scriptObjects) {
		scriptObjects.put("params", RhinoUtils.nativeObjectToMap((NativeObject) scriptObjects.get("params")));
		//scriptObjects.put("context", RhinoUtils.nativeObjectToMap((NativeObject) scriptObjects.get("context")));
		
		return scriptObjects;
	}
	
	
}
