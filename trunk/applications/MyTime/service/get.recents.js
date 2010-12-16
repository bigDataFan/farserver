if (!user.equals(owner) && "test"!=user.getName()) {
	response.sendError(403);
}

var cursor = db.getCollection("worktimes").find({}).sort({"dateStr":-1}).limit(10);

var result = new Array();

logger.info("hi there");

while (cursor.hasNext()) {
	var o = cursor.next();
	result.push(o.dateStr);
}

result;