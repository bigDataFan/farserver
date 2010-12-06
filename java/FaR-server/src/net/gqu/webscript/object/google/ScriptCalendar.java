package net.gqu.webscript.object.google;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.TimeZone;

import net.gqu.exception.HttpStatusExceptionImpl;

import com.google.gdata.client.calendar.CalendarQuery;
import com.google.gdata.client.calendar.CalendarService;
import com.google.gdata.data.DateTime;
import com.google.gdata.data.PlainTextConstruct;
import com.google.gdata.data.calendar.CalendarEntry;
import com.google.gdata.data.calendar.CalendarEventEntry;
import com.google.gdata.data.calendar.CalendarEventFeed;
import com.google.gdata.data.calendar.CalendarFeed;
import com.google.gdata.data.calendar.HiddenProperty;
import com.google.gdata.data.calendar.TimeZoneProperty;
import com.google.gdata.data.extensions.When;
import com.google.gdata.util.AuthenticationException;
import com.google.gdata.util.ServiceException;

public class ScriptCalendar {
	
	private static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private String username;
	private String password;
	private String token;
	
	CalendarService calService; 
	
	public void checkLogin() {
		if (username!=null && password!=null) {
			calService = new CalendarService("gqu.net-cal-service");
			try {
				calService.setUserCredentials(username, password);
			} catch (AuthenticationException e) {
				throw new HttpStatusExceptionImpl(412, "Google Calendar AuthenticationException");
			}
		} else if (token!=null) {
			calService = new CalendarService("gqu.net-cal-service");
			calService.setAuthSubToken(token);
		}
	}
	
	private void isLogin() {
		if (calService == null) {
			throw new HttpStatusExceptionImpl(412, "checkLogin() first");
		}
	}
	
	public ScriptCalendar(String token) {
		super();
		this.token = token;
	}
	
	public ScriptCalendar() {
		super();
	}

	public ScriptCalendar(String username, String password) {
		super();
		this.username = username;
		this.password = password;
	}

	public void setAuth(String user, String pwd) {
		this.username = user;
		this.password = pwd;
	}
	
	public void setAuthToken(String token) {
		this.token = token;
	}
	
	
	public CalendarEntry[] getAllCalendarEntries() {
		try {
			isLogin();
			URL feedUrl = new URL("https://www.google.com/calendar/feeds/default/allcalendars/full");
			CalendarFeed resultFeed = calService.getFeed(feedUrl, CalendarFeed.class);
			return resultFeed.getEntries().toArray(new CalendarEntry[resultFeed.getEntries().size()]);
		} catch (MalformedURLException e) {
		} catch (IOException e) {
		} catch (ServiceException e) {
		} 
		return null;
	}
	
	public CalendarEntry[] getOwnedCalendarEntries() {
		try {
			isLogin();
			URL feedUrl = new URL("https://www.google.com/calendar/feeds/default/owncalendars/full");
			CalendarFeed resultFeed = calService.getFeed(feedUrl, CalendarFeed.class);
			return resultFeed.getEntries().toArray(new CalendarEntry[resultFeed.getEntries().size()]);
		} catch (MalformedURLException e) {
		} catch (IOException e) {
		} catch (ServiceException e) {
		} 
		return null;
	}
	
	
	public CalendarEntry createCalendarEntry(String title, String summary, String timezone) {
		isLogin();

		CalendarEntry calendar = new CalendarEntry();
		calendar.setTitle(new PlainTextConstruct(title));
		calendar.setSummary(new PlainTextConstruct(summary));
		calendar.setTimeZone(new TimeZoneProperty(timezone));
		calendar.setHidden(HiddenProperty.FALSE);

		try {
			URL postUrl = new URL("https://www.google.com/calendar/feeds/default/owncalendars/full");
			CalendarEntry returnedCalendar = calService.insert(postUrl, calendar);
			return returnedCalendar;
		} catch (MalformedURLException e) {
		} catch (IOException e) {
		} catch (ServiceException e) {
		}
		return null;
	}

	
	public CalendarEventEntry[] getEvent(String start, String end) {

		try {
			URL feedUrl = new URL("https://www.google.com/calendar/feeds/default/private/full");
			CalendarQuery myQuery = new CalendarQuery(feedUrl);
			myQuery.setMinimumStartTime(DateTime.parseDateTime(start));
			myQuery.setMaximumStartTime(DateTime.parseDateTime(end));
			CalendarEventFeed resultFeed = calService.query(myQuery, CalendarEventFeed.class);
			return resultFeed.getEntries().toArray(new CalendarEventEntry[resultFeed.getEntries().size()]);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ServiceException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	
	public void createEvent(String title, String content, String start, String end) {
		
		CalendarEventEntry myEntry = new CalendarEventEntry();
		myEntry.setTitle(new PlainTextConstruct(title));
		myEntry.setContent(new PlainTextConstruct(content));
		if (start!=null) {
			try {
				When eventTimes = new When();
				DateTime startTime = new DateTime(dateFormat.parse(start), TimeZone.getDefault());
				
				eventTimes.setStartTime(startTime);
				if (end!=null) {
					DateTime endTime = new DateTime(dateFormat.parse(end));
					eventTimes.setEndTime(endTime);
				}
				myEntry.addTime(eventTimes);
			} catch (ParseException e) {
			}
		}
		
		
		try {
			//URL postUrl = new URL("https://www.google.com/calendar/feeds/" + username + "/private/full");
			URL postUrl = new URL("https://www.google.com/calendar/feeds/default/private/full");
			CalendarEventEntry insertedEntry = calService.insert(postUrl, myEntry);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ServiceException e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
		ScriptCalendar sc = new ScriptCalendar("liuhann@gmail.com", "Alfresco123");
		sc.checkLogin();
		sc.createEvent("今天去吃饭了", "xxxxx", "2010-12-05 16:00:00",null);

		
		//CalendarEventEntry[] events = sc.getEvent("2008-12-01T00:00:00-18:00", "2010-12-05T00:00:00-18:00");
		
		/*
		for (int i = 0; i < events.length; i++) {
			System.out.println(events[i].getTimes().get(0).getValueString() + "  " + events[i].getTitle());
		}
		*/
	}
	
	
	
}
