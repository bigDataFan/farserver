package com.fx
{
	import flash.events.TimerEvent;
	import flash.filesystem.File;
	import flash.net.FileReference;
	import flash.utils.Dictionary;
	import flash.utils.Timer;
	
	import mx.collections.ArrayCollection;
	import mx.collections.ArrayList;
	import mx.controls.Alert;

	public class FileService
	{
		
		//var timer:Timer = new Timer(20000);
		var dates:Array = new Array();
		var dateDic:Dictionary = new Dictionary();
		
		var rootFolder:File;
		
		public function FileService()
		{
		}
		
		public function getDays():Array {
			return dates;
		}
		
		public function init(root:File) : void {
			this.rootFolder = root;
			var children:Array = rootFolder.getDirectoryListing();
			for (var i:int = 0; i < children.length; i++) {
				var folder:File = children[i] as File;
				if (folder.name.match(/[2,9][0,1][0-9][0-9]年/i)) {
					scanMonth(folder);
				}
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
		
		function scanDay(folder:File) {
			var children:Array = folder.getDirectoryListing();
			for (var i:int = 0; i < children.length; i++) {
				var child:File = children[i] as File;
				if (child.name.match(/\d{1,2}日/i)) {
					var o:Object = new Object();
					o["label"] = child.parent.parent.name + child.parent.name + child.name;
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
		
		
		public function getDateFileList(dateStr:String):ArrayList {
			
			var folder:File = new File(dateStr);
			return new ArrayList(folder.getDirectoryListing());
			
			 //var y:String = dateStr.indexOf("年");
			 //var m:String = dateStr.indexOf("月");
			 //var d:String = dateStr.indexOf("日");
		}
		
		
		public function organizeFolder(root:File) : void {
			var children:Array = root.getDirectoryListing();
			for (var i:int = 0; i < children.length; i++) {
				var child:File = children[i] as File;
				if (child.isDirectory) {
					//scanAndAddFiles(root,child);
				} else {
					var modified:Date = child.modificationDate;
					var folderPath:String = root.nativePath + "/" + modified.getFullYear() + "年/" + (modified.getMonth()+1) + "月/" + modified.getDate() + "日/" + child.name;
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
		
		/*
		public function scanAndAddFiles(root:File) : void {
			
			if (folder.name.match(/[2,9][0,1][0-9][0-9]年/i)) {
				return;
			}
			var children:Array = folder.getDirectoryListing();
			for (var i:int = 0; i < children.length; i++) {
				var child:File = children[i] as File;
				if (child.isDirectory) {
					//scanAndAddFiles(root,child);
				} else {
					var modified:Date = child.modificationDate;
					var folderPath:String = root.nativePath + "/" + modified.getFullYear() + "年/" + (modified.getMonth()+1) + "月/" + modified.getDate() + "日/" + child.name;
					var dateFolder:File = new File(folderPath);
					//dateFolder.createDirectory();
					var fr:FileReference = new FileReference();
					try {
						child.copyTo(dateFolder, false);
					} catch (e:Error) {
						//do nothing
					}
				}
				
			}
			
		}
		*/
		
		
		
	}
}