package com.orc.service
{
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	/**
	 * 从指定文件写入或读取配置信息
	 */
	public class ConfigUtils
	{
		public function ConfigUtils() {
			
		}
		public static const CONFIG_FILE:String = "GCenter/config.properties";
		
		public static var REQUEST_COUNT:int = 40;
		public static var EXTEND_COUNT:int = 50;
		
		public static function writeProp(key:String, value:String):void {
			var file:File = File.documentsDirectory.resolvePath(CONFIG_FILE);
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
			var file:File = File.documentsDirectory.resolvePath(CONFIG_FILE);
			var fileStream:FileStream = new FileStream();
			var config:Object;
			if (!file.exists) {
				return null;
			} else {
				fileStream.open(file, FileMode.READ);
				config = fileStream.readObject();
				fileStream.close();
				var result:String = config[key];
				return result;
			}
		}
	}
}