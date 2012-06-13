package com.ever365.farsvr.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONStringer;

/**
 * Collection of JSON Utility methods.
 * This class is immutable.
 * 
 * @author Roy Wetherall
 */
public class JSONUtils
{
	public static String obj2Json(Object obj) {
		
		if (obj instanceof Map) {
			return new JSONObject((Map)obj).toString();
		} else if (obj instanceof Collection) {
			return new JSONArray((Collection)obj).toString();
		} else if (obj instanceof String) {
			return (String)obj;
		} else {
			return new JSONObject(obj).toString();
		}
	}
	
	
	public static boolean isNull(Object obj) {
		return (obj == null);
	}
	public static List<Object> jsonArrayToList(JSONArray jsonArray) {
		List<Object> ret = new ArrayList<Object>();
		Object value = null;
		int length = jsonArray.length();
		for (int i = 0; i < length; i++) {
			try {
				value = jsonArray.get(i);
			} catch (JSONException e) {
				System.out.println(" there are no value with the index in the JSONArray");
				e.printStackTrace();
				return null;
			}
			if (value instanceof JSONArray) {
				ret.add(jsonArrayToList((JSONArray) value));
			} else if (value instanceof JSONObject) {
				ret.add(jsonObjectToMap((JSONObject) value));
			} else {
				ret.add(value);
			}
		}

		return (ret.size() != 0) ? ret : null;
	}

	public static Map<String, Object> jsonObjectToMap(JSONObject jsonObject) {
		Map<String, Object> ret = new HashMap<String, Object>();
		Object value = null;
		String key = null;
		for (Iterator<?> keys = jsonObject.keys(); keys.hasNext();) {
			key = (String) keys.next();
			try {
				value = jsonObject.get(key);
				if (value.toString().equals("null")) {
					value = null;
				}
			} catch (JSONException e) {
				System.out.println("the key is not found in the JSONObject");
				e.printStackTrace();
				return null;
			}
			if (value instanceof JSONArray) {
				ret.put(key, jsonArrayToList((JSONArray) value));
			} else if (value instanceof JSONObject) {
				ret.put(key, jsonObjectToMap((JSONObject) value));
			} else {
				ret.put(key, value);
			}
		}

		return ret.size() != 0 ? ret : null;

	}

	
	/**
     * Converts a given JavaScript native object and converts it to the relevant JSON string.
     * 
     * @param object            JavaScript object
     * @return String           JSON      
     * @throws JSONException
     */
    public static String toJSONString(Object object)
        throws JSONException
    {
    	if (object==null ) {
    		return "undefined or null result object";
    	}
    	
    	if (object instanceof Map) {
    		return new JSONObject((Map)object).toString();
    	}
    	
    	if (object instanceof Object[]) {
    		return new JSONArray((Object[])object).toString();
    	}
    	
    	if (object instanceof Collection) {
			return new JSONArray((Collection)object).toString();
		} 
    	
    	if (object instanceof Number) {
			return ((Number) object).toString();
		} 
    	
    	if (object instanceof String) {
    		return (String)object;
    	}
    	
        JSONStringer json = new JSONStringer();

        	
        json.value(object);
     
        
        return json.toString();
    }
    
    
    
    /**
     * Look at the id's of a native array and try to determine whether it's actually an Array or a HashMap
     * 
     * @param ids       id's of the native array
     * @return boolean  true if it's an array, false otherwise (ie it's a map)
     */
    private static boolean isArray(Object[] ids)
    {
        boolean result = true;
        for (Object id : ids)
        {
            if (id instanceof Integer == false)
            {
               result = false;
               break;
            }
        }
        return result;
    }
    
}
