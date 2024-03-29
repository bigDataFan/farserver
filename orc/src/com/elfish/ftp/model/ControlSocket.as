package com.elfish.ftp.model
{
	////////////////////////////////////////////////////////////////////////////////
	//
	//  Copyright (C) 2009-2010 www.elfish.com.cn
	//  The following is Source Code about ControlSocket.as
	//	Bug and advice to darkty2009@gmail.com
	//
	////////////////////////////////////////////////////////////////////////////////
	
	import com.elfish.ftp.core.Client;
	import com.elfish.ftp.core.Console;
	import com.elfish.ftp.status.ResponseStatus;
	import com.elfish.ftp.util.Parser;
	
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.TimerEvent;
	import flash.net.Socket;
	import flash.utils.Timer;
	
	/**
	 * 控制连接
	 * 负责对FTP的长久连接
	 * 并且接收状态返回和发送控制命令
	 */
	public class ControlSocket extends EventDispatcher
	{
		include "../../Version.as";
		
		/**
		 * 配置信息
		 */
		public static var config:Config = null;
		
		/**
		 * 控制连接实例
		 */
		public static var control:ControlSocket = null;
		
		public var client:Client = null;
		
		/**
		 * 回调函数
		 */
		public var responseCall:Function = null;
		
		/**
		 * SOCKET连接
		 */
		public var socket:Socket = null;
		
		public function ControlSocket():void
		{
			socket = new Socket();
			socket.addEventListener(Event.CONNECT, response);
			socket.addEventListener(ProgressEvent.SOCKET_DATA, response);
			socket.addEventListener(IOErrorEvent.IO_ERROR, close);
			socket.addEventListener(Event.CLOSE, close);
			
			timer = new Timer(20*1000);
			timer.addEventListener(TimerEvent.TIMER, function():void {
						send(new Command("NOOP",""));
			});
			
		
		}
		
		/**
		 * 保证唯一控制连接实例
		 */
		public static function getInstance():ControlSocket
		{
			if(control == null) {
				control = new ControlSocket();
			}
			return control;
		}
		
		/**
		 * 连接FTP
		 */
		public function connect():void
		{
			if (socket.connected) {
				socket.close();
			}
			
			socket.connect(config.ip, int(config.port));
		}
		
		/**
		 * 发送命令
		 * @param comm
		 * Command Command instance
		 * @see com.elfish.ftp.model.Command
		 */
		public function send(comm:Command):void
		{
			if(Console.target)
				Console.console(comm.toExecuteString());
			trace(	comm.toExecuteString());
			socket.writeUTFBytes(comm.toExecuteString());
			//socket.writeMultiByte(comm.toExecuteString(), "utf8");
			socket.flush();
			timer.start();
			/*
			if (timer.running) {
				timer.stop();
			}
			*/
		}
		
		/**
		 * 关闭连接
		 * 监听连接失败
		 */
		public function close(event:* = null):void
		{
			if(event is IOErrorEvent) {
				if(Console.target)
					Console.console("连接失败!");
				
				if (client) {
					client.listener.tell(null, null);
				}
			}else
				socket.close();
		}
		
		private var timer:Timer = null;	
		
		/**
		 * 状态返回监听函数
		 * 处理返回的状态码以及所带的数据
		 * 使用Parser进行数据解析,提取有用数据
		 * @see com.elfish.ftp.util.Parser
		 */
		private var noop_ct = 0;
		public function response(event:*):void
		{
			if (timer.running) timer.stop();
			
			
			var message:String = socket.readMultiByte(socket.bytesAvailable, "utf8");
			trace(message);
			var messageList:Array = message.split("\r\n");
				
			for(var i:Number=0;i<messageList.length;i++) {	
				if(messageList[i].length > 0) {
					if(Console.target)
						Console.console(messageList[i], true);
					
					var result:Response = Parser.standableParse(messageList[i]);
					
					if (result.code == ResponseStatus.NOOP.OK) {
						timer.start()
						return;
					}
					
					if(result.code == 257)
						result = Parser.directoryParse(result);
					else if(result.code == 227)
						result = Parser.modelParse(result);
					
					responseCall.call(null, result);
				}
			}
						
			
		}

	}
}