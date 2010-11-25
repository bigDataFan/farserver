var path = request.getPath();
var pathArray = path.split("/");

var model = new Object();


var config = db.getCollection("config").findOne({});


if (config==null) {
	config = new Object();
	config.blogname = owner.getName() + "的博客";
	config.slogan = "";
	config.quickMessage = "";
	config.perpage = 10;
	db.getCollection("config").insert(config);
}

model.config = config;

var queryObject = {};
model.from = 0;
var max = config.perpage;


switch (pathArray.length) {
	case 2:  //default view  
		model.page = parseInt(pathArray[1])? parseInt(pathArray[1]):0; 
		break;
	case 4:
		if (pathArray[1]=="tag") {  //view by tag
			queryObject.tag = pathArray[2];
		}
		if (pathArray[1]=="date") { //view by date
			queryObject.datetag = pathArray[2];
		}
		model.page = parseInt(pathArray[3])? parseInt(pathArray[3]):0;
	default:
		model.page = 0;
		break;
}

model.from = model.page * config.perpage;

var cur = db.getCollection("blogs").find( queryObject, { "content":0 })
		.sort({"modified":-1})
		.skip(model.from).limit(max);

model.total = cur.count();
model.tags = db.getCollection("blogs").distinct("tags");
model.datetags = db.getCollection("blogs").distinct("datetag");

model.to = model.from + cur.size();


model.blogs = new Array();
while (cur.hasNext()) {
	model.blogs.push(cur.next());
}
model;