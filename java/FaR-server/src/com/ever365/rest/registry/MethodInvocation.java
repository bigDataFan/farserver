package com.ever365.rest.registry;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;


/**
 * 执行一个方法调用，并处理相关的参数转换 
 * @author 刘晗
 */
public class MethodInvocation {
	
	private Method method;
	private Object service;
	private boolean transactional;
	
	public boolean isTransactional() {
		return transactional;
	}

	public void setTransactional(boolean transactional) {
		this.transactional = transactional;
	}

	private LinkedHashMap<String, Class> paramsMap = new LinkedHashMap<String, Class>();
	SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	
	public Method getMethod() {
		return method;
	}
	
	public void pushParam(String name, Class type) {
		paramsMap.put(name, type);
	}
	
	public Object execute(Map<String,Object> map) {
		
		Set<Entry<String, Class>> es = paramsMap.entrySet();
		Object[] methodParams = new Object[es.size()];
		int i=0;
		for (Entry<String, Class> entry : es) {
			methodParams[i] = convert(entry.getValue(), map.get(entry.getKey()));
			i ++;
		}
		try {
			return method.invoke(service, methodParams);
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			if (e.getTargetException()!=null && (e.getTargetException() instanceof RuntimeException)) {
				throw (RuntimeException) e.getTargetException();
			} else {
				e.printStackTrace();
			}
		}
		return null;
	}
	
	public Object convert(Class clazz, Object obj) {
		if (obj==null) return null;
		
		//对返回类型为  JSONObject.NULL的处理	
		if (!(obj instanceof String) && obj.toString().equals("null")) return null;
		
		if (clazz==String.class) {
			return obj.toString();
		}
		
		if (clazz==Integer.class) {
			return Integer.parseInt((String) obj);
		}
		
		if (clazz==Double.class) {
			return Double.parseDouble((String) obj);
		}
		
		if (clazz.isInstance(obj)) {
			return clazz.cast(obj);
		}
		
		if (clazz==Date.class && obj instanceof String) {
			try {
				return dateformat.parse((String) obj);
			} catch (ParseException e) {
				e.printStackTrace();
			}	
		}

		return null;
	}

	public void setMethod(Method method) {
		this.method = method;
	}

	public Object getService() {
		return service;
	}

	public void setService(Object service) {
		this.service = service;
	}
	
}
