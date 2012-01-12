package com.ever365.lanmao;

import java.util.List;

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

import com.ever365.lanmao.sqldb.LanmaoDAO;
import com.ever365.lanmao.sqldb.OutCome;

public class LanmaoapkActivity extends Activity {
	
	
	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        /*
        RelativeLayout layout = (RelativeLayout)findViewById(R.id.mainLayout);
        
        ListView container = (ListView)findViewById(R.id.mainoutcomelist);
        LayoutParams params = container.getLayoutParams();
        params.height = layout.getHeight() - 80;
        container.requestLayout();
        */
        GridView grid_main = (GridView)findViewById(R.id.maingridview);
        BaseAdapter adapter = new MainAdapter(this);
		grid_main.setAdapter(adapter);
    }
    @Override
	protected void onResume() {
		super.onResume();
		displayOutComeList();
	}

	public void displayOutComeList() {
    	ListView outcomeListView = (ListView)findViewById(R.id.mainoutcomelist);
    	
    	//outcomeListView.setVisibility(1);
    	List<OutCome> list = LanmaoDAO.getInstance(getApplicationContext()).getOutComeList(null, null);
    	
    	outcomeListView.setAdapter(new OutComeListAdapter(this, R.id.mainoutcomelist, list));
    	
    	//Utils.setListViewHeightBasedOnChildren(outcomeListView);
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
					displayOutComeList();
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
    			v = li.inflate(R.layout.outcomelistitem, null);
    			((TextView) v.findViewById(R.id.listItem_title)).setText(rowData.getTitle());
    			((TextView) v.findViewById(R.id.listItem_total)).setText(rowData.getTotal().toString());
    			((TextView) v.findViewById(R.id.listItem_date)).setText(rowData.getDate().getYear() + "-" + rowData.getDate().getMonth() + "-" + rowData.getDate().getDate());
    		} else {
    			v = convertView;
    		}
    		v.setTag(rowData);
    		
    		v.setOnLongClickListener(new OnLongClickListener() {
    			@Override
    			public boolean onLongClick(View v) {
    				return false;
    			}
    		});
    		return v;
    	}
    	
    }
    
}
