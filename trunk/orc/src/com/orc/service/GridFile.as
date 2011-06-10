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
			
			["_default",
				"acp",
				"asf",
				"avi",
				"bmp",
				"csv",
				"cab",
				"doc",
				"docx",
				"eml",
				"exe",
				"ftl",
				"gif",
				"htm",
				"html",
				"jp2",
				"jpe",
				"jpeg",
				"jpg",
				"jpm",
				"jpx",
				"js",
				"lnk",
				"mp2",
				"mp3",
				"mp4",
				"mpeg",
				"mpg",
				"msg",
				"odf",
				"odg",
				"odp",
				"ods",
				"odt",
				"pdf",
				"png",
				"ppt",
				"pptx",
				"psd",
				"rtf",
				"shtml",
				"swf",
				"tif",
				"tiff",
				"txt",
				"url",
				"wmv",
				"wpd",
				"xdp",
				"xdp",
				"png",
				"xls",
				"xml",
				"xsd",
				"xsl",
				"gz",
				"tar",
				"zip"];
		
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
				return "filetypes32/" + file.extension.toLowerCase() + ".gif";
			} else {
				return "filetypes32/_default.gif"
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