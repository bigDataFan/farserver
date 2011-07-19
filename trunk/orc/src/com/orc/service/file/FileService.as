package com.orc.service.file
{
	import com.orc.service.ConfigService;
	import com.orc.service.DataCollection;
	import com.orc.service.DataService;
	import com.orc.service.ServiceRegistry;
	import com.orc.utils.TimeRelatedId;
	
	import flash.events.EventDispatcher;
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import flash.net.FileReference;
	import flash.system.System;
	import flash.utils.Dictionary;
	
	import mx.charts.CategoryAxis;
	import mx.collections.ArrayCollection;
	import mx.collections.ArrayList;

	public class FileService
	{
		public static const STORAGE_END_FIX = ".sto";
		
		public static const TYPE_FILE_TYPE = "a";
		public static const TYPE_LOG_TYPE = "l";
		
		
		public static const LABEL_TODAY = "今日";
		
		var typedic:Object = new Object();
		
		var dates:Array = new Array();
		var dateDic:Dictionary = new Dictionary();
		
		var eventDispatches:Array = new Array();
		var filelogs:DataCollection;
		var filetypes:DataCollection;
		
		private var sychronizers:Array = new Array();
		
		public function FileService(config:ConfigService, ds:DataService)
		{
			
		}
		
		
		
		public function load():void {
						
			if (dates.length!=0) return;
			filelogs = ServiceRegistry.dataService.getCollection("filelogs.db");
			filetypes = ServiceRegistry.dataService.getCollection("filetypes.db");
			
			if (filetypes.findAll(null).length==0) {
				filetypes.insert(
					{
						"id" :new TimeRelatedId(TYPE_FILE_TYPE).toString(),
						"label": "文档",
						"type":".doc,.txt,.xml,.rtf,.xls",
						"icon": "doc"
					}
				);
				
				filetypes.insert({
					"id" :new TimeRelatedId(TYPE_FILE_TYPE).toString(),
					"label": "图片",
					"type":".jpg,.gif,.png,.bmp",
					"icon": "image"
				});
				
			}
			
			var basePath:String = ServiceRegistry.configService.rootFolder; 
			if (basePath!=null) {
				init(new File(basePath));	
			}
		}
				
		
		
		public function addEventDispatcher(ed:EventDispatcher):void {
			this.eventDispatches.push(ed);
		}
		
		public function addFile(file1:File) :void {
			var newFile:File = new File(todayPath + "/" + file1.name);
			//todayFolder.createDirectory();
			
			try {
				file1.copyTo(newFile, false);
				/*
				var log:Object = new Object();
				log.id = new TimeRelatedId(TYPE_LOG_TYPE).toString();
				log.filePath = todayFolder.nativePath;
				log.name = todayFolder.name;
				log.time = new Date().getTime();
				
				filelogs.insertCapped(log,1000);
				*/
				sendNotify(newFile);
			} catch (e:Error) {
				
			}
		}
		
		public function sendNotify(file1:File):void {
			var fe:FileEvent = new FileEvent(FileEvent.MODIFY);
			fe.file = new GridFile(file1);
			for (var i:int = 0; i < eventDispatches.length; i++) 
			{
				(eventDispatches[i] as EventDispatcher).dispatchEvent(fe);
			}
		}

		public function getRecentFiles(c:int):ArrayCollection {
			
			var files:Array = filelogs.list(c);
			
			var result:ArrayCollection = new ArrayCollection();
			
			for (var i:int = 0; i < files.length; i++) 
			{
				var file:File = new File(files[i]["filePath"]);
				if (file.exists) {
					result.addItem(new GridFile(file));
				}
			}
			
			
			return result;
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
		
		var rootFolder:File;
		public var todayPath:String;
		public var notesPath:String;
		
		
		public function init(root:File) : void {
			this.rootFolder = root;
			var date:Date = new Date();
			
			//创建今日的文件夹
			todayPath = rootFolder.nativePath + "/" + formatFolder(date);
			var todayFolder:File = new File(todayPath);
			todayFolder.createDirectory();
			
			
			//扫描日期文件夹  获取所有日期文件夹信息
			var children:Array = rootFolder.getDirectoryListing();
			for (var i:int = 0; i < children.length; i++) {
				var folder:File = children[i] as File;
				if (folder.name.match(/[2,9][0,1][0-9][0-9]年/i)) {
					scanMonth(folder);
				}
			}
			dates.sortOn("dateTime",Array.DESCENDING);
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
					var month:Number = new Number(child.parent.name.substr(0,child.name.indexOf("月")));
					var day:Number = new Number(child.name.substr(0,child.name.indexOf("日")));
					
					if (today.getFullYear()==year && (today.getMonth()+1)==month && today.getDate()==day) {
						o["label"] = LABEL_TODAY;	
					} else {
						o["label"] = child.parent.parent.name + child.parent.name + child.name;
					}
					o["dateTime"] = new Date(year,month,day).getTime();
					o["path"] = child.nativePath;
					dates.push(o);
				}
			}
		}

		
		public function getMonthSummaries(year:Number, month:Number):Object {
			var monthFolder:File = new File(rootFolder.nativePath + "/" + year + "年/" + (month+1) + "月");
			if (monthFolder.exists) {
				var result:Object = new Object();
				
				var listing:Array = monthFolder.getDirectoryListing();
				for (var i:int = 0; i < listing.length; i++) {
					var child:File = listing[i] as File;
					if (child.isDirectory) {
						result[child.name] = child.getDirectoryListing().length;
					}
				}
				return result;
			} else {
				return new Object();
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
				if((children[i] as File).name.indexOf(STORAGE_END_FIX)>-1) {
					continue;
				}
				result.addItem(new GridFile(children[i] as File));	
			}
			return result;
		}

				
		/*
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
		*/
		
		/*
		public function formatFolder(date:Date):String {
			return date.getFullYear() + "年/" 
				+ (((date.getMonth()+1)<10)?("0"+ (date.getMonth()+1)): (date.getMonth()+1)) + "月/" 
				+ ((date.getDate()<10)?("0"+date.getDate()):date.getDate()) + "日"
			
		}
		*/
		
		public function formatFolder(date:Date):String {
			return date.getFullYear() + "年/" 
				+ (date.getMonth()+1) + "月/" 
				+ (date.getDate()) + "日"
		}
		
		
		public function organizeFolder(root:File) : void {
			var children:Array = root.getDirectoryListing();
			for (var i:int = 0; i < children.length; i++) {
				var child:File = children[i] as File;
				if (child.isDirectory) {
					//scanAndAddFiles(root,child);
				} else {
					
					if (child.name.indexOf(".db")>-1) {
						continue;	
					}
					
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

		
		
		public function getByTypeCategory(type:String):ArrayCollection {
			
			if (this.dateDic[type]==null) {
				//列举所有文件
				
				var result:Array = new Array();
				
				var filtered:ArrayCollection = filterDir(this.rootFolder, type);
				
				for (var i:int = 0; i < filtered.length; i++) 
				{
					result[filtered.length-1-i] = new GridFile(filtered[i] as File); 
				}
				
				this.dateDic[type] = new ArrayCollection(result);
			} else {
				var ac:ArrayCollection = this.dateDic[type]  as ArrayCollection;
				
				var newresult: ArrayCollection = new ArrayCollection();
				
				for (var j:int = 0; j < ac.length; j++) 
				{
					if((ac.getItemAt(j) as GridFile).rawfile.exists) {
						newresult.addItem(ac.getItemAt(j));
					}
				}
				this.dateDic[type] = newresult;
			}
			
			return this.dateDic[type]  as ArrayCollection;
		}
		
		
		public function filterDir(dir:File, type:String):ArrayCollection {
			
			var types:Array = type.split(",");
			
			var result:ArrayCollection = new ArrayCollection();
			
			var listing:Array = dir.getDirectoryListing();
			for (var i:int = 0; i < listing.length; i++) 
			{
				var child:File = listing[i] as File;
				
				if (child.isDirectory) {
					result.addAll(filterDir(child, type));
				} else {
					var matched = false;
					for (var j:int = 0; j < types.length; j++) 
					{
						if (child.name.indexOf(types[j])>-1 ) {
							matched = true;
							break;
						}
					}
					
					if (matched) {
						result.addItem(child);
					}
				}
			}
			return result;
		}
		
		
		
		public function getAllFilesGrouped():Array {
			var result:Array = new Array();
			
			var days:Array = getDays();
			
			for (var i:int = 0; i < days.length; i++) 
			{
				var list:ArrayList = getDateFileList(days[i].path);
				if (list.length>0) {
					var grouped:Object = new Object();
					grouped["label"] = days[i].label;
					grouped["date"] = new Date(days[i].dateTime);
					grouped["children"] = list.source;
					grouped["groupName"] = days[i].label;
					result.push(grouped);
				}
			}
			return result;
		}
		
		
		public function getFileTypes():ArrayCollection {
			return new ArrayCollection(filetypes.findAll(null));
		}
		
		
		public function putContent(id:String, content:String) : File {
			var tri:TimeRelatedId = TimeRelatedId.fromString(id);
			var filePath:String = rootFolder.nativePath + "/" + formatFolder(tri.date) + "/" + id + STORAGE_END_FIX;
			var stream:FileStream = new FileStream();
			stream.open(new File(filePath),FileMode.WRITE);
			stream.writeUTFBytes(content);
			stream.close();
			return new File(filePath);
		}
		
		
		public function getContent(id:String): String {
			var tri:TimeRelatedId = TimeRelatedId.fromString(id);
			
			var filePath:String = rootFolder.nativePath + "/" + formatFolder(tri.date) + "/" + id + STORAGE_END_FIX;
			
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