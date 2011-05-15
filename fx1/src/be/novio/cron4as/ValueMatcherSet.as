package be.novio.cron4as
{
	import mx.collections.ArrayCollection;
	
	/**
	 * A ValueMatcher compounded by others ValueMatchers. It validates a value
	 * checking its validity againts its inner-matchers. If at least one
	 * inner-matcher finds valid the value, then the whole matcher will account it
	 * as valid.
	 * 
	 * @author Hans Van de Velde
	 * modified from Carlo Pelliccia's Cron4J:
     * http://www.sauronsoftware.it/projects/cron4j/ 
	 */
	public class ValueMatcherSet implements IValueMatcher
	{
		/**
		 * The inner-matchers.
		 */
		private var matchers:ArrayCollection = new ArrayCollection();
	
		/**
		 * Add a ValueMatcher to the set.
		 * 
		 * @param valueMatcher
		 *            The ValueMatcher.
		 */
		public function addValueMatcher(valueMatcher:IValueMatcher):void 
		{
			matchers.addItem(valueMatcher);
		}
		
		//------------------------------------------------------------------------------------
		
		/**
		 * Returns the collection of possible matches
		 */
		public function getMatchers():ArrayCollection
		{
			return matchers;
		}
		
		//------------------------------------------------------------------------------------
		
		public function getValues():Array
		{
			var returnArray:Array = new  Array();	
		
			for(var i:uint=0; i<matchers.length; i++)
			{
				var valueMatcher:IValueMatcher = matchers.getItemAt(i) as IValueMatcher;
				returnArray.concat(valueMatcher.getValues());
			}
			
			return returnArray;	
		}
		
		//------------------------------------------------------------------------------------
	
		/**
		 * Returns true if at least one inner-matcher does it.
		 */
		public function match(value:int):Boolean  
		{
			for(var i:uint=0; i<matchers.length; i++)
			{
				var valueMatcher:IValueMatcher = matchers.getItemAt(i) as IValueMatcher;
				if(valueMatcher.match(value))
				{
					return true;
				}		
			}
			return false;
		}
	}
}