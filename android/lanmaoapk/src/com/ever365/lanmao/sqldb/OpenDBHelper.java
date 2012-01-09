package com.ever365.lanmao.sqldb;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;


public class OpenDBHelper extends SQLiteOpenHelper {

	private static final String DATABASE_NAME = "applicationdata";
	private static final int DATABASE_VERSION = 1;

	private static final String DATABASE_CREATE = "create table outcome "
			+ "(_id integer primary key autoincrement, "
			+ "desc text , " + "summary text not null,"
			+ " description text not null);";
	
	public OpenDBHelper(Context context) {
		super(context, DATABASE_NAME, null, DATABASE_VERSION);
	}

	
	@Override
	public void onCreate(SQLiteDatabase database) {
		database.execSQL(DATABASE_CREATE);
	}

	@Override
	public void onUpgrade(SQLiteDatabase arg0, int arg1, int arg2) {
		// TODO Auto-generated method stub
		
	}

}
