if (user.isGuest()) {
	response.sendError(401);
}

if (!user.equals(owner)) {
	response.sendError(403);
}

db.getUserCollection("activities").upsert(
		{"start" : params.id}, 
		{"$set"  : {"desc" : params.content} }
	);
"1";

