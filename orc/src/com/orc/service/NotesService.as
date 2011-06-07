package com.orc.service
{
	import com.orc.utils.FormatUtils;
	import com.orc.utils.TimeRelatedId;
	
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;

	public class NotesService
	{
		private var dataService:DataService;
		private var fileService:FileService;
		
		private var notesdb:DataCollection;
		
		public function NotesService(ds:DataService, fs:FileService)
		{
			this.dataService = ds;
			this.fileService = fs;
			notesdb = dataService.getCollection("notes.db");
		}
		
		
		public function getNotesList():Array {
			
			return notesdb.findAll(null);
			
			/*
			notesdb.getNotesList();
			
			
			var notesFolder:File = new File(notesPath);
			
			var list:Array = notesFolder.getDirectoryListing();
			
			var result:Array = new Array();
			for each (var file:File in list) {
				var o:Object = new Object();
				o["title"] = file.name.substr(0,file.name.length-5);
				o["created"] = FormatUtils.formatDate(file.creationDate);
				o["modified"] = FormatUtils.formatDate(file.modificationDate);
				o["size"] = file.size;
				
				//var tags:Array = taggingService.getEntryTags("notes", o["title"]);
				
				result.push(o);				
			}
			return result;
			*/
		}
		
		public function removeNotes(id:String):void {
			notesdb.remove({"id":id});
		}
		
		
		public function saveNote(o:Object):void {
			fileService.putContent(o["id"], o["content"]);
			o["content"] = null;
			o["modified"] = new Date();
			notesdb.upsert({"id":o["id"]}, o);
		}
		
		public function addNotesTag(id:String, tag:String) :void {
			var notesdb:DataCollection = dataService.getCollection("notes.db");
		}
		
		public function createNotes(title:String, text:String):String {
			
			if (title==null || title=="") {
				title = "未命名";
			}
			var id:String = new TimeRelatedId().toString();
			//var newTitle:String = getNewNotesTitle(title);
			var o = new Object();
			o["title"] = title;
			o["created"] = new Date();
			o["modified"] = new Date();
			o["size"] = text.length;
			o["id"] = id;
			
			fileService.putContent(id, text);
			
			notesdb.insert(o);
			return id;
		}
		
		public function getNote(id:String) :Object {
			return notesdb.findOne({"id":id});
		}
		
		public function getNotesContent(id:String):String {
			return fileService.getContent(id);
		}
		
	}
}