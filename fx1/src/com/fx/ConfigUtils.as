package com.fx
{
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	
	public class ConfigUtils
	{
		public function ConfigUtils() {
			
		}
		
		public static var REQUEST_COUNT:int = 40;
		public static var EXTEND_COUNT:int = 50;
		
		public static function writeProp(key:String, value:String):void {
			var file:File = File.documentsDirectory.resolvePath("GCenter/config.properties");
			var fileStream:FileStream = new FileStream();
			var config:Object;
			if (!file.exists) {
				config = new Object();
			} else {
				fileStream.open(file, FileMode.READ);
				config = fileStream.readObject();
				fileStream.close();
			}
			config[key] = value;
			fileStream.open(file, FileMode.WRITE);
			fileStream.writeObject(config);
			fileStream.close();			
		}
		
		public static function readProp(key:String):String {
			var file:File = File.documentsDirectory.resolvePath("GCenter/config.properties");
			var fileStream:FileStream = new FileStream();
			var config:Object;
			if (!file.exists) {
				return null;
			} else {
				fileStream.open(file, FileMode.READ);
				config = fileStream.readObject();
				fileStream.close();
//				var jsonencode:String = fileStream.readUTFBytes(fileStream.bytesAvailable); 
//				config = JSON.decode(jsonencode); 
				var result:String = config[key];
				return result;
			}
		}
	}
}