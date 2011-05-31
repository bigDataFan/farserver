package com.fx
{
	import flash.events.TimerEvent;
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import flash.net.FileReference;
	import flash.utils.Dictionary;
	import flash.utils.Timer;
	
	import mx.collections.ArrayCollection;
	import mx.collections.ArrayList;
	import mx.controls.Alert;
	import mx.formatters.DateFormatter;
	import mx.formatters.Formatter;

	public class FileService
	{
		
		//var timer:Timer = new Timer(20000);
		var dates:Array = new Array();
		var dateDic:Dictionary = new Dictionary();
		
		var rootFolder:File;
		
		public function FileService(config:ConfigService)
		{
			
			var basePath:String = config.rootFolder; 
			
			if (basePath!=null) {
				init(new File(basePath));	
			}

		}
		
		public function getRootFolder():String {
			if (rootFolder==null) {
				return "";
			} else {
				return rootFolder.nativePath;
			}
		}
		
		public function getDays():Array {
			return dates;
		}
		
		public var usefullFolder:String;
		public var todayPath:String;
		public var notesPath:String;
		public var contentPath:String;
		
		public function init(root:File) : void {
			this.rootFolder = root;
			var date:Date = new Date();
			
			todayPath = rootFolder.nativePath + "/" + formatFolder(date);
			var todayFolder:File = new File(todayPath);
			todayFolder.createDirectory();
			
			usefullFolder =  rootFolder.nativePath + "/常用文件"; 
			var usefull:File = new File(usefullFolder);
			usefull.createDirectory();
			
			notesPath = rootFolder.nativePath + "/便笺";
			var notesFolder:File = new File(notesPath);
			notesFolder.createDirectory();
			
			contentPath = rootFolder.nativePath + "/contents";
			var contentFolder:File = new File(contentPath);
			contentFolder.createDirectory();
			
			
			if (dates.length==0) {
				var children:Array = rootFolder.getDirectoryListing();
				for (var i:int = 0; i < children.length; i++) {
					var folder:File = children[i] as File;
					if (folder.name.match(/[2,9][0,1][0-9][0-9]年/i)) {
						scanMonth(folder);
					}
				}
				dates.reverse();
			}
		}
		
		
		function scanMonth(folder:File) {
			var children:Array = folder.getDirectoryListing();
			for (var i:int = 0; i < children.length; i++) {
				var child:File = children[i] as File;
				if (child.name.match(/\d{1,2}月/i)) {
					scanDay(child);
				}
			}
		}

		private var today:Date = new Date();
		function scanDay(folder:File) {
			var children:Array = folder.getDirectoryListing();
			for (var i:int = 0; i < children.length; i++) {
				var child:File = children[i] as File;
				if (child.name.match(/\d{1,2}日/i)) {
					var o:Object = new Object();
					
					
					var year:Number = new Number(child.parent.parent.name.substr(0,4));
					var month:Number = new Number(child.parent.name.substr(0,2));
					var day:Number = new Number(child.name.substr(0,2));
					
					if (today.getFullYear()==year && (today.getMonth()+1)==month && today.getDate()==day) {
						o["label"] = "今日";	
					} else {
						o["label"] = child.parent.parent.name + child.parent.name + child.name;
					}
					
					o["path"] = child.nativePath;
					dates.push(o);
				}
			}
		}
		
		
		function scanDateDic(root:File) {
			if (root.isDirectory) {
				var children:Array = root.getDirectoryListing();
				for (var i:int = 0; i < children.length; i++) 
				{
					var child:File = children[i] as File;
					if (child.isDirectory) {
						if (child.nativePath.match(/[*\/]年[*\/]月[*\/]日/i)) {
							dates.push(child.parent.parent.name + "-" + child.parent.name + "/" + child.name);							
						} else {
							scanDateDic(child);
						}
					}
					
				}
			}			
		}
		
		private var currentDateStr:String;
		public function getDateFileList(dateStr:String):ArrayList {
			
			if (dateStr==null) dateStr = currentDateStr;
			
			currentDateStr = dateStr;
			
			
			var folder:File = new File(dateStr);
			var children:Array = folder.getDirectoryListing();
			
			var result: ArrayList = new ArrayList();
			for (var i:int = 0; i < children.length; i++) 
			{
				result.addItem(new GridFile(children[i] as File));	
			}
			return result;
			 //var y:String = dateStr.indexOf("年");
			 //var m:String = dateStr.indexOf("月");
			 //var d:String = dateStr.indexOf("日");
		}
		
		
		public function getUsefullFileList():ArrayList {
			
			var folder:File = new File(usefullFolder);
			var children:Array = folder.getDirectoryListing();
			
			var result: ArrayList = new ArrayList();
			for (var i:int = 0; i < children.length; i++) 
			{
				result.addItem(new GridFile(children[i] as File));	
			}
			return result;
			//var y:String = dateStr.indexOf("年");
			//var m:String = dateStr.indexOf("月");
			//var d:String = dateStr.indexOf("日");
		}
		
		public function formatFolder(date:Date):String {
			return date.getFullYear() + "年/" 
				+ (((date.getMonth()+1)<10)?("0"+ (date.getMonth()+1)): (date.getMonth()+1)) + "月/" 
				+ ((date.getDate()<10)?("0"+date.getDate()):date.getDate()) + "日"
			
		}
		
		public function organizeFolder(root:File) : void {
			var children:Array = root.getDirectoryListing();
			for (var i:int = 0; i < children.length; i++) {
				var child:File = children[i] as File;
				if (child.isDirectory) {
					//scanAndAddFiles(root,child);
				} else {
					var modified:Date = child.modificationDate;
					var folderPath:String = root.nativePath + "/" + formatFolder(modified) + "/" + child.name;
					var dateFolder:File = new File(folderPath);
					//dateFolder.createDirectory();
					var fr:FileReference = new FileReference();
					try {
						child.moveTo(dateFolder, false);
						//child.copyTo(dateFolder, false);
					} catch (e:Error) {
						//do nothing
					}
				}
				
			}
		}
		
		
		
		public function putContent(id:String, content:String) : File {
			var filePath:String = contentPath + "/" + id + "bin";
			var stream:FileStream = new FileStream();
			stream.open(new File(filePath),FileMode.WRITE);
			stream.writeUTFBytes(content);
			stream.close();
			return new File(filePath);
		}
		
		public function getContent(id:String): String {
			var filePath:String = contentPath + "/" + id + "bin";
			
			try {
				var fs:FileStream = new FileStream();
				fs.open(new File(filePath), FileMode.READ);
				var text:String = fs.readUTFBytes(fs.bytesAvailable);
				fs.close();
				return text;
			} catch(e:Error) {
				
			}
			return "";
		}
		
		
		
	}
}