package com.ever365.rest.registry;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface RestService {
	String method();
	String uri();
	boolean transactional() default true;
	boolean multipart() default false;
}
