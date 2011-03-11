var b = new Date();
b.setHours(0, 0, 0, 0);

db.getCollection("activities").find({
				"start":{
					"$gte": b.getTime(),
					"$lte": b.getTime()+24*60*60*1000
				}
			}).toArray();