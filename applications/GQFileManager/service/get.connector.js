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
			var upsertedId = db.getCollection("files").upsert({"parent":""}, cwdNode);
			cwdNode.id = upsertedId;
		}
		
		result.cwd = getCwd(cwdNode);
		result.cdc = getCdc(cwdNode);
		result.disabled = [];
		if (params.tree=="true") {
			result.tree = getTree(cwdNode);
			result.params = getParams();
		}
		
	} else {
		var cwdNode = db.getCollection("files").getById(params.target);
		if (cwdNode!=null && cwdNode.mime == "directory") {
			result.cwd = getCwd(cwdNode);
			result.cdc = getCdc(cwdNode);
			if (params.tree=="true") {
				result.tree = getTree(db.getCollection("files").findOne({"parent":""}));
				result.params = getParams();
			}
		} else {
			/**a content down load*/
			result = content.get(cwdNode.content);
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
		result.tree = getTree(db.getCollection("files").findOne({"parent":""}));
		result.params = getParams();
		result.select = [];
	}
} else if (params.cmd == "rm") {
	var targets = request.getParameters("targets[]");
	for(var i=0; i<targets.length; i++) {
		var targetNode = db.getCollection("files").findOne({"id": targets[i]});
		if (targetNode.content) {
			content.remove(targetNode.content);
		}
		db.getCollection("files").remove({"id": targets[i]});	
	}
	var parentFolder = db.getCollection("files").getById(params.current);
	
	if (parentFolder!=null) {
		result.cdc = getCdc(parentFolder);
		result.cwd = getCwd(parentFolder);
		result.tree = getTree(db.getCollection("files").findOne({"parent":""}));
		result.params = getParams();
	}
} else if (params.cmd == "rename") {
	var targetNode = db.getCollection("files").getById(params.target);
	if (targetNode!=null) {
		targetNode.name = params.name;
		db.getCollection("files").save(targetNode);
	}
	
	var currentNode = db.getCollection("files").getById(params.current);
	
	if (currentNode!=null) {
		result.cdc = getCdc(currentNode);
		result.cwd = getCwd(currentNode);
	}
} else if (params.cmd=="duplicate") {
	var targetNode = db.getCollection("files").getById(params.target);
	
	var currentNode = db.getCollection("files").getById(params.current);
	
	if (targetNode!=null && currentNode!=null) {
		var newName = genDuplicatName(targetNode);
		copyTo(targetNode, currentNode, newName);
	}
	
	if (currentNode!=null) {
		result.cdc = getCdc(currentNode);
		result.cwd = getCwd(currentNode);
	}
} else if (params.cmd == "paste") {
	
	var currentNode = db.getCollection("files").getById(params.current);
	
	if (currentNode!=null) {
		var targetList = request.getParameters("targets[]");
		for(var i=0; i<targetList.length; i++) {
			var nodeToCopy =  db.getCollection("files").getById(targetList[i]);
			if (db.getCollection("files").findOne({"parent": params.current, "name":name})==null) {
				copyTo(nodeToCopy, currentNode, nodeToCopy.name);	
			}
		}
		result.cdc = getCdc(currentNode);
		result.cwd = getCwd(currentNode);	
	}
}

result;

function copyTo(srcNode, targetParent, name) {
	if (srcNode.mime=="directory") {
		var newNode = {
				"modified" : new Date(),
				"mime": "directory",
				"name": name,
				"rel": "/",
				"parent":targetParent.id
		};
		newNode.id = db.getCollection("files").upsert({"parent":targetParent.id, "name": name}, newNode);
		
		var childfdcur = db.getCollection("files").find({"parent": srcNode.id});
	
		while (childfdcur.hasNext()) {
			var o = childfdcur.next();
			copyTo(o, newNode, o.name);
		}
	} else {
		var copied_content_id = content.put(content.get(srcNode.content));
		var newFile = {
					"modified" : new Date(),
					"mime": srcNode.mime,
					"name": name,
					"rel": "/",
					"parent":targetParent.id,
					"size": srcNode.size,
					"content": copied_content_id 
		};
		
		db.getCollection("files").upsert({"parent":targetParent.id, "name": name},newFile);
	}
}


function genDuplicatName(targetNode) {
	
	var p = targetNode.name.lastIndexOf(".");
	var fname = targetNode.name;
	var endfix = "";
	if (p>-1) {
		fname = targetNode.name.substring(0, p);
		endfix = targetNode.name.substring(p+1);
	}
	var newName = fname + " 副本" + ((endfix=="")?"":("."+endfix));
	
	var i = 1;
	while(true) {
		var one = db.getCollection("files").findOne({"parent": targetNode.parent, "name" : newName});
		if (!one) {
			break;
		}
		i ++;
		newName = fname + " 副本 (" + i + ")" + ((endfix=="")?"":("."+endfix));
	}
	
	return newName;
}


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


