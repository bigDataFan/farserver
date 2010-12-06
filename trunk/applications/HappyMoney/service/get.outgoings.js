
var model = new Object();
var recents = db.getCollection("outcomes").findRecent({}).limit(10);

model.recents = recents.toArray();
var d = new Date();
var weekbegin = getWeekFirstDay();

model.today = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate();
model.week = weekbegin.getFullYear() + "/" + (weekbegin.getMonth()+1) +  "/" + weekbegin.getDate();
model.month = d.getFullYear() + "/" + (d.getMonth()+1) + "/01";

model;

function getWeekFirstDay(){ 
	var Nowdate=new Date();  
	return new Date(Nowdate-(Nowdate.getDay()-1)*86400000);  
}