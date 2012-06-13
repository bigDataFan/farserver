package com.ever365.farsvr.rest;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;


@Retention(RetentionPolicy.RUNTIME)
public @interface RestParam {
	String value() default "";
}
