package net.gqu.security;

import net.gqu.exception.HttpStatusExceptionImpl;


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
    public static ThreadLocal<String> contextUser = new ThreadLocal<String>();
    
    public static final String SYSTEM_USER_NAME = "system";
    public static final String GUEST_USER_NAME = "guest";
    public static final String ADMIN_USER_NAME = "admin";
    
    
    public static void setContextUser(String user) {
    	contextUser.set(user);
    }
    
    
    public static void setCurrentUser(String user) {
    	currentUser.set(user);
    }
    
    public static boolean isCurrentUserAdmin() {
    	return (currentUser.get()==null)? false: (currentUser.get().equals(ADMIN_USER_NAME));
    }
    
    public static void setCurrrentUserAdmin() {
    	currentUser.set(ADMIN_USER_NAME);
    }
    
	public static void setCurrentAsGuest() {
		AuthenticationUtil.currentUser.set(GUEST_USER_NAME);
	}
	
	public static boolean isCurrentLogon() {
		return (currentUser.get()!=null && !currentUser.get().equals(GUEST_USER_NAME)); 
	}
	
	public static String getContextUser() {
    	return contextUser.get();
    }
	
	
	public static String getCurrentUser() {
    	return currentUser.get();
    }
  
	public static String getCurrentUserName() {
		if (currentUser.get()!=null) {
			return currentUser.get();
		} else {
			return GUEST_USER_NAME;
		}
	}
	

	public static String getContextUserName() {
		if (contextUser.get()!=null) {
			return contextUser.get();
		} else {
			throw new HttpStatusExceptionImpl(509);
		}
	}
	
	/**
     * Get the name of the system user
     * 
     * @return String
     */
    public static String getSystemUserName()
    {
        return SYSTEM_USER_NAME;
    }

    /**
     * Get the name of the Guest User
     */
    public static String getGuestUserName()
    {
        return GUEST_USER_NAME;
    }

    /**
     * Remove the current security information
     */
    public static void clearCurrentSecurityContext()
    {
    	currentUser.set(null);
    	contextUser.set(null);
    }
}
