package be.novio.cron4as.event
{
	import flash.events.Event;

	public class SchedulerStoppedEvent extends Event
	{
		public static const EVENT_NAME:String = "schedulerStoppedEvent";
		
		
		public function SchedulerStoppedEvent()
		{
			super(EVENT_NAME, true, true);
		}
		
	}
}