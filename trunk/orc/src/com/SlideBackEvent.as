package com
{
	import flash.events.Event;
	
	public class SlideBackEvent extends Event
	{
		
		public function SlideBackEvent(bubbles:Boolean=false, cancelable:Boolean=false)
		{
			super(BACK, bubbles, cancelable);
		}
		
		
		public static const BACK = "switchback";
		
		override public function get type():String
		{
			return BACK;
		}
		
	}
}