var uuid = request.getParameter("uuid");


var blogService = extension.getBlogService();

var blogDoc = blogService.getBlog(uuid);

if (blogDoc==null) {
	response.sendError(400);
}

blogDoc.addComment(request.getParameter("title"), request.getParameter("description"));

response.sendRedirect("view?uuid=" + uuid);