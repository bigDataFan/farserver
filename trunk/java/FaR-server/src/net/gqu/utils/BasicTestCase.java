package net.gqu.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;


import junit.framework.TestCase;

public class BasicTestCase extends TestCase {

	private static Log logger = LogFactory.getLog(BasicTestCase.class);
	
	public static ApplicationContext ctx = new ClassPathXmlApplicationContext(
			new String[] {"classpath:core-service-context.xml"});

	
	@Override
	protected void setUp() throws Exception {
		// TODO Auto-generated method stub
		super.setUp();
	}

	@Override
	protected void tearDown() throws Exception {
		// TODO Auto-generated method stub
		super.tearDown();
	}
	
}
