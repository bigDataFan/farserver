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
		
		
		public static function formatHT(o:Object):String {
			var date:Date;
			if (o is Date) {
				date = o as Date;
			} else {
				date = new Date(o["time"]);
			}
			if (date==null) return "错误的时间格式";
			return date.getHours() + ":" + (date.getMinutes()<10?("0" + date.getMinutes()):date.getMinutes());
		}
		
		
		
		public static function formatYMD(o:Object):String {
			var date:Date;
			if (o is Date) {
				date = o as Date;
			} else {
				date = new Date(o["time"]);
			}
			if (date==null) return "错误的时间格式";
			return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
		}
		
		
		public static function formatDateToId(o:Object):String {
			var date:Date;
			if (o is Date) {
				date = o as Date;
			} else {
				date = new Date(o["time"]);
			}
			if (date==null) return "错误的时间格式";
			return date.getFullYear() + "" + (date.getMonth()+1) + "" + date.getDate();
		}

		
		public static function isToday(date:Date):Boolean {
			var today:Date = new Date();
			
			return (today.getFullYear()==date.getFullYear()) && (today.getMonth()==date.getMonth()) && (today.getDate()==date.getDate());
			
		}
		
		
		
	}
}