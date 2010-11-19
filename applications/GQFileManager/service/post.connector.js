
var current = null;

var result = new Object();

var multilparts = new Array();

for each (field in request.getMultipartParams()) {
	if (field.name == "current") {
		current = field.value;
	}
	
	if (field.name == "upload[]") {
		multilparts.push(field);
	}
}

if (current!=null) {
	var cwdNode = db.getCollection("files").getById(current);
	if (cwdNode!=null && cwdNode.mime == "directory") {
		for ( var i = 0; i < multilparts.length; i++) {
			var content_id = content.put(multilparts[i]);
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
		result.cwd = getCwd(cwdNode);
		result.cdc = getCdc(cwdNode);
		result.tmb = true;
	}
}

result;


function getCdc(folder) {
	var cdc = new Array();
	
	var childcur = db.getCollection("files").find({"parent":folder.id});
	
	while(childcur.hasNext()) {
		var o = childcur.next();
		cdc.push(
		 {
            "name": o.name,
            "hash": o.id,
            "mime": o.mime,
            "date": o.modified,
            "size": o.size,
            "read": true,
            "write": true,
            "rm": true
        }
		);
	}
	return cdc;
}

function getCwd(folder) {
	var cwd = new Object();
	cwd.date = folder.modified;
	cwd.hash = folder.id;
	cwd.mime = "directory";
	cwd.name = folder.name;
	cwd.rel = "/";
	cwd.read = true;
	cwd.write = true;
	cwd.rm = true;
	return cwd;
}



function getTree(folder) {
	var tree = new Object();
	tree.hash = folder.id;
	tree.name = folder.name;
	tree.read = true;
	tree.write = true;
	tree.dirs = getDirs(folder, true);
	return tree;
}



function getDirs(folder, getsub) {
	var dirs = new Array();
	var childfdcur = db.getCollection("files").find({"parent":folder.id,"mime":"directory"});
	
	while (childfdcur.hasNext()) {
		var o = childfdcur.next();
		dirs.push(
				{
					"hash": o.id,
					"name": o.name,
					"read": true,
					"write": true,
					"dirs": getDirs(o, true)
				}
		);
	}
	return dirs;
}


function getParams() {
	var z = new Object();
	z.uplMaxSize = "10M";
	z.archives = [
	                          "application/x-tar",
	                          "application/x-gzip",
	                          "application/x-bzip2",
	                          "application/x-7z-compressed",
	                          "application/zip"
	                      ];
	z.extract = z.archives;
	z.url = "/service/upload";
	
	return z;	
}
