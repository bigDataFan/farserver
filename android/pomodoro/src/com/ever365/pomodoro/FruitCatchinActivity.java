package com.ever365.pomodoro;


import org.apache.cordova.*;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;

public class FruitCatchinActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
    
    @Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		 if (keyCode == KeyEvent.KEYCODE_BACK) { // go back home
			 if (super.appView.getUrl().endsWith("index.html")) {
				 this.finish();
				 return true;
			 }
		 }
	     return super.onKeyDown(keyCode, event); 
	}
}