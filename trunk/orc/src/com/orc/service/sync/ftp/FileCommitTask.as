package com.orc.service.sync.ftp
{
	import com.elfish.ftp.core.Client;
	
	import flash.filesystem.File;

	public class FileCommitTask implements FtpListener, FtpTask
	{
		public var listener:FtpListener;
		public var ftpClient:Client;
		public var file:File;
		public var relativePath:String;
		
		public function FileCommitTask()
		{
				
		}
		
		public function tell(cmd:String ,result:Object):void {
			listener.tell(cmd, result);	
		}
		
		
		public function execute():void
		{
			ftpClient.listener = this;
			ftpClient.upload(file.name, file);		
		}
	}
}