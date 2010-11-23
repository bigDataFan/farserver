if (!user.equals(owner)) {
	response.sendError(403);
}


var post = db.getCollection("blogs").findOne({'id': params.id});

var config = db.getCollection("config").findOne({});

var categories = db.getCollection("categories").find({}).toArray();

var model = new Object();

if (post!=null) {
	model.post = post;
}
model.config = config;
model.categories = categories;
model;

