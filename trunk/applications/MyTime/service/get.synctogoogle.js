google.calendar.checkLogin();

var cur = db.getCollection("worktimes").find({"sync": null});

while(cur.hasNext()) {
	var o = cur.next();
	var evarray = utils.evalJsonArray(o.data);
	
	for(var i=0; i<evarray.length; i++) {
		var item = evarray[i];
		//sync to google calendar
		var std = new Date(item.start);
		google.calendar.createEvent(item.desc, "", std.getFullYear()+"-"+(std.getMonth()+1)+"-" + std.getDate()
				+ " " + std.getHours() + ":" + std.getMinutes() + ":" + std.getSeconds());
		" yyyy-MM-dd HH:mm:ss";
	}
	o.sync = true;
	db.getCollection("worktimes").upsert(o);
}

"OK";
