if (user.isGuest()) {
	response.sendError(401);
}

if (!user.equals(owner)) {
	response.sendError(403);
}

if (params.start) {
	db.getCollection("activities").upsert(
			{"start" : params.start}, 
			{"$set"  : {"desc" : params.content} }
	);
} else {
	var item = new Object();
	item.start = new Date().getTime();
	item.desc = params.desc;
	item.running = false;
	item.dura = 0;
	item.begins = 0;
	db.getCollection("activities").insert(item);
	item;
}

response.sendRedirect("../index.gs");


