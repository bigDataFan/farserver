package com.orc.service
{
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
		}
		
		
		public function setRoot(root:String):void {
			rootFolder = root;
			ConfigUtils.writeProp("root", rootFolder);
		}
		
	}
	
}