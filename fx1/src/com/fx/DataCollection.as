package com.fx
{
	import com.adobe.serialization.json.JSON;
	
	import flash.filesystem.File;
	import flash.filesystem.FileStream;
	import flash.system.System;
	
	import mx.collections.ArrayCollection;

	public class DataCollection
	{
		private var dbfile:File;
		private var objects:ArrayCollection;
		
		public function DataCollection(file:File)
		{
			this.dbfile = file;
			
			
			if (!file.exists) {
				file.parent.createDirectory();
				objects = new ArrayCollection([]);
				flush();
			} else {
				fetch();
			}
		}

		public function flush():void {
			var fileStream:FileStream = new FileStream();
			fileStream.open(file, FileMode.WRITE);
			var jsonStr:String = JSON.encode(objects.source);
			fileStream.writeUTF(jsonStr);
			fileStream.close();	
		}
		
		public function fetch():void {
			var fileStream:FileStream = new FileStream();
			fileStream.open(file, FileMode.READ);
			var jsonStr = fileStream.readUTF();
			
			objects = new ArrayCollection(JSON.decode(jsonStr));
			
			fileStream.close();
		}
		
		public function insert(o:Object):String {
			objects.push(o);
			flush();
		}
		
		
		public function findOne(filter:Object):Object {
			for each (var o:Object in objects) {
				if (match(o,filter)) {
					return o;
				}				
			}
		}
		
		public function findAll(filter:Object):Array {
			var array:Array = [];
			if (filter==null) {
				return objects;
			} else {
				for each (var o:Object in objects) {
					if (match(om,filter)) {
						array.push(o);
					};
				}
				
			}
			return array;
		}
		
		public function remove(filter:Object):void {
			
			for (var i:int = 0; i < objects.length; i++) 
			{
				if (match(objects[i],filter)) {
					objects.removeItemAt(i);
				};
			}
			
			flush();
		}
		
		
		public function match(src:Object, filter:Object):Boolean {
			for each (var key:String in filter) {
				if (src[key] != filter[key]) {
					return false;
				}
			}
			return true;
		}
		
	}
}