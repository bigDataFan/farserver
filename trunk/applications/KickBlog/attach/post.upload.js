
var multiparts = new Array();

for each (field in request.getMultipartParams()) {
	if (field.name == "attach") {
		multiparts.push(field);
	}
}
for ( var i = 0; i < multiparts.length; i++) {
	var content_id = content.put(multiparts[i]);
	db.getCollection("attachments").insert({"contentid": content_id,"filename":multiparts[i].filename});
}

response.sendRedirect("list.gs");
