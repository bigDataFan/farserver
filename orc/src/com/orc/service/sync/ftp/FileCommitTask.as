package com.orc.service.sync.ftp
{
	import com.elfish.ftp.core.Client;
	import com.elfish.ftp.core.FtpListener;
	import com.elfish.ftp.model.Response;
	import com.elfish.ftp.worker.IWorker;
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
		
		public function tell(worker:IWorker, resp:Response):void {
			var o:Object = new Object();
			o["path"] = file.nativePath;
			o["modified"] = file.modificationDate;
			synchronizedb.insert(o);
			listener.tell(worker, resp);	
		}
		
		
		public function execute():void
		{
			ftpClient.upload(file.name, file, this);		
		}
	}
}