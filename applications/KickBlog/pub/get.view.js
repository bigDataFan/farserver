var blog = db.getCollection("blogs").findOne({'id':request.getPath()});

if (blog==null) {
	response.sendError(404);
}

var model = new Object();
model.blog = blog;
model.next = db.getCollection("blogs").findOne({"modified":{"$gt":blog.modified}});
model.previous = db.getCollection("blogs").findOne({"modified":{"$lt":blog.modified}});

model.comments = db.getCollection("comments").find({"blogid":blog.id}).limit(20).toArray();


model;