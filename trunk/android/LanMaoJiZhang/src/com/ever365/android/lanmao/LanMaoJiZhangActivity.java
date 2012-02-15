package com.ever365.android.lanmao;

import android.os.Bundle;
import android.view.KeyEvent;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;

import com.phonegap.*;

public class LanMaoJiZhangActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
    
    
    /*
	
	
	@Override
	public void onUserInteraction() {
		System.out.println("user interaction");
		if (CurrentLocation.currentLocation!=null) {
			super.loadUrl(CurrentLocation.currentLocation);
			Animation fade = AnimationUtils.loadAnimation(this.getApplicationContext(), R.anim.fade);
			super.appView.startAnimation(fade);
			CurrentLocation.currentLocation = null;
		}
		super.onUserInteraction();
	}

     */
    
    private long lastClick = 0;
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		 if (keyCode == KeyEvent.KEYCODE_BACK) { // go back home
			 if (super.appView.getUrl().endsWith("index.html")) {
				 this.finish();
				 return true;
			 }
		 }
	     if (keyCode == KeyEvent.KEYCODE_MENU) {  
	         super.loadUrl("file:///android_asset/www/index.html"); 
             return true; 
	     } 
	     return super.onKeyDown(keyCode, event); 
	}
}