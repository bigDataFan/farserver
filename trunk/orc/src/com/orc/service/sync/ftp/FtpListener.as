package com.orc.service.sync.ftp
{
	public interface FtpListener
	{
		
		function tell(cmd:String, o:Object):void;
		
	}
}