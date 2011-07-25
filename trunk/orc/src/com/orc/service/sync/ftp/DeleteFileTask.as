package com.orc.service.sync.ftp
{
	import com.elfish.ftp.core.Client;
	import com.elfish.ftp.core.FtpListener;
	import com.elfish.ftp.model.Response;
	import com.elfish.ftp.worker.IWorker;
	
	import flash.filesystem.File;
	
	public class DeleteFileTask implements FtpListener, FtpTask
	{
		
		public var listener:FtpListener;
		public var ftpClient:Client;
		public var relativePath:String;
		public var name:String;
		
		public function DeleteFileTask()
		{
		}
		
		public function tell(worker:IWorker, resp:Response):void
		{
		}
		
		public function execute():void
		{
			ftpClient.deleteDirectory(name, true, listener);
			
		}
	}
}