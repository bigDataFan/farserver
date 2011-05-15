package be.novio.utils
{
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	import flash.utils.getTimer;
	
	public class SteadyTimer
	{
		private var baseDelay:Number;
		private var startTime:Number;
		private var counter:int;
		private var timer:Timer;
		
		/**
		 * Using composition here because
		 * the Timer still lags behind (regardless the corrections) if we use enheritance (!)
		 */		
		public function SteadyTimer(delay:Number, repeatCount:int=0)
		{
			baseDelay = delay;
			timer = new Timer(delay, repeatCount);
		}
		
		public function addTimerEventListener(handler:Function):void
		{
			timer.addEventListener(TimerEvent.TIMER, handler); 
		}
		
		public function removeTimerEventListener(handler:Function):void
		{
			timer.removeEventListener(TimerEvent.TIMER, handler); 
		}
		
		public function start():void
		{
			timer.removeEventListener(TimerEvent.TIMER, timerCorrectionHandler);
			timer.addEventListener(TimerEvent.TIMER, timerCorrectionHandler);
			timer.start();
			startTime = getTimer();
			counter = 0;
		}
		
		public function stop():void
		{
			timer.removeEventListener(TimerEvent.TIMER, timerCorrectionHandler);
			timer.stop();
		}
		
		/**
		 * Handler in which we constantly correct the offset 
		 * by adapting the delay until the next tick
		 */
		private function timerCorrectionHandler(tEvent:TimerEvent):void
		{
			counter++;

			var now:Number = getTimer();
			var diffTime:Number = now - startTime;
			var expectedDiff:Number= counter * baseDelay;
			var offset:Number =  expectedDiff - diffTime; 
			var newDelay:Number = baseDelay + offset; 
			
			if(newDelay < 0) newDelay = baseDelay;
			
			timer.delay = newDelay;
		}
	}
}