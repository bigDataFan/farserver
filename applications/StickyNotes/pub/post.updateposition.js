if (!user.equals(owner)) {
	response.sendError(403);
}
if (params.id) {
	var note = db.getCollection("stickynotes").getById(params.id);
	
	if (note!=null) {
		note.left = params.left;
		note.top = params.top;
		db.getCollection("stickynotes").upsert(note);
	}
	note.id;
} else {
	"";
}

