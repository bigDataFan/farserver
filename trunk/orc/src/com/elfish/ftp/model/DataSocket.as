package com.elfish.ftp.model
{
	import com.elfish.ftp.core.Client;
	import com.elfish.ftp.core.Console;
	import com.elfish.ftp.event.FTPEvent;
	import com.elfish.ftp.worker.IWorker;
	
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.net.Socket;
	import flash.utils.ByteArray;
	
	import mx.utils.StringUtil;
	
	////////////////////////////////////////////////////////////////////////////////
	//
	//  Copyright (C) 2009-2010 www.elfish.com.cn
	//  The following is Source Code about DataSocket.as
	//	Bug and advice to darkty2009@gmail.com
	//
	////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * 数据连接
	 * 负责被动模式下与FTP的连接
	 * 传输数据
	 */
	public class DataSocket extends EventDispatcher
	{
		include "../../Version.as";
		
		/**
		 * SOCKET连接
		 */
		private var socket:Socket = null;
		
		public var rsp:Response = null;
		public var command:String = null;
		public var client:Client = null;		
		
		/**
		 * 所接收到的数据
		 */
		private var bytes:ByteArray = new ByteArray();
		
		public function DataSocket()
		{
			socket = new Socket();
			socket.addEventListener(IOErrorEvent.IO_ERROR, close);
			socket.addEventListener(Event.CLOSE, close);
			socket.addEventListener(ProgressEvent.SOCKET_DATA, response);
		}
		
		/**
		 * 连接服务器
		 * @param config
		 * Config Infomation of host,port,user and pass
		 * @see com.elfish.ftp.model.Config
		 */
		public function connect(config:Config):void
		{
			socket.connect(config.ip, int(config.port));
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
			}else
				socket.close();
		}
		
		/**
		 * 向FTP写入数据
		 * @param byte
		 * ByteArray Data
		 */
		public function write(byte:ByteArray):void
		{
			socket.writeBytes(byte);
			socket.flush();
		}
		
		/**
		 * 读取从数据连接缓存里获取的数据
		 * @return ByteArray
		 */
		public function read():ByteArray
		{
			return bytes;
		}
		
		/**
		 * 数据返回时,将数据写入byte
		 */
		public function response(event:*):void
		{
			var byte:ByteArray = new ByteArray();
			socket.readBytes(byte);
			bytes.writeBytes(byte);
			client.result(command, bytes);
		}

	}
}