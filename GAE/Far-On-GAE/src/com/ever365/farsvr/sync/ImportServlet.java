package com.ever365.farsvr.sync;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.ever365.farsvr.security.AuthenticationUtil;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.EmbeddedEntity;
import com.google.appengine.api.datastore.Entity;

/**
 * 生成随机验证码
 * 
 * @author bitiliu
 * 
 */
public class ImportServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	
	public void init() throws ServletException {
		
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
	}
}