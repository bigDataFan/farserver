package com.orc.service.sync.ftp
{
	import air.net.ServiceMonitor;
	
	import com.elfish.ftp.core.Client;
	import com.elfish.ftp.core.FtpListener;
	import com.elfish.ftp.model.Config;
	import com.elfish.ftp.model.Response;
	import com.elfish.ftp.status.ResponseStatus;
	import com.elfish.ftp.worker.CwdWorker;
	import com.elfish.ftp.worker.IWorker;
	import com.elfish.ftp.worker.LoginWorker;
	import com.orc.service.DataCollection;
	import com.orc.service.DataService;
	import com.orc.service.ServiceRegistry;
	import com.orc.service.file.FileService;
	import com.orc.service.sync.Synchronizer;
	import com.orc.utils.StringUtils;
	
	import flash.events.TimerEvent;
	import flash.filesystem.File;
	import flash.utils.Timer;
	
	import mx.collections.ArrayList;
	import mx.utils.StringUtil;
	
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
		
		
		public function FileFtpSynchronizer(ip:String, port:String, user:String, pwd:String, path:String, ds:DataService) {
			ftp_ip = ip;
			ftp_port = port;
			ftp_user = user;
			ftp_pwd = pwd;
			ftp_path = path;
			
			synchronizedb = ds.getCollection("ftpsynchronize.db");
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
		
		public function tell(worker:IWorker, resp:Response):void {
			
			if (worker==null && resp==null) {
				output.text = "无法连接到 " + ftp_ip + ":" + ftp_port;
				return;
				
			}
			
			//trace("ftp tell->" + resp.code + "  " + resp.text);
			output.text = resp.text;
			
			//处理登陆ftp、转到指定目录的相关处理
			if (!ready) {
				
				if ((worker is LoginWorker) && (resp.code == ResponseStatus.LOGIN.SUCCESS)) {
					var mft : MakeFolderTask = new MakeFolderTask();
					mft.ftpClient = client;
					mft.listener  = this;
					mft.path = ftp_path;
					client.listener = mft;
					mft.execute();
				}
				
				if ((resp.code==ResponseStatus.CWD.SUCCESS) || (resp.code==ResponseStatus.MKD.SUCCESS)) {
					ready = true;
					ServiceRegistry.fileService.ftpSync = this;
					ServiceRegistry.fileService.ftpuploadToSync();
					return;
				}
			} else {
				running = false;
				popRun();	
			}
		}
		
		public function isReady():Boolean {
			return ready;
		}
		
		
		//0 local  1 modified   2   sync to server  3 conflict
		public function getStatus(o:Object):int {
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
		
		public function cwd(path:String) {
						
		}
		
		public function commit(o:Object):void {
			if (o is File) {
				var file:File = o as File;
				var filePath:String = ftp_path + "/" + file.parent.nativePath.substr(ServiceRegistry.configService.rootFolder.length+1).replace(/\\/g,"/");
				
				var pf:Object = synchronizedb.findOne({"path":file.nativePath});
				
				if (pf==null) {
					var mft:MakeFolderTask = new MakeFolderTask();
					mft.ftpClient = client;
					mft.path = filePath;
					mft.basePath = ftp_path;
					mft.currentPath = ftp_path;
					mft.listener = this;
					tasks.source.push(mft);
					
					var fct:FileCommitTask = new FileCommitTask();
					fct.listener = this;
					fct.ftpClient = client;
					fct.file = file;
					fct.relativePath = filePath;
					fct.synchronizedb = synchronizedb;
					tasks.source.push(fct);
					
					
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
		
		public function remove(s:Object):void {
			if (s is String) {
				var path:String =  s as String;
				var o :Object = new Object();
				o["path"] = path;
				o["modified"] = new Date();
				o["deleted"] = true;
				synchronizedb.upsert({"path": o}, o);
				
				
				var ftpFullPath:String = ftp_path + "/" + path.substr(ServiceRegistry.configService.rootFolder.length+1).replace(/\\/g,"/");
				
				var mft:MakeFolderTask = new MakeFolderTask();
				mft.ftpClient = client;
				mft.path = StringUtils.getParentPath(ftpFullPath);
				mft.basePath = ftp_path;
				mft.currentPath = ftp_path;
				mft.listener = this;
				tasks.source.push(mft);
				
				
				
				var dt:DeleteFileTask = new DeleteFileTask();
				dt.ftpClient = client;
				dt.listener = this;
				dt.name = StringUtils.getFileName(ftpFullPath);
				
					
				
				
			}
			
			
		}
		
		private var running:Boolean = false;
		private var tasks:ArrayList = new ArrayList();
		
		
		private var timer:Timer = new Timer(30*1000);
		
		
		public function popRun() {
			if (!ready) {
				if (!timer.running) {
					timer.start();
					timer.addEventListener(TimerEvent.TIMER, function(){
						popRun();
					});
				}
			}
			if (timer.running) {
				timer.stop();
				
			}
			
			if (!running && tasks.length>0) {
				var nextTask:FtpTask = tasks.source.shift() as FtpTask;
				if (nextTask!=null) {
					running = true;
					nextTask.execute();
				}
			}
		}
	}
}