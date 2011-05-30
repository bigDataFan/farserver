package com.fx
{
	public class ThreadService
	{
		private var dataService:DataService;
		public function ThreadService()
		{
			
		}
		
		public function addEvent(name:String, event:ThreadEvent): void {
			var threadCollection:DataCollection = dataService.getCollection("thread." + name);
			
			threadCollection.insert(event);
		}
		
		
		
		public function listEvent(name:String):Array {
			var threadCollection:DataCollection = dataService.getCollection("thread." + name);
			
			return threadCollection.list();
		}
	}
}