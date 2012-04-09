package com.ever365.export;

import java.io.FileOutputStream;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoException;

public class PrintUser {
	public static Mongo mongo = null;
    
	public static Mongo getMongo() {
		if (mongo==null) {
			try {
				mongo = new Mongo("127.0.0.1",27017);
			} catch (UnknownHostException e) {
				e.printStackTrace();
			} catch (MongoException e) {
				e.printStackTrace();
			}
		}
		return mongo;
	}
	
	
	public static void generateForUser(String user, int year, int month, String userName) throws Throwable {
		DB syncdb = getMongo().getDB("sync");
		DBCollection groupcoll = syncdb.getCollection("groupdb");
		
		DBObject dbo = getQuery(user, year, month);
		long c = groupcoll.count(dbo);
		
		
	}
	
	private static DBObject getQuery(String user, int year, int month) {
		DBObject dbo = new BasicDBObject();
		dbo.put("creator", user);
		Map<String, Long> range = new HashMap<String, Long>();
		Date firstDate = new Date(year, month, 1);
		Date nthDate = new Date(firstDate.getTime() + 40 * 24 * 60 *60 * 1000L);
		nthDate.setDate(1);
		nthDate.setHours(0);
		nthDate.setMinutes(0);
		nthDate = new Date(nthDate.getTime()- 8 *60 * 60 *1000L);
		range.put("$gte", firstDate.getTime());
		range.put("$lte", nthDate.getTime());
		dbo.put("time_millsecond", range);
		return dbo;
	}
	
	
	public static void main(String[] args) {
		
		
	}
}
