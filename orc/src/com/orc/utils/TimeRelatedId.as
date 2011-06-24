package com.orc.utils
{
	import mx.formatters.DateFormatter;

	public class TimeRelatedId
	{
		public static const ID:String = "id";
		
		
		public var date:Date;
		public var type:String;
		
		public function TimeRelatedId(t:String)
		{
			type = t;
			date = new Date();
		}
		
		
		public static function fromString(str:String):TimeRelatedId {
			var splits:Array = str.split(".");
			
			var tri:TimeRelatedId = new TimeRelatedId(splits[0]);
			tri.date.time = parseInt(splits[2]);
			
			return tri;
		}
		
		public function toString():String {
			return type + "." + ID + "." + date.time;
		}
	}
}