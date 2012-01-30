package com.ever365.android.tracktime;

import com.phonegap.*;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.KeyEvent;

public class TrackTimerActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        super.loadUrl("file:///android_asset/www/index.html");
        
        //setContentView(R.layout.main);
    }

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		 if (keyCode == KeyEvent.KEYCODE_BACK) { // go back home
			 
			 AlertDialog.Builder builder = new AlertDialog.Builder(this);
			 builder.setMessage("您是否确认退出?")
			        .setCancelable(false)
			        .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
			            public void onClick(DialogInterface dialog, int id) {
			                 TrackTimerActivity.this.finish();
			            }
			        })
			        .setNegativeButton("No", new DialogInterface.OnClickListener() {
			            public void onClick(DialogInterface dialog, int id) {
			                 dialog.cancel();
			            }
			        });
			 AlertDialog alert = builder.create();
			 
			 //this.finish(); 
	         return true; 
		 }	 
	     if (keyCode == KeyEvent.KEYCODE_MENU) { //Exit app 
	         super.loadUrl("file:///android_asset/www/index.html"); 
             return true; 
	     } 
	     return super.onKeyDown(keyCode, event); 
	}
    
    
}