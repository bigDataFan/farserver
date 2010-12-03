google.calendar.checkLogin();

var cur = db.getCollection("worktimes").find({"sync": null});

while(cur.hasNext()) {
	var o = cur.next();
	var evarray = evalJsonArray(o.data);
	
	for(var i=0; i<evarray.length; i++) {
		//sync to google calendar
	}
	o.sync = true;
	db.getCollection("worktimes").upsert(o);
}

"OK";
