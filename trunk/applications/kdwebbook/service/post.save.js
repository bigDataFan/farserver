
if (params.collection!=null) {

	d = new Date();
	params.modified = {
			"d": d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(),
			"t": d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
			"mill": d.getTime()
	};
	
	db.getCollection(params.collection).upsert(params);
}

"1";