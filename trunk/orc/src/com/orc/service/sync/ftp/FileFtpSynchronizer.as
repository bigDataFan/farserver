package com.orc.service.sync.ftp
{
	import air.net.ServiceMonitor;
	
	import com.elfish.ftp.core.Client;
	import com.elfish.ftp.model.Config;
	import com.orc.service.DataService;
	import com.orc.service.ServiceRegistry;
	import com.orc.service.file.FileService;
	import com.orc.service.sync.Synchronizer;
	
	public class FileFtpSynchronizer implements Synchronizer
	{
		private var synchronizedb;
		private var fileSerice:FileService;
		private var client:Client;
		
		public var ready:Boolean = false;
		
		
		public function FileFtpSynchronizer()
		{
			
			var config:Config = new Config(ServiceRegistry.configService.ftp_ip, 
				ServiceRegistry.configService.ftp_port, 
				ServiceRegistry.configService.ftp_user,
			
			client = new Client();
			client.ftpSync = this;
			client.connect(config);
			
			synchronizedb = ServiceRegistry.dataService.getCollection("ftpsynchronize.db");
		}
		
		
		public function tellAnswer(String cmd, Object result) {
			
		}
		
		
		
		
		public function isReady():Boolean {
			return ready;
			
		}
		
		public function getStatus(o:Object):int {
			return 0;
		}
		
		public function commit(o:Object):void {
			
		}
		
		public function updateAll():void {
			
		}
		
		public function remove(o:Object):void {
			
		}
		
		
	}
}