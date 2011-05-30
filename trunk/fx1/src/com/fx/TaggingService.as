package com.fx
{
	public class TaggingService
	{
		
		private var dataService:DataService;
		
		public function TaggingService(ds:DataService) {
			this.dataService = ds;
		}
		
		public function addEntry(String type, String id):void {
			coll = dataService.getCollection(type);
			
		}
		
		public function addTag(String type, String id, String tag):void {
			
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