package be.novio.utils
{
	
	/**
	 * Simple utility class to calculate with Date objects
	 * @author Hans Van de Velde
	 */
	public class DateFunction
	{
		
		/////////////////////////////////////////////////////////////////////
		//
		// PROPERTIES
		//
		/////////////////////////////////////////////////////////////////////
		
		public static const DIFFSECONDS:String = "s";
		public static const DIFFMINUTES:String = "n";
		public static const DIFFHOURS:String = "h";
		public static const DIFFDAYS:String = "d";
		public static const DIFFMONTHS:String = "m";
		public static const DIFFYEARS:String = "y";

		public static const ADDSECONDS:String = "s";
		public static const ADDMINUTES:String = "n";
		public static const ADDHOURS:String = "h";
		public static const ADDDAYS:String = "d";
		public static const ADDYEARS:String = "y";
		
		
		/////////////////////////////////////////////////////////////////////
		//
		// PUBLIC METHODS
		//
		/////////////////////////////////////////////////////////////////////
		
		/**
		 * dateDiff(datePart:String, date1:Date, date2:Date):Number<br/>
		 * returns the difference between 2 dates<br/>
		 * valid dateParts:<br/>
		 * s: Seconds<br/>
		 * n: Minutes<br/>
		 * h: Hours<br/>
		 * d: Days<br/>
		 * m: Months<br/>
		 * y: Years
		 */
	 	public static function dateDiff(datePart:String, date1:Date, date2:Date):Number
	 	{
			return getDatePartHashMap()[datePart.toLowerCase()](date1,date2);
		}
		
		//-------------------------------------------------------------------
		
		/**
		 * dateAdd(dateAddUnit:String, unitSize:Number, date:Date)
		 * returns new date with the added time<br/>
		 * valid dateAddUnits:<br/>
		 * s: Seconds<br/>
		 * n: Minutes<br/>
		 * h: Hours<br/>
		 * d: Days<br/>
		 * y: Years
		 */
	 	public static function dateAdd(dateAddUnit:String, unitSize:Number, date:Date):Date
	 	{
			var myDate:Date = new Date(date.getTime());
			return getDateAddUnitHashMap()[dateAddUnit.toLowerCase()](unitSize, myDate);
		}
		
		//-------------------------------------------------------------------
		
		/**
		 * stripTime(date:Date)
		 * returns new date without the time
		 */
	 	public static function stripTime(date:Date):Date
	 	{
			var myDate:Date = new Date(date.fullYear, date.getMonth(), date.getDate());
			return myDate;
		}
		
		/////////////////////////////////////////////////////////////////////
		//
		// PRIVATE METHODS
		//
		/////////////////////////////////////////////////////////////////////
		
		/**
		 * mapping datePart with the getter functions 
		 */
		private static function getDatePartHashMap():Object
		{
			var dpHashMap:Object = new Object();
			dpHashMap[DIFFSECONDS] = getSeconds;
			dpHashMap[DIFFMINUTES] = getMinutes;
			dpHashMap[DIFFHOURS] = getHours;
			dpHashMap[DIFFDAYS] = getDays;
			dpHashMap[DIFFMONTHS] = getMonths;
			dpHashMap[DIFFYEARS] = getYears;
			return dpHashMap;
		}
		
		/**
		 * mapping dateAddUnit with the date add calc functions 
		 */
		private static function getDateAddUnitHashMap():Object
		{
			var daHashMap:Object = new Object();
			daHashMap[ADDSECONDS] = addSeconds;
			daHashMap[ADDMINUTES] = addMinutes;
			daHashMap[ADDHOURS] = addHours;
			daHashMap[ADDDAYS] = addDays;
			daHashMap[ADDYEARS] = addYears;
			return daHashMap;
		}
		
		//---------------------------------------------------------------------
		
		/**
		 * All get functions below are cascading up to the function compareDates
		 */
		private static function compareDates(date1:Date,date2:Date):Number
		{
			return date1.getTime() - date2.getTime();
		}
		private static function getSeconds(date1:Date,date2:Date):Number
		{
			return Math.floor(compareDates(date1,date2)/1000);
		}
		private static function getMinutes(date1:Date,date2:Date):Number
		{
			return Math.floor(getSeconds(date1,date2)/60);
		}
		private static function getHours(date1:Date,date2:Date):Number
		{
			return Math.floor(getMinutes(date1,date2)/60);
		}
		private static function getDays(date1:Date,date2:Date):Number
		{
			return Math.floor(getHours(date1,date2)/24);
		}
		private static function getMonths(date1:Date,date2:Date):Number
		{
			var yearDiff:Number = getYears(date1,date2);
			var monthDiff:Number = date1.getMonth() - date2.getMonth();
			if(monthDiff < 0){
				monthDiff += 12;
			}
			if(date1.getDate()< date2.getDate()){
				monthDiff -=1;
			}
			return 12 *yearDiff + monthDiff;
		}
		private static function getYears(date1:Date,date2:Date):Number
		{
			return Math.floor(getDays(date1,date2)/365);
		}
		
		//---------------------------------------------------------------------
		
		private static function addSeconds(nbSeconds:Number, date:Date):Date
		{
			var ms:Number = date.getTime();
			ms += nbSeconds*1000;
			date.setTime(ms);
			return date;
		}
		private static function addMinutes(nbMinutes:Number, date:Date):Date
		{
			var ms:Number = date.getTime();
			ms += nbMinutes*60*1000;
			date.setTime(ms);
			return date;
		}
		private static function addHours(nbHours:Number, date:Date):Date
		{
			var ms:Number = date.getTime();
			ms += nbHours*60*60*1000;
			date.setTime(ms);
			return date;
		}
		private static function addDays(nbDays:Number, date:Date):Date
		{
			/*
			// this calculation creates a problem with daylight savings time (difference summertime & wintertime)
			var ms:Number = date.getTime();
			ms += nbDays*24*60*60*1000;
			date.setTime(ms);
			*/
			date.date += nbDays;
			return date;
		}
		private static function addYears(nbYears:Number, date:Date):Date
		{
			var ms:Number = date.getTime();
			ms += nbYears*365*24*60*60*1000;
			date.setTime(ms);
			return date;
		}
	}
}