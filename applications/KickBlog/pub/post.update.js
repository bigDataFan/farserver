var title = request.getParameter("title");
var content = request.getParameter("content");
var newcat = request.getParameter("newcat");
var categories = request.getParameter("category").split(",");
var allowcomment = request.getParameter("allowcomment")=="true"?true:false;
var uuid = request.getParameter("uuid");

if (uuid==null) {
	response.sendError(400);
}

categories = (newcat==null||newcat=="")?categories:[newcat];

var blogService = extension.getBlogService();

var blog = blogService.getBlog(uuid);
blog.setTitle(title);
blog.setContent(content);
blog.setCategories(categories);

blog.save();

response.sendRedirect("index");

