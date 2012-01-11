package com.ever365.lanmao.sqldb;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.content.ContentValues;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;

public class LanmaoDAO {
	
	private Context context;
	private SQLiteDatabase db;
	private OpenDBHelper dbHelper;
	
	public static final String OC_TITLE = "title_s";
	public static final String OC_DESC = "desc_s";
	public static final String OC_DATE = "date_t";
	public static final String OC_TOTAL = "total_f";
	public static final String OC_METHOD = "method_s";
	public static final String OC_TYPE = "type_s";
	public static final String OC_UPDATED = "updated_t";
	
	
	public static final String OC_IT_DESC = "desc_s";
	public static final String OC_IT_CATEGORY = "cat_s";
	public static final String OC_IT_COUNT = "cat_f";
	public static final String OC_IT_FK = "outcome_id_i";
	
	
	private static LanmaoDAO DAO = null;
	
	public LanmaoDAO(Context context) {
		super();
		this.context = context;
		dbHelper = new OpenDBHelper(context);
		db = dbHelper.getWritableDatabase();
	}


	public static LanmaoDAO getInstance(Context context) {
		if (DAO==null) {
			DAO = new LanmaoDAO(context);
		} 
		return DAO;
	}
	
	public void close() {
		dbHelper.close();
	}
	
	public List<OutCome> getOutComeList(Date from, Date to) {
		return null;
	}

	
	public long insertOutCome(OutCome oc) {
		try {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put(OC_TITLE, oc.getTitle());
			m.put(OC_DESC, oc.getDesc());
			m.put(OC_TYPE, oc.getType());
			m.put(OC_METHOD, oc.getMethod());
			m.put(OC_DATE, oc.getDate());
			m.put(OC_TOTAL, oc.getTotal());
			
			long l = insert(m);
			
			for (OutComeListItem item : oc.getItems()) {
				Map<String, Object> im = new HashMap<String, Object>();
				im.put(OC_IT_FK, l);
				im.put(OC_IT_CATEGORY, item.getCat());
				im.put(OC_IT_COUNT, item.getCount());
				im.put(OC_IT_DESC, item.getDesc());
				insert(im);
			}
			return l;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return  -1;
	}
	
	public long insert(Map<String, Object> m) {
		long l = db.insert("outcome", null, createContentValues(m));
		return l;
	}
	
	public ContentValues createContentValues(Map<String, Object> m) {
		ContentValues cv=new ContentValues(); 
		for (String key : m.keySet()) {
			Object v = m.get(key);
			
			if (key.endsWith("_s")) {
				cv.put(key, (String)v);
			} else if (key.endsWith("_f")) {
				cv.put(key, (Float)v);
			} else if (key.endsWith("_i")) {
				cv.put(key, (Integer)v);
			} else if (key.endsWith("_b")) {
				cv.put(key, (Boolean)v);
			} else if (key.endsWith("_t")) {
				cv.put(key, ((Date)v).getTime());
			}
		}
		
		return cv;
	}
	
	
}
