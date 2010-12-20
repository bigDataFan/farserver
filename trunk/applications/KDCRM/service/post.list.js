var result = new Object();

if (params.collection) {
	var cursor = db.getCollection(params.collection).find({});
	result.total = cursor.count();
	result.rows = cursor.limit(10).toArray();
}

result;
