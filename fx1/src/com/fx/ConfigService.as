package com.fx
{
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	
	import mx.resources.ResourceBundle;
	import mx.resources.ResourceManager;

	public class ConfigService
	{
		public function ConfigService() {
			
			var configFilePath:String = File.applicationStorageDirectory + "/config.properties";
			
			var configFile:File = new File(configFilePath);
			
			if (!configFile.exists) {
				var stream:FileStream = new FileStream();
				stream.open(configFile,FileMode.WRITE);
				stream.writeUTFBytes("Hello=aab");
				stream.close();
			} else {
				var fs:FileStream = new FileStream();
				fs.open(configFile, FileMode.READ);
				 = fs.readUTFBytes(fs.bytesAvailable);
				fs.close();
			}
		}
	}
	
}