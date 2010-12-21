
if (params.collection!=null) {
	
	if (params.collection=="consumers" && params.name.length>0) {
		params.firstLetter = utils.getFirstLetter(params.name.substring(0,1));
	}
	
	if (params.consumers) {
		params.consumers = params.consumers.split(" ");
	}
	db.getCollection(params.collection).upsert(params);
}

"1";