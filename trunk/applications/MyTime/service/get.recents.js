var cursor = db.getCollection("worktimes").find({}).limit(10);

var result = new Array();
while (cursor.hasNext()) {
	var o = cursor.next();
	result.push(o.dateStr);
}

result;