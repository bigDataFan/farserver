package be.novio.cron4as
{
	import be.novio.cron4as.error.ExistingTaskIdentifierError;
	import be.novio.cron4as.error.TaskNotFoundError;
	import be.novio.cron4as.event.CronTaskEvent;
	import be.novio.cron4as.event.SchedulerPollingActivatedEvent;
	import be.novio.cron4as.event.SchedulerStartedEvent;
	import be.novio.cron4as.event.SchedulerStoppedEvent;
	import be.novio.utils.SteadyTimer;
	
	import flash.events.EventDispatcher;
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	
	import mx.collections.ArrayCollection;
	import mx.logging.ILogger;
	import mx.logging.Log;
	
	/**
	 * The Cron4AS scheduler (a port from Cron4J in Java to ActionScript 3)
	 * 
	 * <p>
	 * With a Scheduler instance you can schedule as many tasks as you need, whose
	 * execution is regulated by UNIX crontab-like patterns.
	 * </p>
	 * <p>
	 * First of all you have to instance a Scheduler object:
	 * </p>
	 * 
	 * <pre>
	 * var myScheduler:Scheduler = new Scheduler();
	 * </pre>
	 * 
	 * <p>
	 * Now schedule your tasks, given as plain Runnable objects:
	 * </p>
	 * 
	 * <pre>
	 * myScheduler.scheduler(aRunnableObject, aUNIXCrontabLikeSchedulingPattern);
	 * </pre>
	 * 
	 * <p>
	 * Start the scheduler:
	 * </p>
	 * 
	 * <pre>
	 * myScheduler.start();
	 * </pre>
	 * 
	 * <p>
	 * Stop the scheduler when you need it no more:
	 * </p>
	 * 
	 * <pre>
	 * myScheduler.stop();
	 * </pre>
	 * 
	 * <p>
	 * In every moment of the scheduler life you can schedule another task calling
	 * its schedule() method, regardless it is started or not. All you need, once
	 * again, is a Runnable object and a scheduling pattern.
	 * </p>
	 * <p>
	 * Note that the schedule() method gives you back an identifier for the task.
	 * With its identifier you can retrieve later informations about the task, and
	 * you can also reschedule() and deschedule() it.
	 * </p>
	 * <h2>Scheduling patterns</h2>
	 * <p>
	 * A UNIX crontab-like pattern is a string splitted in five space separated
	 * parts. Each part is intented as:
	 * </p>
	 * <ol>
	 * <li><strong>Minutes sub-pattern</strong>. During which minutes of the hour
	 * should the task been launched? The values range is from 0 to 59. </li>
	 * <li><strong>Hours sub-pattern</strong>. During which hours of the day
	 * should the task been launched? The values range is from 0 to 23.</li>
	 * <li><strong>Days of month sub-pattern</strong>. During which days of the
	 * month should the task been launched? The values range is from 0 to 31.</li>
	 * <li><strong>Months sub-pattern</strong>. During which months of the year
	 * should the task been launched? The values range is from 1 (January) to 12
	 * (December), otherwise this sub-pattern allows the aliases &quot;jan&quot;,
	 * &quot;feb&quot;, &quot;mar&quot;, &quot;apr&quot;, &quot;may&quot;,
	 * &quot;jun&quot;, &quot;jul&quot;, &quot;aug&quot;, &quot;sep&quot;,
	 * &quot;oct&quot;, &quot;nov&quot; and &quot;dec&quot;.</li>
	 * <li><strong>Days of week sub-pattern</strong>. During which days of the
	 * week should the task been launched? The values range is from 0 (Sunday) to 6
	 * (Saturday), otherwise this sub-pattern allows the aliases &quot;sun&quot;,
	 * &quot;mon&quot;, &quot;tue&quot;, &quot;wed&quot;, &quot;thu&quot;,
	 * &quot;fri&quot; and &quot;sat&quot;.</li>
	 * </ol>
	 * <p>
	 * The star wildcard character is also admitted, indicating &quot;every minute
	 * of the hour&quot;, &quot;every hour of the day&quot;, &quot;every day of the
	 * month&quot;, &quot;every month of the year&quot; and &quot;every day of the
	 * week&quot;, according to the sub-pattern in which it is used.
	 * </p>
	 * <p>
	 * Once the scheduler is started, a task will be launched when the five parts in
	 * its scheduling pattern will be true at the same time.
	 * </p>
	 * <p>
	 * Some examples:
	 * </p>
	 * <p>
	 * <strong>5 * * * *</strong><br>
	 * This pattern causes a task to be launched once every hour, at the begin of
	 * the fifth minute (00:05, 01:05, 02:05 etc.).
	 * </p>
	 * <p>
	 * <strong>* * * * *</strong><br>
	 * This pattern causes a task to be launched every minute.
	 * </p>
	 * <p>
	 * <strong>* 12 * * Mon</strong><br>
	 * This pattern causes a task to be launched every minute during the 12th hour
	 * of Monday.
	 * </p>
	 * <p>
	 * <strong>* 12 16 * Mon</strong><br>
	 * This pattern causes a task to be launched every minute during the 12th hour
	 * of Monday, 16th, but only if the day is the 16th of the month.
	 * </p>
	 * <p>
	 * Every sub-pattern can contain two or more comma separated values.
	 * </p>
	 * <p>
	 * <strong>59 11 * * 1,2,3,4,5</strong><br>
	 * This pattern causes a task to be launched at 11:59AM on Monday, Tuesday,
	 * Wednesday, Thursday and Friday.
	 * </p>
	 * <p>
	 * Values intervals are admitted and defined using the minus character.
	 * </p>
	 * <p>
	 * <strong>59 11 * * 1-5</strong><br>
	 * This pattern is equivalent to the previous one.
	 * </p>
	 * <p>
	 * The slash character can be used to identify periodic values, in the form a/b.
	 * A sub-pattern with the slash character is satisfied when the value on the
	 * left divided by the one on the right gives an integer result (a % b == 0).
	 * </p>
	 * <p>
	 * <strong>*&#47;15 9-17 * * *</strong><br>
	 * This pattern causes a task to be launched every 15 minutes between the 9th
	 * and 17th hour of the day (9:00, 9:15, 9:30, 9:45 and so on... note that the
	 * last execution will be at 17:45).
	 * </p>
	 * <p>
	 * All the fresh described syntax rules can be used together.
	 * </p>
	 * <p>
	 * <strong>* 12 10-16/2 * *</strong><br>
	 * This pattern causes a task to be launched every minute during the 12th hour
	 * of the day, but only if the day is the 10th, the 12th, the 14th or the16th of
	 * the month.
	 * </p>
	 * <p>
	 * <strong>* 12 1-15,17,20-25 * *</strong><br>
	 * This pattern causes a task to be launched every minute during the 12th hour
	 * of the day, but the day of the month must be between the 1st and the 15th,
	 * the 20th and the 25, or at least it must be the 17th.
	 * </p>
	 * <p>
	 * Finally cron4j lets you combine more scheduling patterns into one, with the
	 * pipe character:
	 * </p>
	 * <p>
	 * <strong>0 5 * * *|8 10 * * *|22 17 * * *</strong><br>
	 * This pattern causes a task to be launched every day at 05:00, 10:08 and
	 * 17:22.
	 * </p>
	 * 
	 * @author Hans Van de Velde
	 * modified from Carlo Pelliccia's Cron4J:
     * http://www.sauronsoftware.it/projects/cron4j/ 
	 */
	public class Scheduler extends EventDispatcher
	{
		
		/**
		 * A counter for object instances.
		 */
		private static var counter:int = 0;
	
		/**
		 * The state flag. If true the scheduler is started and running, otherwise
		 * it is paused and no task is launched.
		 */
		public var started:Boolean = false;
	
		/**
		 * The task list.
		 */
		[Bindable] public var tasks:ArrayCollection = new ArrayCollection();

		/**
		 * A self-reference (usefull for inner-classes code).
		 */
		private var scheduler:Scheduler;
		
		/**
		 * The timer that provides the triggers to go check whether any tasks is supposed to be executed.
		 */
		private var timer:SteadyTimer;
		
		//
		private static const LOGGER:ILogger = Log.getLogger("Scheduler");
	
		/**
		 * constructor
		 */
		function Scheduler()
		{
			init();
		}

		//////////////////////////////////////////////////////////////////////////////////////
		//
		// PUBLIC METHODS (API)
		//
		//////////////////////////////////////////////////////////////////////////////////////
		
		/**
		 * This method schedules a task execution.
		 * 
		 * @param schedulingPattern
		 *            The scheduling pattern for the task.
		 * @param task
		 *            The task, as a plain Runnable object.
		 * @return The task auto-generated ID assigned by the scheduler. This ID can
		 *         be used later to reschedule and deschedule the task, and also to
		 *         retrieve informations about it.
		 * @throws InvalidPatternException
		 *             If the supplied pattern is not valid.
		 */
		public function schedule(taskToSchedule:ISchedulableTask):String
		{
			// LOGGER.info("into SCHEDULE for " + taskToSchedule.getSchedulingPattern().toString() + ", taskIdentifier:"+taskToSchedule.getId());

			if(getTask(taskToSchedule.id)) throw new ExistingTaskIdentifierError();

			tasks.addItem(taskToSchedule);
			return taskToSchedule.id;
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * This method changes the scheduling pattern of a task.
		 * 
		 * @param id
		 *            The ID assigned to the previously scheduled task.
		 * @param schedulingPattern
		 *            The new scheduling pattern for the task.
		 * @throws InvalidPatternException
		 *             If the supplied pattern is not valid.
		 */
		public function reschedule(updatedTask:ISchedulableTask):void
		{
			var myTask:ISchedulableTask = getTask(updatedTask.id);
			if(!myTask) throw new TaskNotFoundError();
			var index:int = tasks.getItemIndex(myTask);
			tasks.setItemAt(updatedTask, index);
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * This methods cancels the scheduling of a task.
		 * 
		 * @param id
		 *            The ID of the task.
		 */
		public function deschedule(id:String):void
		{
			var myTask:ISchedulableTask = getTask(id);
			if (myTask != null) 
			{
				removeFromScheduledTasks(myTask);
			}
		}
		
		//------------------------------------------------------------------------------------

		/**
		 * This method retrieves the scheduling pattern of a previously scheduled
		 * task.
		 * 
		 * @param id
		 *            The task ID.
		 * @return The scheduling pattern of the task, or null if the task was not
		 *         found.
		 */
		public function getTaskSchedulingPattern(id:String):SchedulingPattern 
		{
			var myTask:ISchedulableTask = getTask(id);
			if (myTask != null) 
			{
				return myTask.schedulingPattern;
			}
			return null;
		}
		
		//------------------------------------------------------------------------------------

		/**
		 * This method starts the scheduler. When the scheduled is started the
		 * supplied tasks are executed at the given moment.
		 * 
		 * @throws IllegalStateException
		 *             Thrown if this scheduler is already started.
		 */
		public function start():void 
		{
			// LOGGER.info("into START !!!");
			if (!started) 
			{
				////////////////////////////////////////////////////////////////////////////////////
				//
				// Converted thread system to system with a Timer checking for a match
				//				
				////////////////////////////////////////////////////////////////////////////////////
				
				var millisRest:Number = 60000 - (new Date().getTime() % 60000);
				var delayTimer:Timer = new Timer(millisRest, 1);
				
				// LOGGER.info("Current time is "+new Date().toString());
				// LOGGER.info("Starting main timer in "+millisRest+" milliseconds");
				
				delayTimer.addEventListener(TimerEvent.TIMER, delayStartTimerHandler);
				delayTimer.start();
				
				////////////////////////////////////////////////////////////////////////////////////
				
				// Change the state of the object.
				started = true;
				
				// notify
				dispatchEvent(new SchedulerStartedEvent());
			} 
			else 
			{
				throw new IllegalStateException("Scheduler already started");
			}
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * This method stops the scheduler execution. Before returning it waits the
		 * end of all the running tasks previously launched. Once the scheduler has
		 * been stopped it can be started again with a start() call.
		 * 
		 * @throws IllegalStateException
		 *             Thrown if this scheduler is not started.
		 */
		public function stop():void 
		{
			if (started) 
			{
				// Change the state of the object.
				started = false;
				timer.stop();
				
				// notify
				dispatchEvent(new SchedulerStoppedEvent());
			} 
			else 
			{
				throw new IllegalStateException("Scheduler not started");
			}
		}

		//////////////////////////////////////////////////////////////////////////////////////
		//
		// PROTECTED METHODS
		//
		//////////////////////////////////////////////////////////////////////////////////////

		/**
		 * @author Hans Van de Velde
		 */
		protected function init():void
		{
			scheduler = this;
			timer = new SteadyTimer(60000);
			timer.addTimerEventListener(mainTimerHandler);
		}

		//------------------------------------------------------------------------------------
		
		/**
		 * This method scans the list of the scheduled task, retrieving a task
		 * starting from its ID.
		 * 
		 * @param id
		 *            The ID of the requested task.
		 * @return The requested task, or null f it was not found.
		 */
		protected function getTask(id:String):ISchedulableTask  
		{
			var size:int = tasks.length;
			for (var i:uint = 0; i < size; i++) {
				var myTask:Task = tasks.getItemAt(i) as Task;
				if(myTask.id == id) 
				{
					return myTask;
				}
			}
			return null;
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * @author Hans Van de Velde
		 */
		protected function checkTasks(millis:Number):void
		{
			var size:int = tasks.length;
			
			// LOGGER.info("into checkTasks, checking "+size+" tasks...");
			
			for (var i:uint = 0; i < size; i++) 
			{
				var myTask:ISchedulableTask = tasks.getItemAt(i) as ISchedulableTask;
				var pattern:SchedulingPattern = myTask.schedulingPattern;

				// LOGGER.info("checking match for "+myTask.getId().toString() + " for pattern "+pattern);

				if (pattern.match(millis)) 
				{
					// LOGGER.info("WE HAVE A MATCH !");
					dispatchEvent(new CronTaskEvent(myTask));
				}
			}
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * 
		 */
		protected function removeFromScheduledTasks(taskToRemove:ISchedulableTask):void
		{
			for (var i:uint = 0; i < tasks.length; i++) 
			{
				var myTask:Task = tasks.getItemAt(i) as Task;
				if(taskToRemove.id == myTask.id)
				{
					tasks.removeItemAt(i);
					i = tasks.length; // break for
				}
			}
		}

		//////////////////////////////////////////////////////////////////////////////////////
		//
		// EVENT HANDLERS
		//
		//////////////////////////////////////////////////////////////////////////////////////

		/**
		 * @author Hans Van de Velde
		 */
		private function delayStartTimerHandler(tEvent:TimerEvent):void
		{
			// LOGGER.info("into delayStartTimerHandler, starting main timer");
			timer.start();
			
			dispatchEvent(new SchedulerPollingActivatedEvent());
		}
		
		//------------------------------------------------------------------------------------

		/**
		 * @author Hans Van de Velde
		 */
		private function mainTimerHandler(tEvent:TimerEvent):void
		{
			// LOGGER.info("into mainTimerHandler !!!");
			checkTasks(new Date().getTime());
		}
	}
}