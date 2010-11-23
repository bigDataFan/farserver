
if (!user.equals(owner)) {
	response.sendError(403);
}

params.categories = params.categories.split(" "); 

params.creator = user.getName();
params.modified = new Date();

db.getCollection("blogs").upsert(params);
response.sendRedirect("index.gs");

