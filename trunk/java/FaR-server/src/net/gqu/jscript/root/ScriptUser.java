package net.gqu.jscript.root;

import net.gqu.security.AuthenticationUtil;
import net.gqu.security.User;

public class ScriptUser {
	
	private User user;
	public ScriptUser(User user) {
		super();
		this.user = user;
	}
	
	public String getName() {
		return user==null?AuthenticationUtil.getGuestUserName():user.getName();
	}
	
	public boolean isGuest() {
		return user==null;
	}

	
	@Override
	public String toString() {
		return this.getName();
	}
	
}
