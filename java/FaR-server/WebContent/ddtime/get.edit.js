var model = new Object();

if (params.start) {
	var itemToEdit = db.getCollection("activities").findOne({"start":parseInt(params.start)});
	
	if(itemToEdit!=null) {
		model.item = itemToEdit;
	}
}

model;
