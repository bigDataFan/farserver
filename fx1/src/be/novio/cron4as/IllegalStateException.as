package be.novio.cron4as
{
	public class IllegalStateException extends Error
	{
		public function IllegalStateException(message:String="", id:int=0)
		{
			super(message, id);
		}
	}
}