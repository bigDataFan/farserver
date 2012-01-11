package com.ever365.lanmao.sqldb;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;


public class OpenDBHelper extends SQLiteOpenHelper {

	private static final String DATABASE_NAME = "lanmaodatabase";
	private static final int DATABASE_VERSION = 1;

	private static final String TABLE_CREATE_OUTCOME = "CREATE TABLE IF NOT EXISTS OUTCOME  "
			+ "(_id integer primary key autoincrement, "
			+ LanmaoDAO.OC_DESC + " TEXT , " 
			+ LanmaoDAO.OC_DATE  + " LONG not null,"
			+ LanmaoDAO.OC_METHOD  + " TEXT,"
			+ LanmaoDAO.OC_TYPE  + " TEXT,"
			+ LanmaoDAO.OC_TOTAL  + " REAL,"
			+ LanmaoDAO.OC_UPDATED  + " LONG,"
			+ LanmaoDAO.OC_TITLE  + " TEXT);";
	
	
	private static final String TABLE_CREATE_OUTCOME_ITEMS = "CREATE TABLE IF NOT EXISTS OUTCOME_ITEMS "
			+ "(_id integer primary key autoincrement, "
			+ LanmaoDAO.OC_IT_CATEGORY + " TEXT, " 
			+ LanmaoDAO.OC_IT_COUNT  + " REAL,"
			+ LanmaoDAO.OC_IT_DESC  + " TEXT,"
			+ LanmaoDAO.OC_IT_FK  + " REFERENCES OUTCOME(_id) );";

	
	public OpenDBHelper(Context context) {
		super(context, DATABASE_NAME, null, DATABASE_VERSION);
	}
	
	@Override
	public void onCreate(SQLiteDatabase database) {
		database.execSQL(TABLE_CREATE_OUTCOME);
		database.execSQL(TABLE_CREATE_OUTCOME_ITEMS);
	}

	@Override
	public void onUpgrade(SQLiteDatabase arg0, int arg1, int arg2) {
		
	}

}

