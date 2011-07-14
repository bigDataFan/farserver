package com.ever365.security;

public class AuthenticationException extends RuntimeException
{

    /**
     * 
     */
    private static final long serialVersionUID = 3546647620128092466L;

    public AuthenticationException(String msg)
    {
        super(msg);
    }

    public AuthenticationException(String msg, Throwable cause)
    {
        super(msg, cause);
    }
}
