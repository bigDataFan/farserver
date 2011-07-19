package com.orc.service.sync
{
	
	public interface Synchronizer
	{
		function isReady():Boolean;
		
		function getStatus(o:Object):int; //0 local  1 modified   2   sync to server  3 conflict
		function commit(o:Object):void;
		
		function updateAll():void;
		function remove(o:Object):void;
		
	}
}