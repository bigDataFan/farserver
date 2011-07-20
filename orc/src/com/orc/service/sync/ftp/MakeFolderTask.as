package com.orc.service.sync.ftp
{
	import com.elfish.ftp.core.Client;

	public class MakeFolderTask implements FtpListener, FtpTask
	{
		public var path:String;
		public var ftpClient:Client;
		public var listener:FtpListener;
		
		public function MakeFolderTask()
		{
		}
		

		public function execute():void {
			ftpClient.listener = this;
			ftpClient.setDirectory(path);
		}
		
		private var currentPath: String = "";
		public function tell(cmd:String, o:Object):void {
			
			if (cmd==Client.CWD_SUCCESS) {
				
				if (o.toString()==path) {
					listener.tell(TaskMessage.TASK_OK, "OK");
				} else {
					currentPath = getNextPath(currentPath, path);
					ftpClient.setDirectory(currentPath);
				}
			}
			
			if (cmd==Client.CWD_ERROR) {
				if (currentPath=="") {
					currentPath = getNextPath(currentPath, path);
					ftpClient.setDirectory(currentPath);
				} else {
					ftpClient.createDirectory(currentPath);
				}
			}
			
			if (cmd==Client.MK_DIR) {
				if (o.toString()==path) {
					listener.tell(TaskMessage.TASK_OK, true);
				} else {
					currentPath = getNextPath(currentPath, path);
					ftpClient.createDirectory(currentPath);
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