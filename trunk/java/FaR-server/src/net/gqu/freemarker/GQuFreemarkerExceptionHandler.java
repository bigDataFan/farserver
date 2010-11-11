package net.gqu.freemarker;

import java.io.IOException;
import java.io.Writer;

import freemarker.core.Environment;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;

public class GQuFreemarkerExceptionHandler implements TemplateExceptionHandler {

	@Override
	public void handleTemplateException(TemplateException te, Environment env,
			Writer out) throws TemplateException {
		try {
			out.append("<span><font color='red'>FTL error: " + te.getMessage() + "</font></span>");
		} catch (IOException e) {
			
		}
	}

}
