var obj = new Object();
db.getCollection(params.collection).ensureIndex("consumer");
obj.rows = db.getCollection(params.collection).find(
		{
			'consumer' : params.user
		}
		).toArray();


obj.total = obj.rows.length;

obj;