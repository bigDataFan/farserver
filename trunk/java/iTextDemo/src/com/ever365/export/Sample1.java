package com.ever365.export;

import java.io.FileOutputStream;
import java.io.IOException;

import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.List;
import com.itextpdf.text.ListItem;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

public class Sample1 {
	
	public static void main(String[] args) {
		Sample1 s1 = new Sample1();
		try {
			s1.createPdf("C:\\Users\\liuhan\\Desktop\\1.pdf");
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	  /**
     * Creates a PDF document.
     * @param filename the path to the new PDF document
     * @throws    DocumentException 
     * @throws    IOException 
     */
    public void createPdf(String filename)
	throws DocumentException, IOException {
        // step 1
        Document document = new Document();
        // step 2
        PdfWriter.getInstance(document, new FileOutputStream(filename));
        // step 3
        document.open();
        // step 4
        document.add(new Paragraph("Hello World!"));
        // step 5
        List list = new List(List.ORDERED);
        
        list.add(new ListItem("bbb"));
        list.add(new ListItem("ccc"));
        
        BaseFont bfChinese = BaseFont.createFont("c:/windows/fonts/STSONG.TTF",  BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED); 
        
        document.add(new Paragraph("宋体的汉字能加不",new Font(bfChinese)));
        
        document.add(Chunk.NEWLINE);
       // document.add(list);
        document.add(Sample1.createFirstTable());
        
        Image image = Image.getInstance("http://chart.googleapis.com/chart?cht=lxy&chs=400x240&chd=t:0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29|1355.5,60,16.5,15,0,30,0,80,147,156,0,495.5,0,120,0,83,0,0,1610.1999999999998,0,60.7,26.1,157.8,37.5,194,0,171,173,0,0&chco=3072F3&chxt=x,y&chxr=0,0,30|1,0,1610.1999999999998&chg=10,20&chds=0,30,0,1610.1999999999998&chxl=0:|01-21|01-26|01-31|02-05|02-10|02-15|&chtt=按日支出曲线");
        document.add(image);
        document.close();
    }
    /**
     * Creates our first table
     * @return our first table
     */
    public static PdfPTable createFirstTable() {
    	// a table with three columns
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(90f);
        //table.setWidthPercentage(300 / 5.23f);
        try {
			table.setWidths(new int[]{1,5,10,3,8});
			table.addCell("1");
			table.addCell("2012-1-12");
			table.addCell("This is a text out put");
			table.addCell("22.4");
			PdfPCell infos = new PdfPCell();
			
			table.addCell(infos);
		} catch (DocumentException e) {
			e.printStackTrace();
		}
        return table;
    }
    
    
    
}
