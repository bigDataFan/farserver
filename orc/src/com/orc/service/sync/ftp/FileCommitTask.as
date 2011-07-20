package com.orc.service.sync.ftp
{
	import com.elfish.ftp.core.Client;
	import com.orc.service.DataCollection;
	
	import flash.filesystem.File;

	public class FileCommitTask implements FtpListener, FtpTask
	{
		public var listener:FtpListener;
		public var ftpClient:Client;
		public var file:File;
		public var relativePath:String;
		public var synchronizedb:DataCollection;
		
		public function FileCommitTask()
		{
				
		}
		
		public function tell(cmd:String ,result:Object):void {
			
			var o:Object = new Object();
			o["path"] = file.nativePath;
			o["modified"] = file.modificationDate;
			synchronizedb.insert(o);
			listener.tell(TaskMessage.TASK_OK, true);	
		}
		
		
		public function execute():void
		{
			ftpClient.listener = this;
			ftpClient.upload(file.name, file);		
		}
	}
}