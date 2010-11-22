
if (!user.equals(owner)) {
	response.sendError(403);
}

params.categories = params.categories.split(" "); 

db.getCollection("blogs").upsert(params);
response.sendRedirect("index.gs");

