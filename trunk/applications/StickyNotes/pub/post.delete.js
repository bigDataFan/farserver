if (!user.equals(owner)) {
	response.sendError(403);
}
db.getCollection("stickynotes").remove({"id":params.id});
"1";

