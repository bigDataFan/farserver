google.calendar.checkLogin();

var cur = db.getCollection("worktimes").find({"sync": null});

while(cur.hasNext()) {
	var o = cur.next();
	o.data;
	
}
