var obj; 

if (params.id!=null) {
	obj = db.getCollection("categories").getById(params.id);
}
if (obj==null) {
	obj = new Object();
	obj.name = "";
	obj.predict = 0.0;
}

obj;