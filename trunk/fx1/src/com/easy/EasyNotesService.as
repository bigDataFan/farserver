package com.easy
{
	import com.fx.DataCollection;
	import com.fx.DataService;
	import com.fx.FileService;

	public class EasyNotesService
	{
		private var dataService:DataService;
		private var fileService:FileService;
		private var notes:DataCollection;
		
		public function EasyNotesService( ds:DataService, fs:FileService) {
			dataService = ds;
			fileService = fs;
			ds.getCollection("notes.db");
		}
		
		
		public function getNotesList():Array {
			return notes.findAll(null);	
		}
		
		public function removeNotes(id:String):void {
			var o:Object = new Object();
			o["id"] = id;
			notes.remove(o);
		}
		
		
		
		public function createNotes(title:String, text:String):String {
			var o:Object = new Object();
			o["id"] = "created-" + new Date().time;
			o["title"] = title;
			o["created"] = new Date();
			o["modified"] = new Date();
			o["length"] = text.length;
			
			notes.insert(o);
			fileService.putContent(o["id"], text);
			return o["id"];
		}
		
		
		public function updateNotes(title:String, text:String) :void {
		
	}
}