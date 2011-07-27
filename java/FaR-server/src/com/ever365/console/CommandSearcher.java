package com.ever365.console;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.StringTokenizer;

import com.ever365.collections.mongodb.MongoDBDataSource;
import com.ever365.security.AuthenticationUtil;
import com.mongodb.BasicDBObject;
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
			DBCursor cursor = dbc.find().limit(10);
			while (cursor.hasNext()) {
				result.add(cursor.next());
			}
			return result;
		} else {
			int limit=10;
			int skip=0;
			if (querys.size()>=2) {
				try {
					skip = Integer.parseInt(querys.get(1));
				} catch (Exception e) {
				}
			}

			if (querys.size()>=3) {
				try {
					limit = Integer.parseInt(querys.get(2));
					if (limit>100) {
						limit = 100;
					}
				} catch (Exception e) {
				}
			} 
			DBCursor cursor = dbc.find(new BasicDBObject("_index", querys.get(0))).skip(skip).limit(limit);
			while (cursor.hasNext()) {
				result.add(cursor.next());
			}
		}
		return result;
	}
}
