if (user.isGuest()) {
	response.sendError(401);
}

if (!user.equals(owner)) {
	response.sendError(403);
}

//stop all runnings;
var runnings = db.getUserCollection("activities").find({"running" : true});

while(runnings.hasNext()) {
	var item = runnings.next();
	item.running = false;
	item.dura += new Date().getTime() - item.begins;
	db.getUserCollection("activities").upsert(item);
}

"1";
