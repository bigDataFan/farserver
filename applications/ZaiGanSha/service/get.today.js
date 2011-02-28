if (user.isGuest()) {
	response.sendError(401);
}

if (!user.equals(owner)) {
	response.sendError(403);
}


var b = new Date();
b.setHours(0, 0, 0, 0);

db.getCollection("activities").find({
				"start":{
					"$gte": b.getTime(),
					"$lte": b.getTime()+24*60*60*1000
				}
			}).toArray();