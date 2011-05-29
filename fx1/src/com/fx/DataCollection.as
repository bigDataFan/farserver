package com.fx
{
	import flash.filesystem.File;
	
	import mx.collections.ArrayCollection;

	public class DataCollection
	{
		private var dbfile:File;
		private var objects:ArrayCollection;
		
		public function DataCollection(file:File)
		{
			this.dbfile = file;
			var fileStream:FileStream = new FileStream();
			
			if (!file.exists) {
				objects = [];
				flush();
			} else {
				fetch();
			}
		}
		

		public function flush():void {
			fileStream.open(file, FileMode.WRITE);
			fileStream.writeObject(objects);
			fileStream.close();	
		}
		
		
		public function fetch():void {
			fileStream.open(file, FileMode.READ);
			objects = fileStream.readObject();
			fileStream.close();
		}
		
		
		public function insert(o:Object):String {
			objects.addItem(o);
			flush();
		}
		
		
		public function update(id:String, o:Object) {
			
		}
		
		
		public function find(key:String, value:String):Object {
			
		}
		
		
		public function list():Array {
			return objejcts;
		}
		
		
		public function remove(id:String):void {
				
		}
		
	}
}