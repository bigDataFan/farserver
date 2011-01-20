var result = new Object();

if (params.collection) {
	var cursor = db.getCollection(params.collection).find({});
	result.total = cursor.count();
	var skip = (parseInt(params.page)-1) * parseInt(params.rows);
	result.rows = cursor.skip(skip).limit(params.rows).toArray();
}

result;
