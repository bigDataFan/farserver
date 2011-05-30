package com.fx
{
	public class TaggingService
	{
		
		private var dataService:DataService;
		
		public function TaggingService(ds:DataService) {
			this.dataService = ds;
		}
		
		public function addTag(String type, String entry, String tagName):void {
			
			//add entry to tag
			var tags:DataCollection = dataService.getCollection("tags.db");
			
			var entryTag:Object = new Object():
			entryTag["type"] = type;
			entryTag["entry"] = entry;
			entryTag["tagName"] = tagName;
			
			tags.insert(entryTag);
		} 
		
		public function removeEntryTag(String type, String entry, String tagName):void {
			var tags:DataCollection = dataService.getCollection("tags.db");
			
			var entryTag:Object = new Object():
			entryTag["type"] = type;
			entryTag["entry"] = entry;
			entryTag["tagName"] = tagName;
			
			
			tags.remove(entryTag);
		}
		public function removeEntryAllTags(String type, String entry):void {
			var tags:DataCollection = dataService.getCollection("tags.db");
			
			var entryTag:Object = new Object():
			entryTag["type"] = type;
			entryTag["entry"] = entry;
			tags.remove(entryTag);
		}
		
		public function getEntryTags(String type, String entry):Array {
			var tags:DataCollection = dataService.getCollection("tags.db");
			
			var entryTag:Object = new Object():
			entryTag["type"] = type;
			entryTag["entry"] = entry;
			tags.list(entryTag);
		}
		
	
		public function renameEntry(String type, String id, String newid):void {
			
		} 
		
		public function getAllTags(String type):Array {
			return null;
		}
		
		
		public function getTagEntries(String type, String tag):Array {
			
		}
		
		
	}
}