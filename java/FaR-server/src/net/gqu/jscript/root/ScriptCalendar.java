package net.gqu.jscript.root;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import com.google.gdata.client.calendar.CalendarService;
import com.google.gdata.data.calendar.CalendarEntry;
import com.google.gdata.data.calendar.CalendarFeed;
import com.google.gdata.util.AuthenticationException;
import com.google.gdata.util.ServiceException;

public class ScriptCalendar {
	
	private String username;
	private String password;
	private String token;
	
	public void setAuth(String user, String pwd) {
		this.username = user;
		this.password = pwd;
	}
	
	public void setAuthToken(String token) {
		this.token = token;
	}

	
	public static void main(String[] args) {
		CalendarService myService = new CalendarService("g-qu.net-request");

		try {
			myService.setUserCredentials("liuhann@gmail.com", "Alfresco123");
			
			URL feedUrl = new URL("https://www.google.com/calendar/feeds/default/allcalendars/full");
			CalendarFeed resultFeed = myService.getFeed(feedUrl, CalendarFeed.class);
			System.out.println("Your calendars:");
			System.out.println();
			for (int i = 0; i < resultFeed.getEntries().size(); i++) {
				CalendarEntry entry = resultFeed.getEntries().get(i);
				System.out.println("\t" + entry.getUpdated().toStringRfc822() + " " + entry.getTitle().getPlainText());
			}
		} catch (AuthenticationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ServiceException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	
	
}
