var uuid = request.getParameter("uuid");

var blogService = extension.getBlogService();

blogService.getBlog(uuid);
