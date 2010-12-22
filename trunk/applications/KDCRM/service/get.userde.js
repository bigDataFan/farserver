var obj = new Object();
obj.rows = db.getCollection("activities").find(
		{
			'consumers' : params.user
		}
		).toArray();


obj.total = obj.rows.length;

obj;