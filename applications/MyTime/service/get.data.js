var path = request.getPath();
var pathArray = path.split("/");

var today = new Date();

dateStr = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();

var isToday = true;
if (pathArray.length==2 && pathArray[1]!="") {
	if (dateStr==pathArray[1]) {
		//ok is today
	} else {
		dateStr = pathArray[1];
		isToday = false;
	}
}


var doc = db.getCollection("worktimes").findOne({"dateStr": dateStr});

if (doc==null) {
	doc = new Object();
	doc.data = "[]";
	doc.dateStr = dateStr;
	db.getCollection("worktimes").insert(doc);
}

var result = new Object();

result.data = doc.data;
result.isToday = isToday;

result;