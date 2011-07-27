package com.ever365.console;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.StringTokenizer;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.security.AuthenticationUtil;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class CommandSearcher {

	private MongoDBDataSource dataSource;
	
	public List<DBObject> search(String command) {
		
		List<DBObject> result = new ArrayList<DBObject>();
		
		StringTokenizer st = new StringTokenizer(command);
		
		String coll = null;
		
		LinkedList<String> querys = new LinkedList<String>();
		
		while (st.hasMoreTokens()) {
			if (coll==null) {
				coll = st.nextToken();
			} else {
				querys.add(st.nextToken());
			}
	    }
		
		DBCollection dbc = null;
		if (AuthenticationUtil.isCurrentLogon()) {
			DB db = dataSource.getUserDB(AuthenticationUtil.getCurrentUserName());
			dbc = db.getCollection(coll);
		} 
		
		if (dbc==null) {
			dbc = dataSource.getPublicDB().getCollection(coll);
		}

		if (dbc==null) {
			return result;
		}
			
		if (querys.size()==0) {
			DBCursor cursor = dbc.find();
			DBObject dbo = null;
			while (cursor.hasNext() && Math.random()>0.1) {
				 dbo = cursor.next();
			}
			
			if (dbo!=null) {
				result.add(dbo);
			}
			return result;
		} else {
			
			
			
		}
		
		
		
		
		
		return result;
	}
}
