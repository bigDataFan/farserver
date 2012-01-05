package com.ever365.lanmao;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.TextView;

public class LanmaoapkActivity extends Activity {

	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        GridView grid_main = (GridView)findViewById(R.id.maingridview);
        
        BaseAdapter adapter = new MainAdapter(this);
		grid_main.setAdapter(adapter);
    }

    public class MainAdapter extends BaseAdapter {
	
    	Context mContext;  
    	public static final int ACTIVITY_CREATE = 10;  
		public MainAdapter(Context c) {
			mContext = c;
		}  

		@Override
		public View getView(int position, View convertView, ViewGroup vg) {
			View v;
			if (convertView == null) {
				LayoutInflater li = getLayoutInflater();
				v = li.inflate(R.layout.menuicon, null);
				TextView tv = (TextView) v.findViewById(R.id.icon_text);
				tv.setText("Profile " + position);
				ImageView iv = (ImageView) v.findViewById(R.id.icon_image);
				iv.setImageResource(R.drawable.ic_launcher);
			} else {
				v = convertView;
			}
			v.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View v) {
					Intent intent = new Intent(mContext,EditOutComeActivity.class);
					startActivity(intent);
				}
			});
			return v;
		}

		@Override
		public Object getItem(int arg0) {
			return null;
		}

		@Override
		public int getCount() {
			return 5;
		}

		@Override
		public long getItemId(int arg0) {
			return 0;
		}

	}

}
