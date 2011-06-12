package com.orc.service
{
	public class LogService
	{

		private var configService:ConfigService;
		private var dataService:DataService;
		public function LogService(c:ConfigService)
		{
			configService = c;
		}
		
		public function log(msg:String, src:String) : void {
						
		}
		
		
	}
}