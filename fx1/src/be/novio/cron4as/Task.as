package be.novio.cron4as
{
	public class Task implements ISchedulableTask
	{
		private var _schedulingPattern:SchedulingPattern;
		private var _id:String;
		
		/**
		 * constructor
		 */
		function Task(schedulingPattern:SchedulingPattern, taskID:String)
		{
			this._schedulingPattern = schedulingPattern;
			this.id = taskID;
		}
		
		//------------------------------------------------------------------------------------
		
		public function set id(value:String):void
		{
			_id = value;
		}		
		public function get id():String
		{
			return _id;
		}		
		
		//------------------------------------------------------------------------------------
		
		public function set schedulingPattern(value:SchedulingPattern):void
		{
			_schedulingPattern = value;
		}
		
		//------------------------------------------------------------------------------------
		
		public function get schedulingPattern():SchedulingPattern
		{
			return _schedulingPattern;
		}
	}
}