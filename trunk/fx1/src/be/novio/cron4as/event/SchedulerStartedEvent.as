package be.novio.cron4as.event
{
	import flash.events.Event;

	public class SchedulerStartedEvent extends Event
	{
		public static const EVENT_NAME:String = "schedulerStartedEvent";
		
		
		public function SchedulerStartedEvent()
		{
			super(EVENT_NAME, true, true);
		}
		
	}
}