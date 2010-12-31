var cursor = db.getCollection("uploads").find({});

if (params.from) {
	cursor.skip(parseInt(params.from));
}

if (params.total) {
	cursor.limit(params.total);
}
cursor.toArray();
