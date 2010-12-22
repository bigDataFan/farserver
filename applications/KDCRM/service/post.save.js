
if (params.collection!=null) {
	
	if (params.collection=="consumers" && params.name.length>0) {
		params.firstLetter = utils.getFirstLetter(params.name.substring(0,1));
	}
	
	if (params.consumers) {
		params.consumers = utils.trimWhitespace(params.consumers).split(" ");
	}
	d = new Date();
	params.modified = {
			"d": d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(),
			"t": d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds(),
			"mill": d.getMilliseconds()
	};
	
	db.getCollection(params.collection).upsert(params);
}

"1";