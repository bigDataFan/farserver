package net.gqu.webscript;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;

public class CounteredContextFactory extends ContextFactory {
	
	public static int COUNTER_INTERVAL = 100;
	public static int MAX_OBSERVE = 10000;
	private int i = 0;
	
	@Override
	protected void observeInstructionCount(Context cx, int instructionCount) {
		i ++;
		if (i>MAX_OBSERVE) {
			throw new TooManyInstructionException();
		}
	}

}
