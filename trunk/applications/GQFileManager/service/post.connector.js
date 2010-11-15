
var current = null;


var multilparts = new Array();

for each (field in request.getMultipartParams()) {
	if (field.name == "current") {
		current = field.value;
	}
	
	if (field.isfile) {
		multilparts.push(field);
	}
}


if (current!=null) {
	var cwdNode = db.getCollection("files").getById(current);
	if (cwdNode!=null && cwdNode.mime == "directory") {
		for ( var i = 0; i < multilparts.length; i++) {
			var content_id = content.put(multilparts[i].inputstream, multilparts[i].filename, multilparts[i].mimetype);
			var newFile = {
					"modified" : new Date(),
					"mime": multilparts[i].mimetype,
					"name": multilparts[i].filename,
					"rel": "/",
					"parent":current,
					"size": multilparts[i].size,
					"content": content_id 
			};
			db.getCollection("files").upsert({"parent":current, "name":multilparts[i].filename},newFile);		
		}
	}
}

