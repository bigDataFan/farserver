var uuid = request.getParameter("uuid");

var model = new Object();

model.title = "";
model.content = "";
model.uuid = "";

if (uuid!=null) {
	var blogService = extension.getBlogService();
	var draftNode = blogService.getBlog(uuid);
	
	if (draftNode!=null) {
		model.title = draftNode.getTitle();
		model.content = draftNode.getContent();
		model.uuid = draftNode.getUuid();
	}
}

model;
