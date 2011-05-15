package be.novio.cron4as
{
	public interface ISchedulableTask
	{
		function set id(value:String):void;
		function get id():String;
		function set schedulingPattern(value:SchedulingPattern):void;
		function get schedulingPattern():SchedulingPattern;
	}
}