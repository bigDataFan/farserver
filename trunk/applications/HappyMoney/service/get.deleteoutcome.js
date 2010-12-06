
if (params.id!=null) {
	obj = db.getCollection("outcomes").remove({"id":params.id});
}

response.sendRedirect("outgoings.gs");