package be.novio.cron4as
{
	import mx.collections.ArrayCollection;
	import mx.formatters.DateFormatter;
	import mx.logging.ILogger;
	import mx.logging.Log;
	
	
	/**
	 * This class parses and represents as its instances the scheduling patterns
	 * expressed with a crontab-like syntax.
	 * 
	 * @author Hans Van de Velde
	 * modified from Carlo Pelliccia's Cron4J:
     * http://www.sauronsoftware.it/projects/cron4j/ 
	 */
	public class SchedulingPattern
	{

		//////////////////////////////////////////////////////////////////////////////////////
		//
		// PROPERTIES
		//
		//////////////////////////////////////////////////////////////////////////////////////
		
		/**
		 * Months aliases.
		 */
		private static const MONTHS:Array = ["", "jan", "feb", "mar"," apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
	
		/**
		 * Days of week aliases.
		 */
		private static const DAYS_OF_WEEK:Array = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
	
		/**
		 * Just a logger
		 */
		private static const LOGGER:ILogger = Log.getLogger("SchedulingPattern");
		
		/**
		 * The original string from which the object has been built.
		 */
		private var originalString:String;
		
		private var _minuteMatcher:ValueMatcherSet = new ValueMatcherSet();
		private var _hourMatcher:ValueMatcherSet = new ValueMatcherSet();
		private var _dayOfMonthMatcher:ValueMatcherSet = new ValueMatcherSet();
		private var _monthMatcher:ValueMatcherSet = new ValueMatcherSet();
		private var _dayOfWeekMatcher:ValueMatcherSet = new ValueMatcherSet();
		

		/**
		 * constructor
		 */	
		function SchedulingPattern(pattern:String)
		{
			originalString = pattern;
		
				
			var st1:Array = pattern.split("|");
			if (st1.length < 1) 
			{
				throw new InvalidPatternException();
			}
			
			for(var i:uint=0; i<st1.length; i++)
			{
				var localPattern:String = st1[i];
				var st2:Array = localPattern.split(" ");
				if (st2.length != 5) 
				{
					throw new InvalidPatternException();
				}
				
				minuteMatcher.addValueMatcher(buildValueMatcher(""+st2[0], 0, 59));
				
				hourMatcher.addValueMatcher(buildValueMatcher(""+st2[1], 0, 23));
				
				dayOfMonthMatcher.addValueMatcher(buildValueMatcher(""+st2[2], 1, 31));
				
				monthMatcher.addValueMatcher(buildValueMatcher(""+st2[3], 1, 12, MONTHS));
				
				dayOfWeekMatcher.addValueMatcher(buildValueMatcher(""+st2[4], 0, 6, DAYS_OF_WEEK));
			}
		}

		//////////////////////////////////////////////////////////////////////////////////////
		//
		// GETTERS & SETTERS
		//
		//////////////////////////////////////////////////////////////////////////////////////
		
		/**
		 * The ValueMatcher for the "minute" field.
		 */
		public function set minuteMatcher(value:ValueMatcherSet):void
		{
			_minuteMatcher = value;
		}
		public function get minuteMatcher():ValueMatcherSet
		{
			return _minuteMatcher;
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * The ValueMatcher for the "hour" field.
		 */
		public function set hourMatcher(value:ValueMatcherSet):void
		{
			_hourMatcher = value;
		}
		public function get hourMatcher():ValueMatcherSet
		{
			return _hourMatcher;
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * The ValueMatcher for the "day of month" field.
		 */
		public function set dayOfMonthMatcher(value:ValueMatcherSet):void
		{
			_dayOfMonthMatcher = value;
		}
		public function get dayOfMonthMatcher():ValueMatcherSet
		{
			return _dayOfMonthMatcher;
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * The ValueMatcher for the "month" field.
		 */
		public function set monthMatcher(value:ValueMatcherSet):void
		{
			_monthMatcher = value;
		}
		public function get monthMatcher():ValueMatcherSet
		{
			return _monthMatcher;
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * The ValueMatcher for the "day of week" field.
		 */
		public function set dayOfWeekMatcher(value:ValueMatcherSet):void
		{
			_dayOfWeekMatcher = value;
		}
		public function get dayOfWeekMatcher():ValueMatcherSet
		{
			return _dayOfWeekMatcher;
		}
		
		//////////////////////////////////////////////////////////////////////////////////////
		//
		// PUBLIC METHODS
		//
		//////////////////////////////////////////////////////////////////////////////////////

		/**
		 * This methods returns true if the given timestamp (expressed as a UNIX-era
		 * millis value) matches the pattern.
		 * 
		 * @param millis
		 *            The timestamp, as a UNIX-era millis value.
		 * @return true if the given timestamp matches the pattern.
		 */
		public function match(millis:Number):Boolean {
			var gc:Date = new Date();
			gc.setTime(millis);
			var minute:int = gc.minutes;
			var hour:int = gc.hours;
			var dayOfMonth:int = gc.date;
			var month:int = gc.month;
			var dayOfWeek:int = gc.day;
			return minuteMatcher.match(minute) && hourMatcher.match(hour)
					&& dayOfMonthMatcher.match(dayOfMonth)
					&& monthMatcher.match(month + 1)
					&& dayOfWeekMatcher.match(dayOfWeek);
		}
		
		//------------------------------------------------------------------------------------

		/**
		 * This method returns the original string from which the object has been
		 * built.
		 * 
		 * @return The original string from which the object has been built.
		 */
		public function getOriginalString():String
		{
			return originalString;
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * Stringify the cron
		 */
		public function toString():String
		{
			return originalString;
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * 
		 */
		public static function createCronForDate(dt:Date):String
		{
			var df:DateFormatter = new DateFormatter();
			df.formatString = "N J D M E";
			return df.format(dt);
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * Creates a non-repeating cron string for the current datetime
		 */
		public static function createCronForCurrentDate():String
		{
			return createCronForDate(new Date());
		}

		//////////////////////////////////////////////////////////////////////////////////////
		//
		// PRIVATE METHODS
		//
		//////////////////////////////////////////////////////////////////////////////////////
		
		/**
		 * A ValueMatcher utility builder.
		 * 
		 * @param str
		 *            The pattern part for the ValueMatcher creation.
		 * @param minValue
		 *            The minimum value for the field represented by the
		 *            ValueMatcher.
		 * @param maxValue
		 *            The maximum value for the field represented by the
		 *            ValueMatcher.
		 * @param stringEquivalents
		 *            An array of aliases for the numeric values. It can be null if
		 *            no alias is provided.
		 * @return The requested ValueMatcher.
		 * @throws InvalidPatternException
		 *             If the pattern part supplied is not valid.
		 */
		private function buildValueMatcher(str:String, minValue:int, maxValue:int, stringEquivalents:Array = null):IValueMatcher
		{
			if (str.length == 1 && str == "*") 
			{
				return new AlwaysTrueValueMatcher();
			}
			
			var st:Array = str.split("/");
			var tokens:int = st.length;
			if (tokens < 1 || tokens > 2) 
			{
				throw new InvalidPatternException();
			}
			var list:ArrayCollection = buildPart1(""+st[0], minValue, maxValue, stringEquivalents);
			
			if (tokens == 2) 
			{
				list = buildPart2(list, st[1], minValue, maxValue);
			}
			return new IntArrayValueMatcher(list);
		}

		//------------------------------------------------------------------------------------

		private function buildPart1(str:String, minValue:int, maxValue:int, stringEquivalents:Array = null):ArrayCollection
		{
			if (str.length == 1 && str == "*") 
			{
				var ret:ArrayCollection = new ArrayCollection();
				for (var s:int = minValue; s <= maxValue; s++) 
				{
					ret.addItem(s);
				}
				return ret;
			}
			var st:Array = str.split(",");
			if (st.length < 1) 
			{
				throw new InvalidPatternException();
			}
			var list:ArrayCollection = new ArrayCollection();
			
			for(var i:uint = 0; i<st.length; i++)
			{
				var list2:ArrayCollection = buildPart1_1(""+st[i], minValue, maxValue, stringEquivalents);
				var size:int = list2.length;
				for (var i2:uint = 0; i2 < size; i2++) 
				{
					list.addItem(list2.getItemAt(i2));
				}
			}
			return list;
		}

		//------------------------------------------------------------------------------------
	
		private function buildPart1_1(str:String, minValue:int, maxValue:int, stringEquivalents:Array):ArrayCollection
		{
			var st:Array = str.split("-");
			var tokens:int = st.length;
			if (tokens < 1 || tokens > 2) 
			{
				throw new InvalidPatternException();
			}
			var str1:String = ""+st[0];
			var value1:int;
			try 
			{
				value1 = parseInt(str1);
			} 
			catch (e:Error) 
			{
				if (stringEquivalents != null) 
				{
					try 
					{
						value1 = getIntValue(str1, stringEquivalents);
					} 
					catch (e1:Error) 
					{
						throw new InvalidPatternException();
					}
				} 
				else 
				{
					throw new InvalidPatternException();
				}
			}
			if (value1 < minValue || value1 > maxValue) 
			{
				throw new InvalidPatternException("found value out of bounds");
			}
			var value2:int = value1;
			if (tokens == 2) 
			{
				var str2:String = ""+st[1];
				try 
				{
					value2 = parseInt(str2);
				} 
				catch (e:Error) 
				{
					if (stringEquivalents != null) 
					{
						try 
						{
							value2 = getIntValue(str2, stringEquivalents);
						} 
						catch (e1:Error) 
						{
							throw new InvalidPatternException();
						}
					} 
					else 
					{
						throw new InvalidPatternException();
					}
				}
				if (value2 < minValue || value2 > maxValue || value2 <= value1) 
				{
					throw new InvalidPatternException("found value out of bounds");
				}
			}
			
			var list:ArrayCollection = new ArrayCollection();
			for (var i:int = value1; i <= value2; i++) 
			{
				var aux:Number = i;
				if (!list.contains(aux)) 
				{
					list.addItem(aux);
				}
			}
			return list;
		}

		//------------------------------------------------------------------------------------
	
		private function buildPart2(list:ArrayCollection, p2:String, minValue:int, maxValue:int):ArrayCollection
		{
			var div:int = 0;
			try 
			{
				div = parseInt(p2);
			} 
			catch (e:Error) 
			{
				LOGGER.error(e.getStackTrace());
			}
			
			if (div <= minValue || div >= maxValue) 
			{
				throw new InvalidPatternException();
			}
			var size:int = list.length;
			var list2:ArrayCollection = new ArrayCollection();
			for (var i:int = 0; i < size; i++) {
				var aux:Number = list.getItemAt(i) as Number;
				if (aux % div == 0) 
				{
					list2.addItem(aux);
				}
			}
			return list2;
		}

		//------------------------------------------------------------------------------------

		/**
		 * This utility method changes an alias to an int value.
		 */
		private function getIntValue(value:String, values:Array):int 
		{
			for (var i:int = 0; i < values.length; i++) 
			{
				if (values[i].toString().toLowerCase() == value) 
				{
					return i;
				}
			}
			throw new Error();
		}
	}
}