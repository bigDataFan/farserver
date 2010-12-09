package net.gqu.webscript;

public class HttpStatusExceptionImpl extends RuntimeException {
	
	private static final long serialVersionUID = 1L;
	private int code;
	private String description;

	
	public HttpStatusExceptionImpl(int code) {
		super();
		this.code = code;
	}
	
	public HttpStatusExceptionImpl(int code, String description) {
		super();
		this.code = code;
		this.description = description;
	}

	public int getCode() {
		return code;
	}

	public String getDescription() {
		return description;
	}

	public String getName() {
		return null;
	}

	public String getUri() {
		// TODO Auto-generated method stub
		return null;
	}

}
