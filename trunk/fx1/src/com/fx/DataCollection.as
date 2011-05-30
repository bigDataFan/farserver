package com.fx
{
	import flash.filesystem.File;
	import flash.system.System;
	
	import mx.collections.ArrayCollection;

	public class DataCollection
	{
		private var dbfile:File;
		private var idmap:Object;
		
		public function DataCollection(file:File)
		{
			this.dbfile = file;
			var fileStream:FileStream = new FileStream();
			
			if (!file.exists) {
				file.parent.createDirectory();
				idmap = new Object();
				flush();
			} else {
				fetch();
			}
		}

		public function flush():void {
			fileStream.open(file, FileMode.WRITE);
			fileStream.writeObject(idmap);
			fileStream.close();	
		}
		
		public function fetch():void {
			fileStream.open(file, FileMode.READ);
			idmap = fileStream.readObject();
			fileStream.close();
		}
		
		public function insert(o:Object):String {
			if (o["id"]==null) {
				var uid:String = uuid();
				idmap[uid] = o;
			} else {
				idmap[o["id"]] = o;
			}
			
			flush();
		}
		
		
		public function getByKey(id:String):Object {
			if (o[id]==null) {
				return null;
			} else {
				return o[id];
			}
		}
		
		public function update(id:String, o:Object):void {
			idmap[id] = o;
			flush();
		}
		
		
		public function find(key:String, value:String):Object {
			
		}
		
		
		public function list():Array {
			var array:Array = [];
			for each (var i:Object in idmap) {
				array.push(i);
			}
			return array;
		}
		
		
		public function remove(id:String):void {
			idmap[id] = null;
			flush();
		}
		
		public function uuid():String {
				
		}
		
	}
}