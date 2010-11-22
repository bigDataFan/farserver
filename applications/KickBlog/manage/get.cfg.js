var configObj = db.getCollection("config").findOne();

if (configObj==null) {
	configObj = new Object();
	configObj.blogname = "";
	configObj.desc = "";
	configObj.quickMessage = "";
} 

