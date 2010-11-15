var result = new Object();

if (params.cmd=="open") {
	if (params.init == "true") {
		var cwdNode = db.getCollection("files").findOne({"parent":""});
		if (cwdNode == null) {
			cwdNode = {
				"modified" : new Date(),
				"mime": "directory",
				"name": "根文件夹",
				"rel": "/",
				"parent":""
			};
			db.getCollection("files").upsert({"parent":""}, cwdNode);
			
			response.sendRedirect("index.html");
		} else {
			result.cwd = getCwd(cwdNode);
			result.cdc = getCdc(cwdNode);
			result.disabled = [];
		}
		
		if (params.tree=="true") {
			result.tree = getTree(cwdNode);
			result.params = getParams();
		}
		
	} else {
		var cwdNode = db.getCollection("files").getById(params.target);
		if (cwdNode!=null) {
			result.cwd = getCwd(cwdNode);
			result.cdc = getCdc(cwdNode);
		}
		if (params.tree=="true") {
			result.tree = getTree(db.getCollection("files").findOne({"parent":""}));
			result.params = getParams();
		}
	}
} else if (params.cmd=="mkdir") {
	var parentFolder = db.getCollection("files").getById(params.current);
	if (parentFolder!=null && parentFolder.mime=="directory") {
		var newFolder = {
				"modified" : new Date(),
				"mime": "directory",
				"name": request.getParameter("name"),
				"rel": "/",
				"parent":params.current
			};
		db.getCollection("files").upsert({"parent":params.current, "name":params.name},newFolder);
		result.cdc = getCdc(parentFolder);
		result.cwd = getCwd(parentFolder);
		result.select = [];
	}
} else if (params.cmd == "rm") {
	var targets = request.getParameters("targets[]");
	for(var i=0; i<targets.length; i++) {
		db.getCollection("files").remove({"id": targets[i]});	
	}
	var parentFolder = db.getCollection("files").getById(params.current);
	
	if (parentFolder!=null) {
		result.cdc = getCdc(parentFolder);
		result.cwd = getCwd(parentFolder);
		result.tree = getTree(db.getCollection("files").findOne({"parent":""}));
		result.params = getParams();
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


