package com.orc.service.file
{
	import flash.events.Event;
	
	public class FileEvent extends Event
	{
		
		public static const MODIFY = "filemodify";
		public function FileEvent(type:String, bubbles:Boolean=false, cancelable:Boolean=false)
		{
			super(MODIFY, bubbles, cancelable);
		}
		
		override public function get type():String
		{
			return MODIFY;
		}
	}
}