if (params.collection!=null) {
	db.getCollection(params.collection).upsert(params);
}

"1";