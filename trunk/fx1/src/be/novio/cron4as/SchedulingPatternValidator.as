/**
 * <p>
 * A scheduling patterns validator.
 * </p>
 * 
 * <p>
 * The class lets you validate a scheduling pattern before/without sending it to
 * the schedule()/reschedule() method of a Scheduler instance. Simply call:
 * </p>
 * 
 * <pre>
 * boolean valid = SchedulingPatternValidator.validate(thePattern);
 * </pre>
 * 
 * <p>
 * It is useful in validating user-entered patterns.
 * </p>
 * 
 * @author Hans Van de Velde
 * modified from Carlo Pelliccia's Cron4J:
 * http://www.sauronsoftware.it/projects/cron4j/ 
 */
package be.novio.cron4as
{
	public class SchedulingPatternValidator
	{
		/**
		 * This method validate a scheduling pattern string.
		 * 
		 * @param schedulingPattern
		 *            The pattern.
		 * @return true if the pattern is valid. It means that it could be used in
		 *         the scheduling of task, calling the schedule() method of a
		 *         Scheduler object, without any trouble: if the pattern is valid no
		 *         InvalidPatternException could be thrown.
		 */
		public static function validate(schedulingPattern:String):Boolean 
		{
			try 
			{
				new SchedulingPattern(schedulingPattern);
			} 
			catch (e:Error) 
			{
				return false;
			}
			return true;
		}
	}
}