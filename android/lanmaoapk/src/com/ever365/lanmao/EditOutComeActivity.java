package com.ever365.lanmao;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.ViewSwitcher;

public class EditOutComeActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main2);
	}
	
	 public void sayHello(View v) {
		 ViewSwitcher switcher = (ViewSwitcher)findViewById(R.id.viewSwitcher1);
		 
		 switcher.setDisplayedChild(1);
		 
	 }
	
}
