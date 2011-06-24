package com.orc.service.clipboard
{
	public interface ClipboardService
	{
		function attachObject(o:Object):void;
		
		function clear():void;
		
		function removeObject(o:Object):void;
		
		function getObjects():Array;
	}
}