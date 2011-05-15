package be.novio.cron4as.event
{
	import flash.events.Event;
	
	public class SchedulerPollingActivatedEvent extends Event
	{
		public static const EVENT_NAME:String = "schedulerPollingActivatedEvent";
		
		public function SchedulerPollingActivatedEvent()
		{
			super(EVENT_NAME, true, true);
		}

	}
}