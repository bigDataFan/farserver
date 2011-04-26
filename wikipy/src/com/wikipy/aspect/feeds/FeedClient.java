package com.wikipy.aspect.feeds;

import it.sauronsoftware.feed4j.FeedIOException;
import it.sauronsoftware.feed4j.FeedParser;
import it.sauronsoftware.feed4j.FeedXMLParseException;
import it.sauronsoftware.feed4j.UnsupportedFeedException;
import it.sauronsoftware.feed4j.bean.Feed;
import it.sauronsoftware.feed4j.bean.FeedItem;
import it.sauronsoftware.feed4j.bean.RawAttribute;
import it.sauronsoftware.feed4j.bean.RawElement;
import it.sauronsoftware.feed4j.bean.RawNode;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.PostMethod;

public class FeedClient {
	
	public static SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	public static String postUrl = "http://127.0.0.1/wikipy/postItem";
	


	public static void main(String[] args) {
		
		
	}


	public static void doImport(String feedUrl, String parentId) {
		HttpClient httpClient = new HttpClient();
		httpClient.getParams().setParameter("http.protocol.content-charset", "UTF-8");
		URL url;
		try {
			Feed feed = FeedParser.parse(new URL(feedUrl));
			int items = feed.getItemCount();
			for (int i = 0; i < items; i++) {
				FeedItem item = feed.getItem(i);
				PostMethod postMethod = new PostMethod(postUrl);
				postMethod.addParameter("_title", item.getTitle());
				postMethod.addParameter("_desc", item.getDescriptionAsText());
				postMethod.addParameter("_parentid", parentId);
				
				for (int j = 0; j < item.getAttributeCount(); j++) {
					RawAttribute attr = item.getAttribute(j);
					postMethod.addParameter(attr.getName(), attr.getValue());
				}
				
				for (int j = 0; j < item.getNodeCount(); j++) {
					RawNode node = item.getNode(j);
					if (node instanceof RawElement) {
						RawElement element = (RawElement) node;
						postMethod.addParameter(element.getName(), element.getValue());
					}
				}
				
				postMethod.addParameter("_unique_", item.getLink().toString());
				if (item.getModDate()!=null) {
					postMethod.addParameter("_time_moddate", dateformat.format(item.getModDate()));
				}
				if (item.getPubDate()!=null) {
					postMethod.addParameter("_time_pubdate", dateformat.format(item.getPubDate()));
				}
				
				int status = httpClient.executeMethod(postMethod);
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (FeedIOException e) {
			e.printStackTrace();
		} catch (FeedXMLParseException e) {
			e.printStackTrace();
		} catch (UnsupportedFeedException e) {
			e.printStackTrace();
		} catch (HttpException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
		}
	}
}
