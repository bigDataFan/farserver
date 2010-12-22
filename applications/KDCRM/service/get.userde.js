var obj = new Object();
obj.rows = db.getCollection(params.collection).find(
		{
			'consumer' : params.user
		}
		).toArray();


obj.total = obj.rows.length;

obj;