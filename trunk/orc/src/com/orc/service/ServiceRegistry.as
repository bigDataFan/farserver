package com.orc.service
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
			
			dataService = new DataService(configService.rootFolder);

			fileService = new FileService(configService);
			//notesService = new NotesService(configService);
			
			taggingService = new TaggingService(dataService);
			notesService = new NotesService(dataService, fileService);
			
		}
		
		
		
		public  function init() {
			
			
			
		}
		
	}
}