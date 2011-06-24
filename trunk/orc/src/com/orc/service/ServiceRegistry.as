package com.orc.service
{
	import com.orc.service.task.LocalTaskService;
	import com.orc.service.task.TaskService;
	import com.orc.service.file.FileService;

	public class ServiceRegistry
	{
		public var configService:ConfigService;
		public var fileService:FileService;
		public var notesService:NotesService;
		public var dataService:DataService;
		
		public var taggingService:TaggingService;
		public var taskService:TaskService;
		
		
		public function ServiceRegistry() {
			configService = new ConfigService();
			
			dataService = new DataService(configService.rootFolder);

			fileService = new FileService(configService, dataService);
			//notesService = new NotesService(configService);
			
			taggingService = new TaggingService(dataService);
			notesService = new NotesService(dataService, fileService);
			
			taskService = new LocalTaskService(this);
			
		}
		
		
		
		public  function init() {
			
			
			
		}
		
	}
}