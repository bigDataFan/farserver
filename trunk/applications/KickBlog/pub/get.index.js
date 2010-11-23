
var cur = db.getCollection("blogs").find(
			{'tags': params.tag},
			{
				"content":0
			}
		).sort({"modified":-1})skip(params.from).limit(params.max);


var config = db.getCollection("config").findOne({});

var model = new Object();

model.total = cur.count();
model.config = config;

model.blogs = new Array();
while (cur.hasNext()) {
	model.blogs.push(cur.next());
}
model;