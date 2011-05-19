package com.fx
{
	import flash.text.TextFormat;
	
	import mx.formatters.Formatter;

	public class FormatUtils
	{
		public function FormatUtils()
		{
		}
		
		public static function formatDate(date:Date):String {
			return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
		}
	}
}