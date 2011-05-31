package com.fx
{
	public class ServiceRegistry
	{
		public var configService:ConfigService;
		public var fileService:FileService;
		public var notesService:NotesService;
		public var dataService:DataService;
		
		public var taggingService:TaggingService;
		
		
		public function ServiceRegistry() {
			configService = new ConfigService();
			
			fileService = new FileService(configService);
			notesService = new NotesService(configService);
			dataService = new DataService(configService.rootFolder);
			
			taggingService = new TaggingService(dataService);
			
		}
		
		
		
		public  function init() {
			
			
			
		}
		
	}
}