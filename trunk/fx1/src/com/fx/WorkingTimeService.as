package com.fx
{
	import flash.filesystem.File;

	public class WorkingTimeService
	{
		private var dataService:DataService;
		
		
		public function WorkingTimeService(ds:DataService) {
			dataService = ds;
		}
		
		private function getWorkTimeFolderForDay(date:Date):File {
			var path:File = fileService.rootFolder.resolvePath(fileService.formatFolder(date) + "/worktime");
			path.createDirectory();
			return path;
		}
		
		public function createStartWork(String title, String desc, Boolean start):Long {
			
			dataService.getCollection();
			var todayFolder:File = getWorkTimeFolderForDay(new Date());
			
		}
		
		public function updateWork(Long id, String title):void {
			
		}
		
		public function startWork(Long id):void {
			
		}
		
		public function stopWork(Long id):void {
			
		}
		
		
		public function getWorks(Date day):Array {
			
		}
		
		public function removeWork(Long id):void {
			
		}
		
	}
}