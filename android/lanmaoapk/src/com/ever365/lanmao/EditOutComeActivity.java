package com.ever365.lanmao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.ever365.lanmao.sqldb.LanmaoDAO;
import com.ever365.lanmao.sqldb.OutCome;
import com.ever365.lanmao.sqldb.OutComeListItem;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.View;
import android.view.View.OnLongClickListener;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.ViewSwitcher;

public class EditOutComeActivity extends Activity {
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		MenuInflater inflater = getMenuInflater();
		inflater.inflate(R.menu.mneditoutcome, menu);
		return true;
	}

	private List<OutComeListItem> currentlist = new ArrayList<OutComeListItem>();
	CustomAdapter adapter = null;
	private LanmaoDAO dao;
	
	private ListView subitemsView;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main2);
		Spinner outtypeSpinner = (Spinner)findViewById(R.id.octype);
		final ViewSwitcher switcher = (ViewSwitcher)findViewById(R.id.viewSwitcher1);
		
		outtypeSpinner.setOnItemSelectedListener(new OnItemSelectedListener() {
			@Override
			public void onItemSelected(AdapterView<?> parentView, View selectedItemView,
					int position, long id) {
				switcher.setDisplayedChild(position);
			}
			@Override
			public void onNothingSelected(AdapterView<?> arg0) {
			}
		});
		adapter = new CustomAdapter(this, R.layout.subitems,currentlist);
		subitemsView = (ListView)findViewById(R.id.subItemList);
		subitemsView.setAdapter(adapter);
		
		dao = new LanmaoDAO(getApplicationContext());
		
		
		
	}
	
	 public void sayHello(View v) {
		 ViewSwitcher switcher = (ViewSwitcher)findViewById(R.id.viewSwitcher1);
		 switcher.setDisplayedChild(1);
	 }
	 
	 public void saveOutCome(View v) {
		 OutCome oc = new OutCome();
		 oc.setDesc(((EditText)findViewById(R.id.ocdesc)).getEditableText().toString());
		 oc.setTotal(new Float(((EditText)findViewById(R.id.octotal)).getEditableText().toString()));
		 oc.setType(((Spinner)findViewById(R.id.octype)).getSelectedItem().toString());
		 oc.setMethod(((Spinner)findViewById(R.id.ocmethod)).getSelectedItem().toString());
		 oc.setUpdated(new Date());
		 DatePicker dp = (DatePicker)findViewById(R.id.ocdate);
		 oc.setDate(new Date(dp.getYear(), dp.getMonth(), dp.getDayOfMonth()));
		 dao.insertOutCome(oc);
		 //oc.setMethod((findViewById(R.id.ocdate)));
	 }
	 
	 
	 public void addNewItem(View v) {
		 EditText descText = (EditText)findViewById(R.id.subdesc);
		 EditText countText = (EditText)findViewById(R.id.subcount);
		 Spinner catText = (Spinner)findViewById(R.id.subcat);
		 OutComeListItem li = new OutComeListItem(descText.getEditableText().toString(), countText.getEditableText().toString(), catText.getSelectedItem().toString());
		 currentlist.add(li);
		 adapter.notifyDataSetChanged();
		 Utils.setListViewHeightBasedOnChildren(subitemsView);
		 
		 descText.setText("");
		 countText.setText("");
	 }
	
	 
	 class CustomAdapter  extends ArrayAdapter<OutComeListItem> {
		public CustomAdapter(Context context, int textViewResourceId,
				List<OutComeListItem> objects) {
			super(context, textViewResourceId, objects);
			// TODO Auto-generated constructor stub
		}

		public CustomAdapter(Context context, int resource,
				int textViewResourceId, List<OutComeListItem> objects) {
			super(context, resource, textViewResourceId, objects);
		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			
			View v;
			final OutComeListItem rowData= getItem(position);
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


