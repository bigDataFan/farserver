if (!user.equals(owner)) {
	response.sendError(403);
}

cats = db.getCollection("categories").find({}).toArray();

cats