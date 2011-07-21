package com.orc.service.sync.ftp
{
	import com.elfish.ftp.core.Client;
	import com.elfish.ftp.core.FtpListener;
	import com.elfish.ftp.model.Response;
	import com.elfish.ftp.status.ResponseStatus;
	import com.elfish.ftp.worker.CwdWorker;
	import com.elfish.ftp.worker.IWorker;
	import com.elfish.ftp.worker.MkdWorker;

	public class MakeFolderTask implements FtpListener, FtpTask
	{
		public var path:String;
		public var ftpClient:Client;
		public var listener:FtpListener;
		
		public function MakeFolderTask()
		{
		}
		

		public function execute():void {
			ftpClient.setDirectory(path, this);
		}
		
		private var currentPath: String = "";
		
		public function tell(worker:IWorker, resp:Response):void {
			
			if (worker is CwdWorker) {
				if (resp.code==ResponseStatus.CWD.SUCCESS) {
					if ((worker as CwdWorker).name==path) {
						listener.tell(worker, resp);
					} else {
						currentPath = getNextPath(currentPath, path);
						ftpClient.setDirectory(currentPath, this);
					}
				} else {
					if (currentPath=="") {
						currentPath = getNextPath(currentPath, path);
						ftpClient.setDirectory(currentPath, this);
					} else {
						ftpClient.createDirectory(currentPath, this);
					}
				}
			} else if (worker is MkdWorker) {
				if ((worker as MkdWorker).name==path) {
					listener.tell(worker, resp);
				} else {
					currentPath = getNextPath(currentPath, path);
					ftpClient.createDirectory(currentPath, this);
				}
			}
		}
		
		
		function getNextPath(src:String, target:String):String {
			
			if (src==target) return src;
			
			if (target.indexOf(src)>-1) {
				var remains:String = target.substr(src.length + 1);
				var pos:int = remains.indexOf("/");
				if (pos>-1) {
					return src + "/" + remains.substr(0,pos);			
				} else {
					return src + "/" + remains;
				}
			}
			return src;
		}
		
		
	}
}