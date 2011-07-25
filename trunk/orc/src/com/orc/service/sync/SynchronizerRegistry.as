package com.orc.service.sync
{
	import com.orc.service.ConfigService;
	import com.orc.service.ServiceRegistry;
	import com.orc.service.sync.ftp.FileFtpSynchronizer;

	public class SynchronizerRegistry
	{
		private var synchronizer:Array  = new Array();
		public function SynchronizerRegistry(configService:ConfigService)
		{
			
			if (configService.ftp_ip!=null && configService.ftp_port!=null && configService.ftp_path!=null 
			 && configService.ftp_user!=null &&configService.ftp_pwd!=null) {
				var ftpsync: FileFtpSynchronizer = new FileFtpSynchronizer(configService.ftp_ip, 
						configService.ftp_port, configService.ftp_user,configService.ftp_pwd, configService.ftp_path);
				ftpsync.check();
				ServiceRegistry.fileService.ftpSync  = ftpsync;
			}
			
			
			
		}
		
	}
}