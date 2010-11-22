var uuid = request.getParameter("uuid");

var page = request.getParameter("page", "index");

var blogService = extension.getBlogService();

var blog = blogService.getBlog(uuid);

if (blog!=null) {
	blog.remove();
}

response.sendRedirect(page);