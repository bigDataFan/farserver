package com.ever365.fruitcatch;


import org.apache.cordova.*;

import android.app.Activity;
import android.os.Bundle;

public class FruitCatchinActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}