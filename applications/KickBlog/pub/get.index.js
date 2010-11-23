
var cur = db.getCollection("blogs").findRecent({'cat': params.cat}).skip(params.from).limit(params.max);
var cats = db.getCollection("cats").find({}).toArray();
var config = db.getCollection("config").findOne({});

var model = new Object();

model.blogs = new Array();
model.cats = cats;
model.total = cur.count();
model.config = config;

while (cur.hasNext()) {
	model.blogs.push(cur.next());
}
model;