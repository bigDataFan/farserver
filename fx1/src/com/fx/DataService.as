package com.fx
{
	import flash.filesystem.File;

	public class DataService
	{
		private var rootPath:String;
		
		private var collections:Object;
		
		public function DataService(root:String)
		{
			this.rootPath = root;
			collections = new Object();
		}
		
		public function getCollectionByPath(path:String):DataCollection {
			if (collections[path]==null) {
				var file:File = new File(path);
				var dc:DataCollection = new DataCollection(file);
				collections[path] = dc;
			}	
			return collections[path];
		}
		
		
		public function getCollection(coll:String):DataCollection {
			if (collections[coll]==null) {
				var file:File = new File(rootPath + "/" + coll);
				var dc:DataCollection = new DataCollection(file);
				collections[coll] = dc;
			}	
			return collections[coll];
		}
	}
}