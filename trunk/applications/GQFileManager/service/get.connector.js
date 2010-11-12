var result = new Object();

if (params.cmd=="open") {
		
	var parent = null;
	if (params.init == "true") {
		parent = db.getCollection("files").findOne({"parent":""});
		if (parent==null) {
			parent = {
				"modified" : new Date(),
				"mime": "directory",
				"name": "根文件夹",
				"rel": "/",
				"parent":""
			};
			parent.id = db.getCollection("files").upsert({"parent":""}, parent);
		}
	} else {
		parent = db.getCollection("files").findOne({"parent":params.target});
	}
	
	result.cwd = getCwd(parent);
	result.cdc = getCdc(parent);
	result.disabled = [];

	if (params.tree=="true") {
		result.tree = getTree(parent);
		result.params = getParams();
	}

} else if (params.cmd=="mkdir") {
	var parentFolder = db.getCollection("files").getById(params.current);
	if (parentFolder!=null && parentFolder.mime=="directory") {
		var newFolder = {
				"modified" : new Date(),
				"mime": "directory",
				"name": params.name,
				"rel": "/",
				"parent":params.current
			};
		db.getCollection("files").insert(newFolder);
		
		result.cdc = getCdc(parent);
		result.cwd = getCwd(parent);
		result.select = [];
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
            "mime": o.mimetype,
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
					"dirs": getsub?getDirs(o, false):[]
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


