package com.fx
{
	public class TaggingService
	{
		
		private var dataService:DataService;
		
		public function TaggingService(ds:DataService) {
			this.dataService = ds;
		}
		
		public function addEntry(String type, String id):void {
			var entries:DataCollection = dataService.getCollection("entries");
			var entry:Object = new Object():
			entry["id"] = id;
			entry["type" = type;]
			coll.insert(o);		
		}
		
		public function addTag(String type, String id, String tagName):void {
			
			//add entry to tag
			var tags:DataCollection = dataService.getCollection(tagName);
			
			var tag:Object = tags.getByKey(tag);
			if (tag==null) {
				tag = new Object():
				tag["id"] = tag;
			}
			
			if (tag["entries"]==null) {
				tag["entries"] = new Array();
			}			
			(tag["entries"] as Array).push(id);
			
			tags.update(tag);
			
			
			//update entry
			var entries:DataCollection = dataService.getCollection("entries");
			if (entries[id]==null) {
				a
			}
			o["id"] = id;
			coll.insert(o);		
		} 
		
		public function removeEntryTag(String type, String id, String tag):void {
					
				
			
		}
		public function removeEntryAllTags(String type, String id):void {
			
		}
		
		public function getEntryTags(String type, String id):Array {
			return null;
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