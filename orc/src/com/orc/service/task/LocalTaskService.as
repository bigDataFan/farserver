package com.orc.service.task
{
	import com.orc.service.DataCollection;
	import com.orc.service.ServiceRegistry;
	
	import mx.collections.ArrayCollection;

	public class LocalTaskService implements TaskService
	{
		
		var taskdb:DataCollection;
		public function LocalTaskService(ds)
		{
			taskdb = ds.getCollection("task.db");
		}
		
		
		public function createTask(task:Task):void {
			
			taskdb.insert(taskdb);
		}
		
		
		public function listTask():ArrayCollection {
			return new ArrayCollection(taskdb.findAll(null));
		}
		
		
		public function updateTask(task:Task):void {
			taskdb.upsert({"id":task.id},task);
		}
		
		
	}
}