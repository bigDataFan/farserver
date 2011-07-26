package com.ever365.rest.registry;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;


@Retention(RetentionPolicy.RUNTIME)
public @interface RestParam {
	String value() default "";
}
