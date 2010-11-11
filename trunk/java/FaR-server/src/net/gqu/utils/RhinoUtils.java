package net.gqu.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.mozilla.javascript.IdScriptableObject;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeJavaObject;
import org.mozilla.javascript.NativeObject;

public class RhinoUtils {

	/**
     * Build java array from a native array
     * 
     * @param nativeArray
     */
    public static Object[] nativeArrayToArray(NativeArray nativeArray) {
        Object[] propIds = nativeArray.getIds();
        Object[] result = new Object[propIds.length];
       
        for (int i=0; i<propIds.length; i++)
        {
            Object propId = propIds[i];
            if (propId instanceof Integer)
            {
                Object value = nativeArray.get((Integer)propId, nativeArray);
                result[i] = nativeToObject(value);
            }
        }
       return result;
    }
    
    
    /**
     * Build java object from a native object
     * @param value
     * @return
     */
	private static Object nativeToObject(Object value) {
		
		if (value instanceof String || value instanceof Boolean || value instanceof Number) {
			return value;
		} else if (value instanceof IdScriptableObject
				&& ((IdScriptableObject) value).getClassName().equals("Date") == true) {
			Object l = NativeObject.callMethod((IdScriptableObject) value, "getTime", null);
			return new Date(((Double)l).longValue());
		} else if (value instanceof NativeArray) {
			 NativeArray na = (NativeArray) value;
			 return nativeArrayToArray(na);
		} else if (value instanceof NativeObject) {
			NativeObject no = (NativeObject) value;
			return nativeObjectToMap(no);
		} else if (value instanceof NativeJavaObject) {
			NativeJavaObject njo = (NativeJavaObject)value;
			return njo.unwrap();
		} else {
			return value;
		}
	}
	

    
	
    /**
     * Build a java map from a native object
     */
    public static Map<String, Object> nativeObjectToMap(NativeObject no) {
    	Map<String, Object> result = new HashMap<String, Object>();
		Object[] ids = no.getIds();
		for (Object id : ids) {
	    	String key = id.toString();
	    	Object value = no.get(key, no);
	    	result.put(key, nativeToObject(value));
		}
		return result;
    }


	/**
	 * Takes a JSON object and converts it to a native JS object.
	 * 
	 * @param jsonObject        the json object
	 * @return NativeObject     the created native object
	 * @throws JSONException
	 */
	public static NativeObject mapToNativeObject(Map<String, Object> map)
	{
	    // Create native object 
	    NativeObject object = new NativeObject();
	    
	    for (String key : map.keySet()) {
	    	Object value = map.get(key);
	    	object.put(key, object, value);
		}
	    return object;
	}
    
    
}
