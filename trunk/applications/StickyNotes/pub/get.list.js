if (!user.equals(owner)) {
	response.sendError(403);
}

db.getCollection("stickynotes").find({}).toArray();


