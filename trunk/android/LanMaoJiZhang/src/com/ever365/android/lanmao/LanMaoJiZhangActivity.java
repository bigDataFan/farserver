package com.ever365.android.lanmao;

import android.os.Bundle;
import android.view.KeyEvent;

import com.phonegap.*;

public class LanMaoJiZhangActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/jqt/index.html");
    }
    
	private long lastClick = 0;

	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		 if (keyCode == KeyEvent.KEYCODE_BACK) { // go back home
			 if (super.appView.getUrl().endsWith("index.html")) {
				 if (System.currentTimeMillis()-lastClick<300) {
					 this.finish();
					 return true;
				 }
				 lastClick = System.currentTimeMillis();
				 return true;
			 } else {
				 super.loadUrl("file:///android_asset/www/index.html"); 
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