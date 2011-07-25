package com.orc.utils
{
	public class StringUtils
	{
		public function StringUtils()
		{
		}
		
		
		public static function getParentPath(str:String):String {
			var last:int = str.lastIndexOf("/");
			
			if (last >0) {
				return str.substring(0, last);
			} else {
				return str;
			}
			
		}
		
		public static function getFileName(str:String):String {
			var last:int = str.lastIndexOf("/");
			
			if (last >0) {
				return str.substring(last+1);
			} else {
				return str;
			}
		}
	}
}