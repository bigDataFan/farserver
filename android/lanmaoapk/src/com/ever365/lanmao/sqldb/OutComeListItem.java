package com.ever365.lanmao.sqldb;

public class OutComeListItem {

	 private String desc;
	 private String count;
	 private String cat;
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getCount() {
		return count;
	}
	public void setCount(String count) {
		this.count = count;
	}
	public String getCat() {
		return cat;
	}
	public void setCat(String cat) {
		this.cat = cat;
	}
	public OutComeListItem(String desc, String count, String cat) {
		super();
		this.desc = desc;
		this.count = count;
		this.cat = cat;
	}
}
