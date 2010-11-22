if (!user.equals(owner)) {
	response.sendError(403);
}


var configObj = db.getCollection("config").findOne({});

if (configObj==null) {
	configObj = new Object();
	configObj.blogname = "";
	configObj.desc = "";
	configObj.quickMessage = "";
} 

