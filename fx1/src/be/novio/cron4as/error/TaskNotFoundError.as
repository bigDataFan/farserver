package be.novio.cron4as.error
{
	public class TaskNotFoundError extends Error
	{
		public function TaskNotFoundError()
		{
			super("Task not found");
		}
		
	}
}