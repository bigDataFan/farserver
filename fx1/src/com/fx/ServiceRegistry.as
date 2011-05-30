package com.fx
{
	public class ServiceRegistry
	{
		private static const configService:ConfigService;
		private static const fileService:FileService;
		private static const notesService:NotesService;
		private static const dataService:DataService;
		
		private static const taggingService:TaggingService;
		
		
		public function ServiceRegistry() {
			
			
		}
		
		public static function init() {
			configService = new ConfigService();
			
			fileService = new FileService(configService);
			notesService = new NotesService(configService);
			dataService = new DataService(configService.rootFolder);
			
			taggingService = new TaggingService(dataService);
			
			
		}
		
		public static function getTaggingService():TaggingService {
			
		}
	}
}