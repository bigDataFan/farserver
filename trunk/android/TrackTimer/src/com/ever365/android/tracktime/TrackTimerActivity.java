package com.ever365.android.tracktime;

import android.os.Bundle;
import android.view.KeyEvent;

import com.phonegap.DroidGap;

public class TrackTimerActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }

	@Override
	public void overridePendingTransition(int enterAnim, int exitAnim) {
		// TODO Auto-generated method stub
		super.overridePendingTransition(R.anim.layout_animation_row_left_slide, R.anim.fade);
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