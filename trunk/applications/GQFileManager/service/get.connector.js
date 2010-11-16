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
		generateResult(cwdNode);
	} else {
		var cwdNode = db.getCollection("files").getById(params.target);
		if (cwdNode!=null && cwdNode.mime == "directory") {
			generateResult(cwdNode);
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
		generateResult(parentFolder);
	}
} else if (params.cmd == "rm") {
	var targets = request.getParameters("targets[]");
	for(var i=0; i<targets.length; i++) {
		removeNode(db.getCollection("files").getById(targets[i]));
	}
	var parentFolder = db.getCollection("files").getById(params.current);
	generateResult(parentFolder);
	result.tree = getTree();
} else if (params.cmd == "rename") {
	var targetNode = db.getCollection("files").getById(params.target);
	if (targetNode!=null) {
		targetNode.name = params.name;
		db.getCollection("files").upsert(targetNode);
	}
	var currentNode = db.getCollection("files").getById(params.current);
	generateResult(currentNode);
	result.tree= getTree();
} else if (params.cmd=="duplicate") {
	var targetNode = db.getCollection("files").getById(params.target);
	
	var currentNode = db.getCollection("files").getById(params.current);
	if (targetNode!=null && currentNode!=null) {
		var newName = genDuplicatName(targetNode);
		copyTo(targetNode, currentNode, newName);
		generateResult(currentNode);
	}
} else if (params.cmd == "paste") {
	
	
	if (params.cut=="0") {
		var targetParent = db.getCollection("files").getById(params.current);
	
		if (targetParent!=null) {
			var copyList = request.getParameters("targets[]");
			for(var i=0; i<copyList.length; i++) {
				var nodeToCopy =  db.getCollection("files").getById(copyList[i]);
				if (db.getCollection("files").findOne({"parent": params.current, "name":nodeToCopy.name})==null) {
					copyTo(nodeToCopy, targetParent, nodeToCopy.name);
				}
			}
		}
		generateResult(targetParent);
	} else if (params.cut=="1") {
		var targetParent = db.getCollection("files").getById(params.dist);
		if (targetParent!=null) {
			var moveList = request.getParameters("targets[]");
			for(var i=0; i<moveList.length; i++) {
				var nodeToMove =  db.getCollection("files").getById(moveList[i]);
				if (db.getCollection("files").findOne({"parent":params.dist,"name":nodeToMove.name})==null) {
					moveTo(nodeToMove, targetParent);
				}
				
			}
		}
	}
	
} else if (params.cmd=="") {
	
}




result;

function generateResult(currentNode) {
	result.cwd = getCwd(currentNode);
	result.cdc = getCdc(currentNode);
	result.disabled = [];
	if (params.tree=="true") {
		result.tree = getTree();
		result.params = getParams();
	}
}


function isChildOrEqual(srcNode, targetNode) {
	if (srcNode.id == targetNode.id) return true;

	if (srcNode.parent!="") {
		var srcNode = db.getCollection("files").getById(srcNode.parent);
		return isChildOrEqual(srcNode, targetNode);
	} else {
		return false;
	}
}


function removeNode(node) {
	if (!node) return; 
	if (node.mime == "directory") {
		var childfdcur = db.getCollection("files").find({"parent": node.id});
		while (childfdcur.hasNext()) {
			var o = childfdcur.next();
			removeNode(o);
		}
	} else if (node.content) {
		content.remove(node.content);
	}
	db.getCollection("files").remove({"id": node.id});
}

function moveTo(srcNode, targetParent) {
	if (isChildOrEqual(targetParent, srcNode)) return;

	srcNode.parent = targetParent.id;
	
	db.getCollection("files").upsert(srcNode);
}

function copyTo(srcNode, targetParent, name) {
	
	if (isChildOrEqual(targetParent, srcNode)) return;
	
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



function getTree() {
	var folder = db.getCollection("files").findOne({"parent":""});
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


