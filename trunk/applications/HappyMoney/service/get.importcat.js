if (!user.isOwner()) {
	response.sendError(403);
}


var pcat = request.getParameter("parentcat");
var cat =  request.getParameter("cat");

db.getCollection("cats").upsert({'pcat': pcat, 'cat', cat});

"OK";