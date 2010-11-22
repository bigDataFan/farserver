var title = request.getParameter("title");
var content = request.getParameter("content");

var blogService = extension.getBlogService();
var draft = blogService.createDraft();

draft.setTitle(title);
draft.setContent(content);

draft.save();

draft.getUuid();