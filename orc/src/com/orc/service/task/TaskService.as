package com.orc.service.task
{
	import mx.collections.ArrayCollection;

	public interface TaskService
	{
		function createTask(task:Task):void;
		
		function listTask():ArrayCollection;
		
	}
	
}