package com.orc.service.sync.ftp
{
	import air.net.ServiceMonitor;
	
	import com.elfish.ftp.core.Client;
	import com.elfish.ftp.model.Config;
	import com.orc.service.DataCollection;
	import com.orc.service.DataService;
	import com.orc.service.ServiceRegistry;
	import com.orc.service.file.FileService;
	import com.orc.service.sync.Synchronizer;
	
	import flash.filesystem.File;
	
	import mx.collections.ArrayList;
	
	import spark.components.Label;
	
	public class FileFtpSynchronizer implements Synchronizer, FtpListener
	{
		private var synchronizedb:DataCollection;
		private var fileSerice:FileService;
		private var client:Client;
		
		public var ready:Boolean = false;
		

		public var ftp_ip:String;
		public var ftp_port:String;
		public var ftp_user:String;
		public var ftp_pwd:String;
		public var ftp_path:String;

		public var output:Label;
		
		
		public function FileFtpSynchronizer(ip:String, port:String, user:String, pwd:String, path:String) {
			ftp_ip = ip;
			ftp_port = port;
			ftp_user = user;
			ftp_pwd = pwd;
			ftp_path = path;
		}
		
		public function check():void {
			var config:Config = new Config(ftp_ip, 
				ftp_port, 
				ftp_user,
				ftp_pwd);
			
			client = new Client();
			client.listener = this;
			client.connect(config);
		}
		
		private var currentPath: String = "";
		
		public function tell(cmd:String ,result:Object):void {
			
			output.text = cmd;
			
			if (cmd==Client.IO_ERROR) {
				return;
			}
			
			
			//处理登陆ftp、转到指定目录的相关处理
			if (!ready) {
				
				if (cmd==Client.LOGIN_SUCCESS) {
					var mft : MakeFolderTask = new MakeFolderTask();
					mft.ftpClient = client;
					mft.listener  = this;
					mft.path = ftp_path;
					client.listener = mft;
					mft.execute();
				}
				
				if (cmd==TaskMessage.TASK_OK) {
					ready = true;
					synchronizedb = ServiceRegistry.dataService.getCollection("ftpsynchronize.db");
					ServiceRegistry.fileService.ftpSync = this;
					ServiceRegistry.fileService.ftpuploadToSync();
				}
			}
			
			if (ready) {
				running = false;
				if (cmd==TaskMessage.TASK_OK && result==true) {
					popRun();	
				}
			}
		}
		
		public function isReady():Boolean {
			return ready;
		}
		
		
		//0 local  1 modified   2   sync to server  3 conflict
		public function getStatus(o:Object):int {
			if (!ready) return -1;
			
			if (o is File) {
				var file:File = o as File;
				var pf:Object = synchronizedb.findOne({"path":file.nativePath});
				if (pf==null) {
					return 	0;			
				}
				
				if ((pf["modified"] as Date)==file.modificationDate) {
					return 2;
				}
				
				if ((pf["modified"] as Date)!=file.modificationDate) {
					return 1;
				}
			}
			return 0;
		}
		
		public function commit(o:Object):void {
			if (!ready) return;
			
			if (o is File) {
				var file:File = o as File;
				var filePath:String = ftp_path + "/" + file.parent.nativePath.substr(ServiceRegistry.configService.rootFolder.length+1).replace(/\\/g,"/");
				
				
				var pf:Object = synchronizedb.findOne({"path":file.nativePath});
				
				
				
				if (pf==null) {
					var mft:MakeFolderTask = new MakeFolderTask();
					mft.ftpClient = client;
					mft.path = filePath;
					mft.listener = this;
					tasks.source.push(mft);
					
					var fct:FileCommitTask = new FileCommitTask();
					fct.listener = this;
					fct.ftpClient = client;
					fct.file = file;
					fct.relativePath = filePath;
					fct.synchronizedb = synchronizedb;
					tasks.source.push(mft);
					
					
				} else if ((pf["modified"] as Date)==file.modificationDate) {
					return ;
				} else if ((pf["modified"] as Date)!=file.modificationDate) {
					return;
				}
			}
			
			popRun();
			
			
		}
		
		
		public function updateAll():void {
			
		}
		
		public function remove(o:Object):void {
			
		}
		
		private var running:Boolean = false;
		private var tasks:ArrayList = new ArrayList();
		
		
		public function popRun() {
			if (!running && tasks.length>0) {0
				var nextTask:FtpTask = tasks.source.shift() as FtpTask;
				if (nextTask!=null) {
					running = true;
					nextTask.execute();
				}
			}
		}
	}
}