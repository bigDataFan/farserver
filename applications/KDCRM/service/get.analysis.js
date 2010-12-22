var result = {};

if (params.collection!=null) {
	result = db.getCollection(params.collection).group(
			{"modified.d": true},
			//{"modified.mill": {$gte: parseInt(params.since)}},
			{},
			{total:0},
			'function(doc, out) {if (out[doc.modified.d]==null) {out[doc.modified.d] = 1;} else {out[doc.modified.d]++;}out.total ++;}'
	);
	
}
result;