package com.orc.service
{
	import flash.filesystem.File;
	import flash.system.System;

	public class GridFile
	{
		public var file:File;
		
		
		public const recent:Number = 10*60*1000;
		
		public const min60:Number = 60*60*1000;
		
		var icons1:Array = 
			["ac3","ai","aiff","asf","au","avi","bat","bin","bmp","cab","cal","cat","cur","dat","dcr","der","dic","dll","doc","docx","dvd","dwg","dwt","fon","gif","hlp","hst","html","ico","ifo","inf","ini","java","jif","jpg","log","m4a","mmf","mmm","mov","mp2","mp2v","mp3","mp4","mpeg","msp","pdf","ppt","pptx","psd","ra","rar","reg","rtf","theme","tiff","tlb","ttf","txt","vob","wav","wma","wmv","wpl","wri","xls","xlsx","xml","xsl","zip"];
		
		public function GridFile(f:File)
		{
			file = f;
		}
		
		public function get rawfile():File {
			return file;
		}
		
		public function get name():String {
			return file.name;
		}
		
		public function get iconpath():String {
			if (icons1.indexOf(file.extension.toLowerCase())>-1) {
				return "img/" + file.extension.toLowerCase() + ".png";
			} else {
				return "img/unknown.png"
			}
		}
		
		public function get modified():String {
			
			var now:Number = new Date().getTime();
			
			var mill:Number = file.modificationDate.getMilliseconds();
			
			if ((now-mill)<recent) {
				return "数分钟前";
			} else if ((now-mill)<min60) {
				return Math.floor((now-mill)/60000) + "分钟前";
			} else {
				return file.modificationDate.getHours() + ":" + file.modificationDate.getMinutes();
			}
		}
		
		public function get size():String {
			if (file.size<1024) {
				return file.size + "字节"; 
			} else if (file.size<1024*1024) {
				return Math.floor(file.size/1024) + "K";
			} else if (file.size<1024*1024*1024) {
				return Math.floor(file.size/(1024*1024)) + "M";
			} else {
				return Math.floor(file.size/(1024*1024*1024)) + "G";
			}
		}
		
	}
}