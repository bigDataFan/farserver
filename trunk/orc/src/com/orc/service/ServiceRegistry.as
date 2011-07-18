package com.orc.service
{
	import com.orc.service.file.FileService;
	import com.orc.service.task.LocalTaskService;
	import com.orc.service.task.TaskService;
	import com.orc.service.timetrack.TimeTrackingService;
	
	import org.hamster.dropbox.DropboxClient;
	import org.hamster.dropbox.DropboxConfig;

	public class ServiceRegistry
	{
		public static var configService:ConfigService = new ConfigService();
		
		public static var dataService:DataService = new DataService(configService.rootFolder);
		
		public static var fileService:FileService = new FileService(configService, dataService);
		
		public static var notesService:NotesService =  new NotesService(dataService, fileService);
		
		public static var taggingService:TaggingService =new TaggingService(dataService);
		
		public static var taskService:TaskService = new LocalTaskService(dataService);
		
		public static var trackingService:TimeTrackingService = new TimeTrackingService(dataService);
		
		
		public static var config:DropboxConfig = new DropboxConfig('', '');
		public static var dropAPI:DropboxClient = new DropboxClient(config);
		
		public function ServiceRegistry() {
			
		}
		
		public  function init() {
			
		}
		
		public static function getNotesService():NotesService {
			return notesService;
		}
	
		
		
	}
}