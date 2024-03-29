package com.elfish.ftp.worker
{
	import com.elfish.ftp.core.Client;
	import com.elfish.ftp.event.FTPEvent;
	import com.elfish.ftp.model.Command;
	import com.elfish.ftp.model.Config;
	import com.elfish.ftp.model.ControlSocket;
	import com.elfish.ftp.model.DataSocket;
	import com.elfish.ftp.model.Response;
	import com.elfish.ftp.status.CommandsStatus;
	import com.elfish.ftp.status.ResponseStatus;
	
	import flash.events.EventDispatcher;
	import flash.utils.ByteArray;
	
	////////////////////////////////////////////////////////////////////////////////
	//
	//  Copyright (C) 2009-2010 www.elfish.com.cn
	//  The following is Source Code about ListWorker.as
	//	Bug and advice to darkty2009@gmail.com
	//
	////////////////////////////////////////////////////////////////////////////////
	
	[Event(name="ftp_workfinish", type="com.elfish.ftp.event.FTPEvent")]

	public class ListWorker extends EventDispatcher implements IWorker
	{
		include "../../Version.as";
		
		private var list:Array;
		private var path:String;
		private var control:ControlSocket;
		private var data:DataSocket;
		public var client:Client;
		
		public function ListWorker(control:ControlSocket, path:String)
		{
			this.control = control;
			this.path = path;
			
			list = new Array();
			
			list.push(new Command(CommandsStatus.PWD));
			list.push(new Command(CommandsStatus.CWD));
				
			list.push(new Command(CommandsStatus.PASV));
			list.push(new Command(CommandsStatus.LIST, "-al"));
			
			list = list.reverse();
			
			this.control.responseCall = response;
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
			if(rsp.code == ResponseStatus.PWD.SUCCESS) {
				if(path != "")
					Command(list[list.length-1]).args = rsp.data + "/" + path;
				else
					Command(list[list.length-1]).args = rsp.data;
				
				executeCommand();
			}
			else if(rsp.code == ResponseStatus.CWD.SUCCESS)
				executeCommand();
			else if(rsp.code == ResponseStatus.PASV.SUCCESS) {
				data = new DataSocket();
				data.command = "list " + path;
				data.connect(rsp.data as Config);
				data.addEventListener(FTPEvent.FTP_WORLFINISH, response);
				executeCommand();
			}
			/*
			else if(rsp.code == ResponseStatus.LIST.END) {
				var bytes:ByteArray = data.read();
				rsp.data = bytes;
				var event:FTPEvent = new FTPEvent(FTPEvent.FTP_WORLFINISH, rsp);
				//dispatchEvent(event);
			}
			*/
		}
		
	}
}