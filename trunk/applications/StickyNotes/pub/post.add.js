if (!user.equals(owner)) {
	response.sendError(403);
}
params.left = 0;
params.top = 0;
db.getCollection("stickynotes").insert(params);

1;

