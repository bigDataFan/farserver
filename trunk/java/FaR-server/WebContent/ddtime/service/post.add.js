if (user.isGuest()) {
	response.sendError(401);
}

if (!user.equals(owner)) {
	response.sendError(403);
}


var item = new Object();
item.start = new Date().getTime();
item.desc = params.desc;
item.running = false;
item.dura = 0;
item.begins = 0;
db.getCollection("activities").insert(item);

item;