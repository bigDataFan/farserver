package be.novio.cron4as
{
	public interface IValueMatcher
	{
		function match(value:int):Boolean;
		function getValues():Array;
	}
}