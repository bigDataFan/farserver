package com.ever365.lanmao;

import java.util.List;

import com.ever365.lanmao.adapters.OutComeListItem;
import com.ever365.lanmao.sqldb.OutCome;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.View.OnLongClickListener;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.ListView;
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
    

    public void displayOutComeList() {
    	ListView outcomeListView = (ListView)findViewById(R.id.mainoutcomelist);
    	
    	
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
			
			v.setOnLongClickListener(new OnLongClickListener() {
				@Override
				public boolean onLongClick(View v) {
					Intent intent = new Intent(mContext,EditOutComeActivity.class);
					startActivity(intent);
					return true;
				}
			});
			
			v.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View v) {
					//v.setBackgroundColor();
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
			return 3;
		}

		@Override
		public long getItemId(int arg0) {
			return 0;
		}

	}

    
    class OutComeListAdapter extends ArrayAdapter<OutCome>{

    	public OutComeListAdapter(Context context, int textViewResourceId,
    			List<OutCome> objects) {
    		super(context, textViewResourceId, objects);
    	}
    	
    	@Override
    	public View getView(int position, View convertView, ViewGroup parent) {
    		
    		View v;
    		final OutCome rowData= getItem(position);
    		if (convertView == null) {
    			LayoutInflater li = getLayoutInflater();
    			v = li.inflate(R.layout.subitems, null);
    			((TextView) v.findViewById(R.id.sublistdesc)).setText(rowData.getDesc());
    			((TextView) v.findViewById(R.id.sublistcount)).setText("金额：" + rowData.getCount());
    			((TextView) v.findViewById(R.id.sublistcat)).setText("类别" + rowData.getCat());
    		} else {
    			v = convertView;
    		}
    		v.setTag(rowData);
    		
    		v.setOnLongClickListener(new OnLongClickListener() {
    			@Override
    			public boolean onLongClick(View v) {
    				OutComeListItem data = (OutComeListItem)v.getTag();
    				currentlist.remove(data);
    				adapter.notifyDataSetChanged();
    				Utils.setListViewHeightBasedOnChildren(subitemsView);
    				return false;
    			}
    		});
    		return v;
    	}
    	
    }
    
}
