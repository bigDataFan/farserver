package com.orc.service
{
	import com.orc.utils.FormatUtils;
	import com.orc.utils.TimeRelatedId;
	
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import com.orc.service.file.FileService;

	[Bindable]
	public class NotesService
	{
		public static const TYPE_NOTE:String = "N";
		
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
		}
		
		public function removeNotes(id:String):void {
			notesdb.remove({"id":id});
		}
		
		
		public function saveNote(o:Object):void {
			fileService.putContent(o["id"], o["content"]);
			o["size"] = o["content"].length;
			o["content"] = null;
			o["modified"] = new Date();
			notesdb.upsert({"id":o["id"]}, o);
		}
		
		public function addNotesTag(id:String, tag:String) :void {
			var notesdb:DataCollection = dataService.getCollection("notes.db");
		}
		
		public function createNotes(title:String, text:String):Object {
			
			if (title==null || title=="") {
				title = "未命名";
			}
			var id:String = new TimeRelatedId(TYPE_NOTE).toString();
			//var newTitle:String = getNewNotesTitle(title);
			var o = new Object();
			o["title"] = title;
			o["created"] = new Date();
			o["modified"] = new Date();
			o["size"] = text.length;
			o["id"] = id;
			
			fileService.putContent(id, text);
			
			notesdb.insert(o);
			return o;
		}
		
		public function getNote(id:String) :Object {
			return notesdb.findOne({"id":id});
		}
		
		public function getNotesContent(id:String):String {
			return fileService.getContent(id);
		}
		
	}
}