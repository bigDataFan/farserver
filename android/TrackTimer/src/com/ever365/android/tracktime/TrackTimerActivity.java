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
	public void overridePendingTransition(int enterAnim, int exitAnim) {
		// TODO Auto-generated method stub
		super.overridePendingTransition(R.anim.layout_animation_row_left_slide, exitAnim);
	}

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		 if (keyCode == KeyEvent.KEYCODE_BACK) { // go back home
			 this.finish(); 
	         return true; 
		 }	 
	     if (keyCode == KeyEvent.KEYCODE_MENU) { //Exit app 
	         super.loadUrl("file:///android_asset/www/index.html"); 
             return true; 
	     } 
	     return super.onKeyDown(keyCode, event); 
	}
    
    
}