package com.elfish.ftp.worker
{
	import com.elfish.ftp.event.FTPEvent;
	import com.elfish.ftp.model.Command;
	import com.elfish.ftp.model.Config;
	import com.elfish.ftp.model.ControlSocket;
	import com.elfish.ftp.model.DataSocket;
	import com.elfish.ftp.model.Response;
	import com.elfish.ftp.status.CommandsStatus;
	import com.elfish.ftp.status.ResponseStatus;
	
	import flash.events.EventDispatcher;
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import flash.utils.ByteArray;
	
	////////////////////////////////////////////////////////////////////////////////
	//
	//  Copyright (C) 2009-2010 www.elfish.com.cn
	//  The following is Source Code about UploadWorker.as
	//	Bug and advice to darkty2009@gmail.com
	//
	////////////////////////////////////////////////////////////////////////////////
	
	[Event(name="ftp_workfinish", type="com.elfish.ftp.event.FTPEvent")]
	
	public class UploadWorker extends EventDispatcher implements IWorker
	{
		include "../../Version.as";
		
		private var list:Array;
		private var name:String;
		private var fileData:*;
		private var control:ControlSocket;
		private var data:DataSocket;
		
		public function UploadWorker(control:ControlSocket, name:String, fileData:*)
		{
			this.control = control;
			this.name = name;
			this.fileData = fileData;
			
			list = new Array();
			list.push(new Command(CommandsStatus.PASV));
			list.push(new Command(CommandsStatus.STOR, name));
			
			list = list.reverse();
			
			this.control.responseCall = response;
			
			// change the fileData dataType to ByteArray
			if(fileData is File) {
				var stream:FileStream = new FileStream();
				stream.open(fileData as File, FileMode.READ);
				var byte:ByteArray = new ByteArray();
				stream.readBytes(byte);
				
				this.fileData = new ByteArray()
				this.fileData = byte;
			}
		}
		
		public function set commandList(list:Array):void
		{
			this.list = list;
		}
		
		public function get commandList():Array
		{
			return this.list;
		}
		
		public function executeCommand():void
		{
			if(list.length > 0) {
				control.send(list[list.length-1] as Command);
				list.pop();
			}
		}
		
		public function response(rsp:Response):void
		{
			if(rsp.code == ResponseStatus.PASV.SUCCESS) {
				data = new DataSocket();
				data.connect(rsp.data as Config);
				executeCommand();
			}
			else if(rsp.code == ResponseStatus.STOR.START) {
				data.write(fileData);
				data.close();
			}
			else if(rsp.code == ResponseStatus.STOR.END) {
				rsp.code = 999;
				var event:FTPEvent = new FTPEvent(FTPEvent.FTP_WORLFINISH, rsp);
				dispatchEvent(event);
			}
		}
		
	}
}