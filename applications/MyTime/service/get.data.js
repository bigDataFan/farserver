var path = request.getPath();
var pathArray = path.split("/");

var today = new Date();

dateStr = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();


if (pathArray.length==2 && pathArray[1]!="") {
	dateStr = pathArray[1];
}


var doc = db.getCollection("worktimes").findOne({"dateStr": dateStr});

if (doc==null) {
	doc = new Object();
	doc.data = "[]";
	doc.dateStr = dateStr;
	db.getCollection("worktimes").insert(doc);
}


doc.data;