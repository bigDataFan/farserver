package com.ever365.security;

import org.scribe.model.Token;


public class AuthenticationUtil
{
    public interface RunAsWork<Result>
    {
        /**
         * Method containing the work to be done in the user transaction.
         * 
         * @return Return the result of the operation
         */
        Result doWork() throws Exception;
    }
    
    public static ThreadLocal<String> currentUser = new ThreadLocal<String>();
    public static ThreadLocal<Boolean> guest =  new ThreadLocal<Boolean>();
    public static ThreadLocal<Boolean> admin =  new ThreadLocal<Boolean>();
    
    public static ThreadLocal<Token> sinaAccessToken = new ThreadLocal<Token>();
    
    public static final String SYSTEM_USER_NAME = "system";
    
    
    
    
    public static Token getSinaAccessToken() {
		return sinaAccessToken.get();
	}


	public static void setSinaAccessToken(Token t) {
		sinaAccessToken.set(t);
	}


	public static void setCurrentUser(String user) {
    	currentUser.set(user);
    }
    
    
    public static boolean isCurrentUserAdmin() {
    	return admin.get();
    }
    
    public static boolean isCurrentUserGuest() {
    	return guest.get();
    }
    
    public static void setCurrrentUserAdmin(Boolean b) {
    	admin.set(b);
    }
    
	public static void setCurrentAsGuest(Boolean b) {
		guest.set(b);
	}
	
	
	public static String getCurrentUser() {
    	return currentUser.get();
    }
  
	public static String getCurrentUserName() {
		return currentUser.get();
	}
	
    /**
     * Remove the current security information
     */
    public static void clearCurrentSecurityContext()
    {
    	currentUser.set(null);
    	guest.set(true);
    	admin.set(false);
    }
}
