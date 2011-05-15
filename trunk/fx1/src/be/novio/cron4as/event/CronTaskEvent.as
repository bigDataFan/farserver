package be.novio.cron4as.event
{
	import be.novio.cron4as.ISchedulableTask;
	
	import flash.events.Event;

	public class CronTaskEvent extends Event
	{
		public static const EVENT_NAME:String = "CronTaskEvent"
		private var _task:ISchedulableTask;
		
		public function CronTaskEvent(task:ISchedulableTask)
		{
			super(EVENT_NAME, true, true);
			this.task = task;
		}
		
		public function set task(value:ISchedulableTask):void
		{
			_task = value;
		}
		public function get task():ISchedulableTask
		{
			return _task;
		}
	}
}