package com.ever365.phonegap;

import com.phonegap.DroidGap;

import android.app.Activity;
import android.os.Bundle;
import com.phonegap.*;

public class TedActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
    	 super.onCreate(savedInstanceState);
         super.loadUrl("file:///android_asset/www/index.html");
    }
}