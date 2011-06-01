package com.orc.utils
{
	import mx.formatters.DateFormatter;

	public class TimeRelatedId
	{
		public static const ID:String = "id";
		
		public var date:Date;		
		
		public function TimeRelatedId()
		{
			date = new Date();
		}
		
		
		public static function fromString(id:String):TimeRelatedId {
			id  = id.substr(2);
			var tri:TimeRelatedId = new TimeRelatedId();
			tri.date = new Date();
			tri.date.time = parseInt(id);
			return tri;
		}
		
		public function toString():String {
			return ID + date.time;
		}
	}
}