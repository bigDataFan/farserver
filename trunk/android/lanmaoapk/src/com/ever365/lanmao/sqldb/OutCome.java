package com.ever365.lanmao.sqldb;

import java.util.Date;
import java.util.List;

public class OutCome {

	private List<OutComeListItem> items;
	private String title;
	private String id;
	private String desc;
	private String method;
	private String type;
	private Float total;
	private Date date;
	private Date updated;
	public List<OutComeListItem> getItems() {
		return items;
	}
	public void setItems(List<OutComeListItem> items) {
		this.items = items;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getMethod() {
		return method;
	}
	public void setMethod(String method) {
		this.method = method;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Float getTotal() {
		return total;
	}
	public void setTotal(Float total) {
		this.total = total;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public Date getUpdated() {
		return updated;
	}
	public void setUpdated(Date updated) {
		this.updated = updated;
	}
	
	
	
	
}
