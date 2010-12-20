var model = new Object();
if (params.id!=null) {
	model = db.getCollection(params.collection).getById(params.id);
} 

model;



