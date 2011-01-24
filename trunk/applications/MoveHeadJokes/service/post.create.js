if (application.admin!=user.getName()) {
	response.sendError(403);
}

db.getGlobalCollection("jokes").insert({"content":params.content,
	"time": new Date()});

"1";