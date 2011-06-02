package com.orc.service
{
	public class TaggingService
	{
		
		private var dataService:DataService;
		
		public function TaggingService(ds:DataService) {
			this.dataService = ds;
		}
		
		public function addTag(type:String , entry:String, tagName:String):void {
			
			//add entry to tag
			var tags:DataCollection = dataService.getCollection("tags.db");
			
			var entryTag:Object = new Object();
			entryTag["type"] = type;
			entryTag["entry"] = entry;
			entryTag["id"] = type + ":" + entry;
			
			
			
			tags.insert(entryTag);
		} 
		
		public function removeEntryTag(type:String , entry:String, tagName:String):void {
			var tags:DataCollection = dataService.getCollection("tags.db");
			
			var entryTag:Object = new Object();
			entryTag["type"] = type;
			entryTag["entry"] = entry;
			entryTag["tagName"] = tagName;
			
			
			tags.remove(entryTag);
		}
		public function removeEntryAllTags(type:String , entry:String):void {
			var tags:DataCollection = dataService.getCollection("tags.db");
			
			var entryTag:Object = new Object();
			entryTag["type"] = type;
			entryTag["entry"] = entry;
			tags.remove(entryTag);
		}
		
		public function getEntryTags(type:String , entry:String):Array {
			var tags:DataCollection = dataService.getCollection("tags.db");
			
			var entryTag:Object = new Object();
			entryTag["type"] = type;
			entryTag["entry"] = entry;
			return tags.findAll(entryTag);
		}
		
	}
}