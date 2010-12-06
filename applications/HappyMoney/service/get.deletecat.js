
if (params.id!=null) {
	obj = db.getCollection("categories").remove({"id":params.id});
}

response.sendRedirect("categories.gs");