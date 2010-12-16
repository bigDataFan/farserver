if (!user.equals(owner) && "test"!=user.getName()) {
	response.sendError(403);
}
var today = new Date();

dateStr = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();

db.getCollection("worktimes").upsert({"dateStr":dateStr},
		{"dateStr":dateStr,"data": params.content});

"OK";