package com.orc.service
{
	import com.orc.service.sync.Synchronizer;
	import com.orc.service.sync.ftp.FileFtpSynchronizer;
	
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	
	import flashx.textLayout.elements.Configuration;
	
	import mx.resources.ResourceBundle;
	import mx.resources.ResourceManager;

	public class ConfigService
	{
		public var rootFolder:String;
		public var email:String;
		public var password:String;
		
		public var dropbox_id:String;
		public var dropbox_pwd:String;
		
		public var ftp_ip:String;
		public var ftp_port:String;
		public var ftp_path:String;
		public var ftp_user:String;
		public var ftp_pwd:String;
				
		public function ConfigService() {
			rootFolder = ConfigUtils.readProp("root");
			if (rootFolder==null) {
				var file:File = File.documentsDirectory.resolvePath("layout");
				file.createDirectory();
				rootFolder = file.nativePath;
				ConfigUtils.writeProp("root", rootFolder);
			}
			
			email = ConfigUtils.readProp("email");
			password = ConfigUtils.readProp("password");
			
			dropbox_id = ConfigUtils.readProp("dropbox_id");
			dropbox_pwd = ConfigUtils.readProp("dropbox_pwd");
			
			
			ftp_ip = ConfigUtils.readProp("ftp_ip");
			ftp_port = ConfigUtils.readProp("ftp_port");
			ftp_path = ConfigUtils.readProp("ftp_path");
			ftp_user = ConfigUtils.readProp("ftp_user");
			ftp_pwd = ConfigUtils.readProp("ftp_pwd");
		}
		
		
		public function getFtpSynchronizer():Synchronizer {
			if (ftp_ip!=null) {
				var ftpSynchronizer:FileFtpSynchronizer = new FileFtpSynchronizer();
				
				return ftpSynchronizer;
			} else {
				return null;
			}
		}
		
		public function setRoot(root:String):void {
			rootFolder = root;
			ConfigUtils.writeProp("root", rootFolder);
		}
		
	}
	
}