var path = request.getPath();
var pathArray = path.split("/");

var model = new Object();


var config = db.getCollection("config").findOne({});
model.config = config;

var queryObject = {};
model.from = 0;
var max = config.perpage;


switch (pathArray.length) {
	case 2:
		var page = parseInt(pathArray[1]); 
		if (page) {
			model.from = config.perpage * page;
		}
		break;
	case 3:
		if (pathArray[1]=="date") {
			queryObject.datetag = pathArray[2];
		}
	case 4:
		if (pathArray[1]=="tag") {
			queryObject.tag = pathArray[2];
			var page = parseInt(pathArray[3]);
			if (page) {
				model.from = config.perpage * page;
			}
		}
	default:
		break;
}

var cur = db.getCollection("blogs").find(
			queryObject,
			{
				"content":0
			}
		).sort({"modified":-1}).skip(model.from).limit(max);




model.total = cur.count();
model.tags = db.getCollection("blogs").distinct("tags");
model.datetags = db.getCollection("blogs").distinct("datetag");
model.to = model.from + cur.size();



model.blogs = new Array();
while (cur.hasNext()) {
	model.blogs.push(cur.next());
}
model;