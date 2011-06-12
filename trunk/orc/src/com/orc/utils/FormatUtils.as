package com.orc.utils
{
	import flash.text.TextFormat;
	
	import mx.formatters.Formatter;

	public class FormatUtils
	{
		public function FormatUtils()
		{
		}
		
		public static function formatDate(o:Object):String {
			var date:Date;
			if (o is Date) {
				date = o as Date;
			} else {
				date = new Date(o["time"]);
			}
			if (date==null) return "错误的时间格式";
			return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
		}
	}
}