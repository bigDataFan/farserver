package com.ever365.utils
{
	import flash.desktop.DockIcon;
	import flash.desktop.NativeApplication;
	import flash.desktop.SystemTrayIcon;
	import flash.display.NativeMenu;
	import flash.display.NativeMenuItem;
	import flash.events.Event;
	import flash.events.InvokeEvent;
	import flash.events.MouseEvent;
	import flash.events.ScreenMouseEvent;

	public class SystemTrayUtils
	{
		public function SystemTrayUtils()
		{
			
		}
		
		public static function drawTrayIcon(bitmaps:Array, dbclick:Function):void {
			
			if(NativeApplication.supportsDockIcon){
				var dockIcon:DockIcon = NativeApplication.nativeApplication.icon as DockIcon;
				NativeApplication.nativeApplication.addEventListener(InvokeEvent.INVOKE, undock);
				//dockIcon.menu = createIconMenu();
			} else if (NativeApplication.supportsSystemTrayIcon){
				var sysTrayIcon:SystemTrayIcon =
					NativeApplication.nativeApplication.icon as SystemTrayIcon;
				sysTrayIcon.tooltip = "Stopwatch";
				sysTrayIcon.addEventListener(MouseEvent.CLICK,undock);
				sysTrayIcon.addEventListener(ScreenMouseEvent.CLICK, dbclick);
				sysTrayIcon.addEventListener(MouseEvent.DOUBLE_CLICK, dbclick);
				//sysTrayIcon.menu = createIconMenu();
			}
			
			NativeApplication.nativeApplication.icon.bitmaps = bitmaps;
		}
		
		
		public static function createDockIconMenu(value:String, cb:Function): void {
			var iconMenu:NativeMenu = new NativeMenu();
			if(NativeApplication.supportsDockIcon){
				var dockIcon:DockIcon = NativeApplication.nativeApplication.icon as DockIcon;
				
				if (dockIcon.menu==null) {
					dockIcon.menu = iconMenu;
				} else {
					iconMenu = dockIcon.menu;
				}
				
			} else if (NativeApplication.supportsSystemTrayIcon){
				var sysTrayIcon:SystemTrayIcon =
					NativeApplication.nativeApplication.icon as SystemTrayIcon;
				
				if (sysTrayIcon.menu==null) {
					sysTrayIcon.menu = iconMenu;
				} else {
					iconMenu = sysTrayIcon.menu;
				}
			}
			
			if (value=="") {
				var startCommand:NativeMenuItem = new NativeMenuItem("",true);
				iconMenu.addItem(startCommand);
				
			} else {
				var startCommand:NativeMenuItem = new NativeMenuItem(value);
				iconMenu.addItem(startCommand);
			}
			if (cb!=null) {			
				startCommand.addEventListener(Event.SELECT, cb);
			}
		}
		
		protected function toggleTimer(event:Event):void
		{
			// TODO Auto-generated method stub
			
		}		
		
		public static function removeTrayIcon(bitmaps:Array):void {
			NativeApplication.nativeApplication.icon.bitmaps = [];
		}
		
		protected static function undock(event:ScreenMouseEvent):void
		{
				
		}
	}
}