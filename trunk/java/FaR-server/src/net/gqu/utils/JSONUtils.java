/*
 * Copyright (C) 2005-2007 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing"
 */
package net.gqu.utils;

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
import org.mozilla.javascript.Context;
import org.mozilla.javascript.IdScriptableObject;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeJavaObject;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.Undefined;

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
    	if (object==null || object instanceof Undefined) {
    		return "undefined or null result object";
    	}
    	
    	if (object instanceof Map) {
    		return new JSONObject((Map)object).toString();
    	}
    	if (object instanceof Collection) {
			return new JSONArray((Collection)object).toString();
		}
    	
    	if (object instanceof String) {
    		return (String)object;
    	}
    	
        JSONStringer json = new JSONStringer();

        if (object instanceof NativeArray)
        {
            nativeArrayToJSONString((NativeArray)object, json);
        }
        else if (object instanceof NativeObject)
        { 
            nativeObjectToJSONString((NativeObject)object, json);
        }
        else
        {
        	
        	json.value(object);
        }        
        
        return json.toString();
    }
    
    
    
    /**
     * Takes a JSON string and converts it to a native java script object
     * 
     * @param  jsonString       a valid json string
     * @return NativeObject     the created native JS object that represents the JSON object
     * @throws JSONException    
     */
    public static NativeObject toObject(String jsonString)
        throws JSONException
    {
        // TODO deal with json array stirngs
        
        // Parse JSON string
        JSONObject jsonObject = new JSONObject(jsonString);
        
        // Create native object 
        return toObject(jsonObject);
    }
    
    /**
     * Takes a JSON object and converts it to a native JS object.
     * 
     * @param jsonObject        the json object
     * @return NativeObject     the created native object
     * @throws JSONException
     */
    public static NativeObject toObject(JSONObject jsonObject)
        throws JSONException
    {
        // Create native object 
        NativeObject object = new NativeObject();
        
        Iterator<String> keys = jsonObject.keys();
        while (keys.hasNext())
        {
            String key = (String)keys.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject)
            {
                object.put(key, object, toObject((JSONObject)value));
            }
            else
            {
                object.put(key, object, value);
            }
        }
        
        return object;
    }
    
    /**
     * Build a JSON string for a native object
     * 
     * @param nativeObject
     * @param json
     * @throws JSONException
     */
    private static void nativeObjectToJSONString(NativeObject nativeObject, JSONStringer json)
        throws JSONException
    {
        json.object();
        
        Object[] ids = nativeObject.getIds();
        for (Object id : ids)
        {
            String key = id.toString();
            json.key(key);
            
            Object value = nativeObject.get(key, nativeObject);
            valueToJSONString(value, json);
        }
        
        json.endObject();
    }
    
    /**
     * Build JSON string for a native array
     * 
     * @param nativeArray
     * @param json
     */
    private static void nativeArrayToJSONString(NativeArray nativeArray, JSONStringer json)
        throws JSONException
    {
        Object[] propIds = nativeArray.getIds();
        if (isArray(propIds) == true)
        {      
            json.array();
            
            for (int i=0; i<propIds.length; i++)
            {
                Object propId = propIds[i];
                if (propId instanceof Integer)
                {
                    Object value = nativeArray.get((Integer)propId, nativeArray);
                    valueToJSONString(value, json);
                }
            }
            
            json.endArray();
        }
        else
        {
            json.object();
            
            for (Object propId : propIds)
            {
                Object value = nativeArray.get(propId.toString(), nativeArray);
                json.key(propId.toString());
                valueToJSONString(value, json);    
            }            
            
            json.endObject();
        }
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
    
    /**
     * Convert value to JSON string
     * 
     * @param value
     * @param json
     * @throws JSONException
     */
    private static void valueToJSONString(Object value, JSONStringer json)
        throws JSONException
    {
        if (value instanceof IdScriptableObject &&
            ((IdScriptableObject)value).getClassName().equals("Date") == true)
        {
            // Get the UTC values of the date
            Object year = NativeObject.callMethod((IdScriptableObject)value, "getUTCFullYear", null);
            Object month = NativeObject.callMethod((IdScriptableObject)value, "getUTCMonth", null);
            Object date = NativeObject.callMethod((IdScriptableObject)value, "getUTCDate", null);
            Object hours = NativeObject.callMethod((IdScriptableObject)value, "getUTCHours", null);
            Object minutes = NativeObject.callMethod((IdScriptableObject)value, "getUTCMinutes", null);
            Object seconds = NativeObject.callMethod((IdScriptableObject)value, "getUTCSeconds", null);
            Object milliSeconds = NativeObject.callMethod((IdScriptableObject)value, "getUTCMilliseconds", null);
            
            // Build the JSON object to represent the UTC date
            json.object()
                    .key("zone").value("UTC")
                    .key("year").value(year)
                    .key("month").value(month)
                    .key("date").value(date)
                    .key("hours").value(hours)
                    .key("minutes").value(minutes)
                    .key("seconds").value(seconds)
                    .key("milliseconds").value(milliSeconds)
                .endObject();
            
        }
        else if (value instanceof NativeJavaObject)
        {
            Object javaValue = Context.jsToJava(value, Object.class);
            json.value(javaValue);
        }
        else if (value instanceof NativeArray)
        {
            // Output the native object
            nativeArrayToJSONString((NativeArray)value, json);
        }
        else if (value instanceof NativeObject)
        {
            // Output the native array
            nativeObjectToJSONString((NativeObject)value, json);
        }
        else
        {
            json.value(value);
        }
    }    
}
