package com.ever365.lanmao;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.ViewSwitcher;

public class EditOutComeActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main2);
		
		Spinner outtypeSpinner = (Spinner)findViewById(R.id.outtype);
		outtypeSpinner.setOnItemSelectedListener(new OnItemSelectedListener() {
			@Override
			public void onItemSelected(AdapterView<?> parentView, View selectedItemView,
					int position, long id) {
				 ViewSwitcher switcher = (ViewSwitcher)findViewById(R.id.viewSwitcher1);
				 switcher.setDisplayedChild(position);
			}
			@Override
			public void onNothingSelected(AdapterView<?> arg0) {
			}
		});
	}
	
	 public void sayHello(View v) {
		 ViewSwitcher switcher = (ViewSwitcher)findViewById(R.id.viewSwitcher1);
		 switcher.setDisplayedChild(1);
		 
	 }
	 
	 public void addSubItem(View v) {
		 
		 EditText descText = (EditText)findViewById(R.id.subdesc);
		 EditText countText = (EditText)findViewById(R.id.subcount);
		 
		 Spinner catText = (Spinner)findViewById(R.id.subcat);
		 
		 
	 }
	
}
