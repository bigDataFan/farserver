
var desc = null;
var multilparts = null;

for each (field in request.getMultipartParams()) {
	if (field.name == "name") {
		desc = field.value;
	}
	if (field.isfile) {
		var content_id = content.put(field);
		db.getCollection("uploads").insert(
				 {
					"content_id":content_id, 
					"name": field.filename,
					"date":new Date(),
					"size": field.size
				 }
		);
	}
}
response.sendRedirect("../config/uploads.gs");
