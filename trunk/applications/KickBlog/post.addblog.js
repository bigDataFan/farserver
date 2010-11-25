var title = request.getParameter("title");
var content = request.getParameter("content");

var category = request.getParameter("category", "默认分类");
var newcat = request.getParameter("newcat");
if (newcat!=null) category = newcat;

categories = category.split(",");
var allowcomment = request.getParameter("allowcomment")=="true"?true:false;

var blogService = extension.getBlogService();

blogService.addBlog(title,content, categories, null, allowcomment);

response.sendRedirect("index");