package be.novio.cron4as
{
	public class AlwaysTrueValueMatcher implements IValueMatcher
	{
		/**
		 * Always true!
		 */
		public function match(value:int):Boolean 
		{
			return true;
		}
		
		public function getValues():Array
		{
			return ["*"];
		}
	}
}