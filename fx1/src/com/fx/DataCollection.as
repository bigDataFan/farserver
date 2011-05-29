package com.fx
{
	import flash.filesystem.File;

	public class DataCollection
	{
		private var dbfile:File;
		private var objects:Array;
		
		public function DataCollection(file:File)
		{
			this.dbfile = file;
			var fileStream:FileStream = new FileStream();
			
			if (!file.exists) {
				objects = [];
				fileStream.open(file, FileMode.WRITE);
				fileStream.writeObject(objects);
				fileStream.close();			
			} else {
				fileStream.open(file, FileMode.READ);
				objects = fileStream.readObject();
				fileStream.close();
			}
		}
		
		
		public function insert(o:Object):String {
			
		}
		
		public function update(id:String, o:Object) {
			
		}
		
		public function find(key:String, value:String):Object {
			
		}
		
		public function list():Array {
			
		}
		
		public function remove(id:String):void {
			
		}
		
		
	}
}