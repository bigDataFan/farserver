package com.ever365.lanmao.sqldb;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;

public class LandaoDAO {
	
	private Context context;
	private SQLiteDatabase db;
	private OpenDBHelper dbHelper;
	
	private static LandaoDAO DAO = null;
	
	public LandaoDAO(Context context) {
		super();
		this.context = context;
		dbHelper = new OpenDBHelper(context);
		db = dbHelper.getWritableDatabase();
	}


	public static LandaoDAO getInstance(Context context) {
		if (DAO==null) {
			DAO = new LandaoDAO(context);
		} 
		return DAO;
	}
	
	public void close() {
		dbHelper.close();
	}
	
	public long createTodo(String category, String summary, String description) {
		ContentValues values = createContentValues(category, summary,
				description);

		return db.insert(DB_TABLE, null, values);
	}
}
