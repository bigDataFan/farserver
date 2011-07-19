package com.orc.service.sync.ftp
{
	import com.elfish.ftp.core.Client;
	import com.orc.service.DataService;
	import com.orc.service.file.FileService;
	import com.orc.service.sync.Synchronizer;
	
	public class FileFtpSynchronizer implements Synchronizer
	{
		private var synchronizedb;
		private var fileSerice:FileService;
		private var client:Client;
		
		public function FileFtpSynchronizer(ds:DataService)
		{
			synchronizedb = ds.getCollection("ftpsynchronize.db");
		}
		
	}
}