if (user.isGuest()) {
	response.sendError(401);
}

if (!user.equals(owner)) {
	response.sendError(403);
}
params.start = new Date().getTime();
db.getUserCollection("activities").insert(params);

params;

