google.calendar.checkLogin();

var today = new Date();

dateStr = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();

var cur = db.getCollection("worktimes").find({"sync": {"$ne":true},"dateStr":{"$ne":dateStr}});

var count_sync = 0;

while(cur.hasNext()) {
	var o = cur.next();
	var evarray = utils.evalJsonArray(o.data);
	
	for(var i=0; i<evarray.length; i++) {
		var item = evarray[i];
		//sync to google calendar
		var std = new Date(item.start);
		google.calendar.createEvent(item.desc, "", std.getFullYear()+"-"+(std.getMonth()+1)+"-" + std.getDate()
				+ " " + std.getHours() + ":" + std.getMinutes() + ":" + std.getSeconds(), null);
		count_sync++;
	}
	o.sync = true;
	db.getCollection("worktimes").upsert(o);
}

count_sync;
