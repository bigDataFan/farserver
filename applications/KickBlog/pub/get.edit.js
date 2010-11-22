var post = db.getCollection("blogs").findOne({'id': params.id});

var config = db.getCollection("config").findOne({});

var model = new Object();

if (post!=null) {
	model.post = post;
}
model.config = config;

model;

