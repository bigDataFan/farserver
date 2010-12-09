package net.gqu.webscript.object;

import javax.servlet.http.HttpServletRequest;

import net.gqu.webscript.HttpStatusExceptionImpl;

/**
 * Http服务处理类 
 */

public class ScriptHttp {
	private HttpServletRequest request;
	
	private StringBuffer sb = new StringBuffer();
	
	
	public ScriptHttp(HttpServletRequest req) {
		request = req;
	}

	
	
	/**
	 * 直接设置http返回状态码，用来处理出错情况 
	 * 代码执行到此则直接返回
	 * @param code 
	 */
	public void setCode(int code) {
		throw new HttpStatusExceptionImpl(code, null);
	}
	
	/**
	 * 直接设置http返回状态码，用来处理出错情况 
	 * 代码执行到此则直接返回
	 * @param code 
	 */
	public void code(int code) {
		throw new HttpStatusExceptionImpl(code, null);
	}
	
	public void msg(String msg) {
		if(sb.length()>10000) {
			return;
		} else {
			sb.append(msg);
		}
	}
	
	public String getMsg() {
		return sb.toString();
	}
	
	
	/**
	 * 获取远程访问的ip地址
	 * @return
	 */
	public String getRemoteAddr() {
		return request.getRemoteAddr();
	}
	
}
