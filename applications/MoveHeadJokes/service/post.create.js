if (application.admin!=user.getName()) {
	response.code(403);
}

db.getGlobalCollection("jokes").insert({"content":params.content,
	"time": new Date()});

"1";