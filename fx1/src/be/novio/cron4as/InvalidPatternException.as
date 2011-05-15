package be.novio.cron4as
{
	public class InvalidPatternException extends Error
	{
		public function InvalidPatternException(message:String="", id:int=0)
		{
			super(message, id);
		}
	}
}