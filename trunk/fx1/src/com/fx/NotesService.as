package com.fx
{
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;

	public class NotesService
	{
		public function NotesService(config:ConfigService)
		{
			var basePath:String = config.rootFolder;
		
			if (basePath!=null) {
				init(new File(basePath));	
			}
		}
		
		public var currentEditing:String;
		public var notesPath:String;
		
		
		public function init(root:File) : void {
			notesPath = root.nativePath + "/便笺";
			var notesFolder:File = new File(notesPath);
			notesFolder.createDirectory();
		}

		
		
		public function getNotesList():Array {
			var notesFolder:File = new File(notesPath);
			
			var list:Array = notesFolder.getDirectoryListing();
			
			var result:Array = new Array();
			for each (var file:File in list) {
				var o:Object = new Object();
				o["title"] = file.name.substr(0,file.name.length-5);
				o["created"] = FormatUtils.formatDate(file.creationDate);
				o["modified"] = FormatUtils.formatDate(file.modificationDate);
				o["size"] = file.size;
				result.push(o);				
			}
			return result;
		}
		
		public function removeNotes(title:String):void {
			var filePath:String = notesPath + "/" + title + ".html";
			new File(filePath).deleteFile();
		}
		
		
		public function editNotes(title:String):String {
			var filePath:String = notesPath + "/" + title + ".html";
			var fs:FileStream = new FileStream();
			try {
				fs.open(new File(filePath), FileMode.READ);
				var text:String = fs.readUTFBytes(fs.bytesAvailable);
				fs.close();
				currentEditing = title;
				return text;
			} catch(e:Error) {
			}
			return "";
		}
		
		public function saveNotes(title:String, text:String) :void {
			if (currentEditing==null) {
				createNotes(title,text);
			} else {
				var filePath:String = notesPath + "/" + currentEditing + ".html";
				var stream:FileStream = new FileStream();
				
				stream.open(new File(filePath),FileMode.WRITE);
				stream.writeUTFBytes(text);
				stream.close();
				
				if (title!=currentEditing) {
					var newTitle:String = getNewNotesTitle(title);
					new File(filePath).moveTo(new File(notesPath + "/" + newTitle + ".html"),false);
				}
			}
			
		}
		
		public function createNotes(title:String, text:String):String {
			
			if (title==null || title=="") {
				if (text=="") {
					return "";
				} else {
					if (text.length>30) {
						title = text.substr(0,30);
					} else {
						title = text;
					}
				}
			}
			var newTitle:String = getNewNotesTitle(title);
			
			var stream:FileStream = new FileStream();
			
			stream.open(new File(notesPath + "/" + newTitle + ".html"),FileMode.WRITE);
			stream.writeUTFBytes(text);
			stream.close();
			return newTitle;
		}
		
		public function getNewNotesTitle(title:String) : String {
			
			var filePath:String = notesPath + "/" + title + ".html";
			
			var i:Number = 0;
			var newTitle:String = title;
			while(new File(filePath).exists) {
				i = i + 1;
				newTitle =  title + "(" + i + ")";
				filePath = notesPath + "/" + newTitle + ".html";
			}
			
			return newTitle;
			
		}
		
		
	}
}