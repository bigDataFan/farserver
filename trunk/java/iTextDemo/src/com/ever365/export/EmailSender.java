package com.ever365.export;

import java.io.IOException;
import java.util.Date;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.NoSuchProviderException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import com.sun.mail.smtp.SMTPTransport;

public class EmailSender {
	
	
	public static void testSend() {
		Properties props = System.getProperties();
		props.put("mail.smtp.host", "smtp.ym.163.com");
		props.put("mail.smtp.port", 25);
		
	    // Get a Session object
	    Session session = Session.getInstance(props, null);
	    try {
	    	  SMTPTransport t =
	    			(SMTPTransport)session.getTransport("smtp");
	    	   MimeMessage msg = new MimeMessage(session);
	    	msg.setFrom(new InternetAddress("yaomy@ever365.com"));
	    	msg.setRecipients(Message.RecipientType.TO, "liuhann@gmail.com");
	    	msg.setSubject("您好 一封测试邮件");
	   	    msg.setSentDate(new Date());
	   	    session.setDebug(true);
	   	     MimeBodyPart mbp1 = new MimeBodyPart();
	   	     mbp1.setText("正文");
	 	    // create the second message part
	 	    MimeBodyPart mbp2 = new MimeBodyPart();

	 	    // attach the file to the message
	 	    mbp2.attachFile("E:\\2012-1-email\\jarryliu001@163.com(2012-1).pdf");
		    Multipart mp = new MimeMultipart();
		    mp.addBodyPart(mbp1);
		    mp.addBodyPart(mbp2);
		    
		    // add the Multipart to the message
		    //msg.setContent(mp);
		    
		    msg.setText("Dear Mail Crawler," +
			"\n\n No spam to my email, please!");

		    t.connect("yaomy@ever365.com", "123456");
		    t.send(msg);
		} catch (NoSuchProviderException e) {
			e.printStackTrace();
		} catch (MessagingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	    
	    
	}
	
	
	public static void main(String[] args) {
		EmailSender.testSend();
	}
	
}
