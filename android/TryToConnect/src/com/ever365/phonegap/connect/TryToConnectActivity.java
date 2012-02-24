package com.ever365.phonegap.connect;

import android.app.Activity;
import android.os.Bundle;
import com.phonegap.*;

public class TryToConnectActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/320x480/index.html");
    }
}