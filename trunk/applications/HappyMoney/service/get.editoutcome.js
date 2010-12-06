var obj; 

if (params.id!=null) {
	obj = db.getCollection("outcomes").getById(params.id);
}
if (obj==null) {
	obj = new Object();
	obj.name = "";
	obj.mount = 0.0;
	obj.day = new Date();
	obj.comment = "";
}

obj.cats = db.getCollection("categories").find({}).toArray();
obj;