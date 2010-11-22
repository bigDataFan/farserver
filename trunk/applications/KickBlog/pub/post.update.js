
if (!user.equals(owner)) {
	response.sendError(403);
}


db.getCollection("blogs").upsert(params);
response.sendRedirect("index.gs");

