package com.wikipy.rentation;

import java.io.Serializable;

public class Pair<J,F> implements Serializable {

	private J js;
	private F ftl;
	
	public Pair(J js, F ftl) {
		super();
		this.js = js;
		this.ftl = ftl;
	}
	
	

	public Pair() {
		super();
		// TODO Auto-generated constructor stub
	}



	public void setJs(J js) {
		this.js = js;
	}



	public void setFtl(F ftl) {
		this.ftl = ftl;
	}



	public J getJs() {
		return js;
	}

	public F getFtl() {
		return ftl;
	}
}
