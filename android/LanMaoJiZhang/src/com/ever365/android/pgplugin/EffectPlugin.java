package com.ever365.android.pgplugin;

import org.json.JSONArray;
import org.json.JSONException;

import com.ever365.android.lanmao.CurrentLocation;
import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;

public class EffectPlugin extends Plugin {
	
	@Override
	public PluginResult execute(String arg0, JSONArray arg1, String arg2) {
		JSONArray result = new JSONArray();
		System.out.println("plugin");
		try {
			CurrentLocation.currentLocation = arg1.getString(0);
		} catch (JSONException e) {
			
		}
		
		/*
		 new Thread(new Runnable(){
		        public void run(){
		            final SampleView hands = new SampleView(webView.getContext());
		            webView.post(new Runnable(){
		                public void run(){
		                	Animation hyperspaceJumpAnimation = AnimationUtils.loadAnimation(super.ctx.getApplicationContext(), R.anim.layout_animation_row_left_slide);
		                }
		            });
		        }
		    }).start();
		 */
		/*
		Animation hyperspaceJumpAnimation = AnimationUtils.loadAnimation(super.ctx.getApplicationContext(), R.anim.layout_animation_row_left_slide);
		
		super.webView.startAnimation(hyperspaceJumpAnimation);
		try {
			webView.loadUrl(arg1.getString(0));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		*/
		return new PluginResult(PluginResult.Status.OK, result);
	}

}


