package be.novio.cron4as
{
	import mx.collections.ArrayCollection;
	
	/**
	 * <p>
	 * A predictor is able to predict when a scheduling pattern will be matched.
	 * </p>
	 * <p>
	 * Suppose you want to know when the scheduler will execute a task scheduled
	 * with the pattern <em>0 3 * jan-jun,sep-dec mon-fri</em>. You can predict
	 * the next <em>n</em> execution of the task using a Predictor instance:
	 * </p>
	 * 
	 * <pre>
	 * var pattern:String = &quot;0 3 * jan-jun,sep-dec mon-fri&quot;;
	 * var p:Predictor = new Predictor(pattern);
	 * for (var i:uint = 0; i &lt; n; i++) {
	 * 	LOGGER.info(p.nextMatchingDate());
	 * }
	 * </pre>
	 * 
	 * @author Hans Van de Velde
	 * modified from Carlo Pelliccia's Cron4J:
     * http://www.sauronsoftware.it/projects/cron4j/ 
	 */
	public class Predictor
	{
		/**
		 * The scheduling pattern on which the predictor works.
		 */
		private var schedulingPattern:SchedulingPattern;
	
		/**
		 * The start time for the next prediction.
		 */
		private var time:Number;

		/**
		 * It builds a predictor with the given scheduling pattern and start time.
		 * 
		 * @param schedulingPattern
		 *            The pattern on which the prediction will be based.
		 * @param start
		 *            The start time of the prediction.
		 * @throws InvalidPatternException
		 *             In the given scheduling pattern isn't valid.
		 */
		function Predictor(schedulingPatternString:String, start:* = null)
		{
			this.schedulingPattern = new SchedulingPattern(schedulingPatternString);
			
			if(start is Number)
			{
				this.time = (start / (1000 * 60)) * 1000 * 60;
			}
			else if(start is Date)
			{
				this.time = (start as Date).getTime();
			}
			else
			{
				this.time = new Date().getTime();
			}
		}

		//////////////////////////////////////////////////////////////////////////////////////
		//
		// PUBLIC METHODS (API)
		//
		//////////////////////////////////////////////////////////////////////////////////////

		/**
		 * It returns the next matching moment as a millis value.
		 * 
		 * @return The next matching moment as a millis value.
		 */
		public function nextMatchingTime():Number 
		{
			// Go a minute ahead.
			time += 60000;

			// Is it matching?
			if (schedulingPattern.match(time)) 
			{
				return time;
			}

			// Ok, split the time!
			var c:Date = new Date();
			
			c.setTime(time);
			
			var minute:int = c.minutes;
			var hour:int = c.hours;
			
			// problem:
			// the hour and minute start 
			
			var dayOfMonth:int = c.date;
			var month:int = c.month;
			var year:int = c.fullYear;
			
			// Gets the matchers.
			var minuteMatcher:IValueMatcher = schedulingPattern.minuteMatcher;
			var hourMatcher:IValueMatcher = schedulingPattern.hourMatcher;
			var dayOfMonthMatcher:IValueMatcher = schedulingPattern.dayOfMonthMatcher;
			var dayOfWeekMatcher:IValueMatcher = schedulingPattern.dayOfWeekMatcher;
			var monthMatcher:IValueMatcher = schedulingPattern.monthMatcher;
			
			
			// Let's find the next matching minute.
			do 
			{
				if (minute > 59) 
				{
					minute = 0;
					hour++;
				}
				if (minuteMatcher.match(minute)) 
				{
					break;
				}
				minute++;
			} while (true);
			
			
			// The next matching hour.
			do 
			{
				if (hour > 23) 
				{
					hour = 0;
					dayOfMonth++;
				}
				
				if (hourMatcher.match(hour)) 
				{
					break;
				}
				hour++;
			} while (true);
			

			do 
			{
				// The next matching dayOfMonth.
				
				do 
				{
					if (dayOfMonth > 31) 
					{
						dayOfMonth = 1;
						month++;
					}
					
					if (dayOfMonthMatcher.match(dayOfMonth)) 
					{
						break;
					}
					
					dayOfMonth++;

					//////////////////////////////////////////////////////////////////////////////////////
					// BEGIN BUGFIX Hans Van de Velde
					// We need to reset hour and minute to 0 or else we only start counting from the hour
					// and the minute of the current day (!)
					//////////////////////////////////////////////////////////////////////////////////////

					hour = 0;
					minute = 0;
					do 
					{
						if (minute > 59) 
						{
							minute = 0;
							hour++;
						}
						if (minuteMatcher.match(minute)) 
						{
							break;
						}
						minute++;
					} while (true);
					
					
					// The next matching hour.
					do 
					{
						if (hour > 23) 
						{
							hour = 0;
							dayOfMonth++;
						}
						
						if (hourMatcher.match(hour)) 
						{
							break;
						}
						hour++;
					} while (true);
					
					//////////////////////////////////////////////////////////////////////////////////////
					// END BUGFIX Hans Van de Velde
					//////////////////////////////////////////////////////////////////////////////////////
					
				} while (true);
				
			
				// The next matching month
				
				do	{
					if (month > 11) // 11 = december 
					{
						month = 0; // 0 = january
						year++;
					}
					if (monthMatcher.match(month + 1)) 
					{
						break;
					}
					
					month++;
					
				} while (true);
				
								
				// Is this ok?
				c = new Date(year, month, dayOfMonth, hour, minute);

				// Day-of-month/month compatibility check.
				var oldDayOfMonth:int = dayOfMonth;
				var oldMonth:int = month;
				dayOfMonth = c.date;
				month = c.month;
				
				if (month != oldMonth || dayOfMonth != oldDayOfMonth) 
				{
					// Do it again.
					continue;
				}
				
				// Day-of-week compatibility check.
				var dayOfWeek:int = c.day;
				
				if (!dayOfWeekMatcher.match(dayOfWeek)) 
				{
					// Do it again...
					dayOfMonth++;
					
					continue;
				}
				

				// Seems it matchs!
				this.time = (c.getTime() / (1000 * 60)) * 1000 * 60;
				break;
				
			} while (true);
			
			// Here it is.
			return this.time;
		}
		


		//------------------------------------------------------------------------------------
	
		/**
		 * It returns the next matching moment as a {@link Date} object.
		 * 
		 * @return The next matching moment as a {@link Date} object.
		 */
		public function nextMatchingDate():Date 
		{
			var returnDate:Date = new Date();
			returnDate.setTime(nextMatchingTime())
			return returnDate;
		}
	}
}