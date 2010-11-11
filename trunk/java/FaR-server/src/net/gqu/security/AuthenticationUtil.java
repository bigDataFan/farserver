package net.gqu.security;


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
    public static ThreadLocal<User> currentUser = new ThreadLocal<User>();
    
    public static final String SYSTEM_USER_NAME = "system";
    public static final String GUEST_USER_NAME = "guest";
    
    
    public static void setCurrentUser(User user) {
    	currentUser.set(user);
    }
    
    public static boolean isCurrentUserAdmin() {
    	return currentUser.get().getName().equals(SYSTEM_USER_NAME);
    }
    
	public static void setCurrentAsGuest() {
		AuthenticationUtil.currentUser.set(null);
	}
	
	public static boolean isCurrentLogon() {
		return (currentUser.get()!=null && !currentUser.get().getName().equals(GUEST_USER_NAME)); 
	}
	
	public static User getCurrentUser() {
    	return currentUser.get();
    }
	
  
	public static String getCurrentUserName() {
		if (currentUser.get()!=null) {
			return currentUser.get().getName();
		} else {
			return GUEST_USER_NAME;
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
    }


        
}
