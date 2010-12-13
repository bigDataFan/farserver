if (!user.equals(owner)) {
	response.sendError(403);
}
db.getCollection("blogs").remove({"id":params.id});


"Removed!";
