package be.novio.cron4as
{
	import mx.collections.ArrayCollection;
	
	public class IntArrayValueMatcher implements IValueMatcher
	{
		/**
		 * The accepted values.
		 */
		private var values:Array;

		/**
		 * Constructor, builds the ValueMatcher.
		 * 
		 * @param integers
		 *            An ArrayList of Integer elements, one for every value accepted
		 *            by the matcher. The match() method will return true only if
		 *            its parameter will be one of this list.
		 */
		function IntArrayValueMatcher(integers:ArrayCollection)
		{
			var size:Number = integers.length;
			values = new Array();
			
			for (var i:int = 0; i < size; i++) 
			{
				try 
				{
					values[i] = 0 + integers.getItemAt(i);
				} 
				catch (e:Error) 
				{
					throw new Error(e.message);
				}
			}
		}
		
		//////////////////////////////////////////////////////////////////////////////////////
		//
		// PUBLIC METHODS
		//
		//////////////////////////////////////////////////////////////////////////////////////

		/**
		 * Getter of the expanded array of matching integers 
		 */
		public function getValues():Array
		{
			return values;
		}
		
		//------------------------------------------------------------------------------------

		/**
		 * Returns true if the given value is included in the matcher list.
		 */
		public function match(value:int):Boolean 
		{
			for (var i:int = 0; i < values.length; i++) 
			{
				if (values[i] == value) 
				{
					return true;
				}
			}
			return false;
		}
	}
}