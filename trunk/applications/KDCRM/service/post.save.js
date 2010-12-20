
if (params.collection!=null) {
	
	if (params.collection=="consumers") {
		params.firstLetter = utils.getFirstLetter(params.name);
	}
	
	db.getCollection(params.collection).upsert(params);
}

"1";