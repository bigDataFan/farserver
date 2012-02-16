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


public class ReportGenerator {
	
	public static Mongo mongo = null;
	public static String basePath = "E:\\2012-1-email\\";
     

    
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
		
		
		if (c>0) {
			Document document = new Document();
			PdfWriter.getInstance(document, new FileOutputStream(basePath + userName +"(" + (1900+year) + "-" + (month+1) + ").pdf"));
			document.open();
			
			BaseFont bfChinese = BaseFont.createFont("c:/windows/fonts/STSONG.TTF",  BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
			Font font = new Font(bfChinese);
			
			// step 4
			document.add(new Paragraph("用户 " + user + "在" + (1900+year) + "年" + (month+1) + "月记账存档" , font));
			document.add(Chunk.NEWLINE);
			document.add(new Chunk(""));
			
			
			Map<String, Double> categoryMap = new HashMap<String, Double>();
			Double total = 0D;
			
			PdfPTable table = new PdfPTable(6);
	        table.setWidthPercentage(95f);
	        try {
				table.setWidths(new int[]{1,4,8,3,3,8});
				table.addCell(new Paragraph("序号", font));
				table.addCell(new Paragraph("日期", font));
				table.addCell(new Paragraph("详情", font));
				table.addCell(new Paragraph("分类", font));
				table.addCell(new Paragraph("金额", font));
				table.addCell(new Paragraph("其他信息", font));
				
				DBCursor cur = groupcoll.find(dbo).sort(new BasicDBObject("time_millsecond", 1));
				int i = 1;
				while (cur.hasNext()) {
					DBObject o = cur.next();
					table.addCell(new Integer(i).toString());
					table.addCell(new Paragraph((String)o.get("time"), font));
					table.addCell(new Paragraph((String)o.get("title"), font));
					if (o.get("category")!=null) {
						table.addCell(new Paragraph(o.get("category").toString(), font));	
						putCategory(categoryMap, o.get("category").toString(),Double.parseDouble(o.get("total").toString()));
					} else {
						table.addCell(new Paragraph("无", font));
					}
					table.addCell(new Paragraph(o.get("total").toString()));
					
					
					if (o.get("items")!=null) {
						BasicDBList items = (BasicDBList)o.get("items");
						PdfPTable subtable = new PdfPTable(1);
						for (Object object : items) {
							DBObject subitem = (DBObject) object;
							subtable.addCell(new Paragraph((String)subitem.get("title") 
									+ "(" + (String)subitem.get("category") + "):" +subitem.get("cost") + "元", font));
							putCategory(categoryMap, subitem.get("category").toString(),Double.parseDouble(subitem.get("cost").toString()));
						}
						table.addCell(new PdfPCell(subtable));
					} else {
						table.addCell("");
					}
					
					total += Double.parseDouble(o.get("total").toString());
					i ++;
				}
				
				PdfPCell totalCell = new PdfPCell();
				totalCell.setColspan(6);
				totalCell.addElement(new Paragraph("总计:" + Math.round(total*10)/10, font));
				table.addCell(totalCell);
				
				document.add(table);
				document.add(Chunk.NEWLINE);
				
				document.add(new Paragraph("统计信息" , font));
				
				PdfPTable summaryTable = new PdfPTable(2);
				
				for (String  key : categoryMap.keySet()) {
					summaryTable.addCell(new Paragraph(key, font));
					summaryTable.addCell(new Paragraph(categoryMap.get(key).toString()));
				}
				
				document.add(summaryTable);
				
				if (categoryMap.size()>0) {
					StringBuffer ts = new StringBuffer();
					StringBuffer vs = new StringBuffer();
					for (String  key : categoryMap.keySet()) {
						ts.append(categoryMap.get(key)).append(",");
						vs.append(key).append("|");
					}
					
					String url = "http://chart.googleapis.com/chart?cht=p" 
						+ "&chd=t:" + ts.toString().substring(0,ts.length()-1) 
						+ "&chds=a"
						+ "&chl=" + URLEncoder.encode(vs.substring(0, vs.length()-1), "utf-8") 
						+ "$chtt=" + URLEncoder.encode("支出按分类比例", "utf-8") 
						+ "&chs=400x300";
					Image image = Image.getInstance(url);
					image.setWidthPercentage(60f);
					document.add(image);
				}
				document.close();
				System.out.println("user " + user + " OK");
			} catch (DocumentException e) {
				e.printStackTrace();
			}
		}
	}

	public static void putCategory(Map<String, Double> categoryMap, String key, Double v) {
		if (categoryMap.get(key)==null) {
			categoryMap.put(key, v);
		} else {
			categoryMap.put(key, categoryMap.get(key) + v);
		}
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
		try {
			DBCollection userColl = ReportGenerator.getMongo().getDB("systemdb").getCollection("users");
			DBCursor cursor = userColl.find();
			while(cursor.hasNext()) {
				DBObject dbo = cursor.next();
				try {
					ReportGenerator.generateForUser((String)dbo.get("name"), 2012-1900, 0, (String)dbo.get("email"));
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			
			//ReportGenerator.generateForUser("jizhang", 2012-1900, 1, "jizhang");
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}
	
}
