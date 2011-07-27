package net.gqu.webscript.object;

import com.ever365.security.AuthenticationUtil;
import com.ever365.security.UserService;


public class ScriptUser {
	
	private String name;
	private UserService userService;
	
	
	public ScriptUser(String name, UserService userService) {
		super();
		this.name = name;
		this.userService = userService;
	}

	public ScriptUser(String name) {
		super();
		this.name = name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	public String getName() {
		return name;
	}
	
	public boolean isAdmin() {
		return AuthenticationUtil.isCurrentUserAdmin();
	}
	
	public boolean isGuest() {
		return AuthenticationUtil.GUEST_USER_NAME.equals(name);
	}
	
	public long getFileLimit() {
		if (AuthenticationUtil.GUEST_USER_NAME.equals(name)) {
			return 0;
		} else {
			return userService.getRole(userService.getUser(name).getRole()).getContentSize();
		}
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof ScriptUser) {
			return ((ScriptUser) obj).getName().equals(name);
		} else {
			return super.equals(obj);
		}
	}


	
	
}
