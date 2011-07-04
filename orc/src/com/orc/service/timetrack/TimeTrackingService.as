package com.orc.service.timetrack
{
	import com.orc.service.DataCollection;
	import com.orc.service.DataService;
	import com.orc.utils.FormatUtils;

	public class TimeTrackingService
	{
		
		public static const CREATED = "cr";
		public static const DURA = "dura";
		public static const LAST_START = "lastStart";
		public static const LAST_STOP = "lastStop";
		public static const DESC = "desc";
		public static const DAY = "day";
		//public static const CAT = "cat";
		
		private var tts:DataCollection;
		
		public function TimeTrackingService(ds:DataService)
		{
			tts = ds.getCollection("timetrack.db");
		}
		
		public function addTrackingItem(desc:String, cat:String):Object {
			var ti:Object = new Object();
			ti[CREATED] = new Date().getTime();
			ti[DURA] = 0;
			ti[LAST_START] = null; 
			ti[DESC] = desc;
			ti[DAY] = FormatUtils.formatYMD(new Date());
			//ti[CAT] = cat;
			tts.insert(ti);
			return ti;
		}
		
		public function removeTrackingItem(start:Number):void {
			tts.remove({"cr":start});
		}
		
		public function getDura(o:Object):String {
			if (o[LAST_START]!=null) {
				var realdura:Number = o[DURA] + (new Date().getTime()-o[LAST_START]);
				return formatDura(realdura);
			} else {
				return formatDura(o[DURA]);
			}
		}
		
		public function startTrackingItem(created:Number):void {
			var todayList:Array = getTrackingItems(new Date());

			var itemToStart:Object  = null;
			for (var i:int = 0; i < todayList.length; i++) 
			{
				stopTrackingItem(todayList[i]);
				
				if (todayList[i][CREATED]==created) {
					itemToStart = todayList[i];
					if (itemToStart[LAST_START]!=null) {
						return;
					}
				}
			}
			if (itemToStart!=null) {
				itemToStart[LAST_START] = new Date().getTime();
				
				tts.upsert({"cr":created}, itemToStart);
			}
		}
		
		public function stopTrackingItem(o:Object):void {
			if (o[LAST_START]!=null) {
				var duraToAdd:int = (new Date().getTime() - o[LAST_START])%(24*60*60*1000);
				o[DURA] = o[DURA] + duraToAdd;
				o[LAST_START] = null;
				o[LAST_STOP] = new Date().getTime();
				tts.upsert({"cr":o["cr"]}, o);
			}
		}
	
		
		public function getTrackingItems(date:Date):Array {
			var dateStr:String = FormatUtils.formatYMD(date);
			var list:Array = tts.findAll({"day":dateStr});
		
			if (FormatUtils.formatYMD(new Date())!= FormatUtils.formatYMD(date)) {
				for (var i:int = 0; i < list.length; i++) 
				{
					stopTrackingItem(list[i]);
				}
			}
			
			return list;
		}
		
		
		public static function formatDura(dura:int) : String {
			var d3 = new Date(dura);
			return ((d3.getDate()-1)*24 + (d3.getHours()-8)) + ":" 
				+ ((d3.getMinutes()<10)?("0"+d3.getMinutes()):d3.getMinutes()); 
			
		}
		
	}
}