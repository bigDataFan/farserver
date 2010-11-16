package net.gqu.security;

import net.gqu.utils.BasicTestCase;

public class UserServiceTestCase extends BasicTestCase {

	
	
	private BasicUserService userService = (BasicUserService) ctx.getBean("userService");
	private String roles = "testusers";
	private String noneopenRoles = "testNoneopenRoles";

	protected void setUp() throws Exception {
		super.setUp();
		if (userService.getRole(roles)==null) {
			userService.createRole(roles, 100, 10000, true);
		}
		if (userService.getRole(noneopenRoles)==null) {
			userService.createRole(noneopenRoles, 1000000, 100000000, false);
		}
	}	 

	protected void tearDown() throws Exception {
		super.tearDown();
	}
	
	public void testAll() {
		String userName = "TestUser" + System.currentTimeMillis();
		userService.createUser(userName, "123456", roles, "abc@g-qu.net");
		
		assertNotNull(userService.getUser(userName));
		
		String userNameb = "TestUser" + System.currentTimeMillis();
		boolean result = userService.createUser(userNameb, "123456", noneopenRoles, "abc@g-qu.net");
		assertFalse(result);
		
		AuthenticationUtil.setCurrrentUserAdmin();
		result = userService.createUser(userNameb, "123456", noneopenRoles, "abc@g-qu.net");
		assertTrue(result);
		
		
		
		User user = userService.getUser(userName);
		user.setDisabled(true);
		userService.updateUser(user);
		
		user = userService.getUser(userName);
		assertTrue(user.isDisabled());
		
		
		assertTrue(userService.getRoles().size()>=2);
		
		
		
	}

}