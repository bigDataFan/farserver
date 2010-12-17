

var types = {
		"consumer":consumer
}
var model;
if (params.id!=null) {
	model = db.getCollection(params.type).getById(params.id);
} else {
	model = types[params.type];
}


model;



