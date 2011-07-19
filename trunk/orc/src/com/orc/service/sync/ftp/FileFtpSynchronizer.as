package com.orc.service.sync.ftp
{
	import air.net.ServiceMonitor;
	
	import com.elfish.ftp.core.Client;
	import com.elfish.ftp.model.Config;
	import com.orc.service.DataService;
	import com.orc.service.ServiceRegistry;
	import com.orc.service.file.FileService;
	import com.orc.service.sync.Synchronizer;
	
	import spark.components.Label;
	
	public class FileFtpSynchronizer implements Synchronizer
	{
		private var synchronizedb;
		private var fileSerice:FileService;
		private var client:Client;
		
		public var ready:Boolean = false;
		

		private var ftp_ip:String;
		private var ftp_port:String;
		private var ftp_user:String;
		private var ftp_pwd:String;
		private var ftp_path:String;

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
			client.ftpSync = this;
			client.connect(config);
		}
		
		private var currentPath: String = "";
		
		public function commandResult(cmd:String ,result:Object):void {
			
			output.text = cmd;
			
			
			if (cmd==Client.IO_ERROR) {
				return;
			}
			
			if (!ready) {
				
				if (cmd==Client.LOGIN_SUCCESS) {
					client.setDirectory(ftp_path);
				}
				
				if (cmd==Client.CWD_SUCCESS) {
					if (result.toString()==ftp_path) {
						ready = true;
						synchronizedb = ServiceRegistry.dataService.getCollection("ftpsynchronize.db");
					} else {
						currentPath = getNextPath(currentPath, ftp_path);
						client.setDirectory(currentPath);
					}
				}
				
				if (cmd==Client.CWD_ERROR) {
					if (currentPath=="") {
						currentPath = getNextPath(currentPath, ftp_path);
						client.setDirectory(currentPath);
					} else {
						client.createDirectory(currentPath);
					}
				}
				
				if (cmd==Client.MK_DIR) {
					if (result.toString()==ftp_path) {
						ready = true;
						synchronizedb = ServiceRegistry.dataService.getCollection("ftpsynchronize.db");
					} else {
						currentPath = getNextPath(currentPath, ftp_path);
						client.createDirectory(currentPath);
					}
				}
			
			}
		}
		
		private function getNextPath(src:String, target:String):String {
			
			if (src==target) return src;
			
			if (target.indexOf(src)>-1) {
				var remains:String = target.substr(src.length + 1);
				var pos:int = remains.indexOf("/");
				if (pos>-1) {
					return src + "/" + remains.substr(0,pos);			
				} else {
					return src + "/" + remains;
				}
			}
			return src;
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
		
		
	}}