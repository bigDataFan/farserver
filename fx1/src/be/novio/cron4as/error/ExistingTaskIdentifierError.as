package be.novio.cron4as.error
{
	public class ExistingTaskIdentifierError extends Error
	{
		public function ExistingTaskIdentifierError()
		{
			super("Task identifier not unique");
		}
		
	}
}