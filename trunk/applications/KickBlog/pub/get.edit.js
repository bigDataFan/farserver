var post = db.getCollection("blogs").findOne({'id': params.id});

var config = db.getCollection("config").findOne({'name': 'default'});

var model = new Object();

model.post = post;
model.config = config;

post;

