
if (!user.equals(owner)) {
	response.sendError(403);
}

params.tags = params.tags.split(" "); 

params.modifier = user.getName();
params.modified = new Date();
params.visited = 0;
params.replied = 0;
db.getCollection("blogs").upsert(params);
response.sendRedirect("index.gs");

