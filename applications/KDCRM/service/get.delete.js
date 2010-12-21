var model = new Object();
if (params.collection && params.ids) {
	var idarray = params.ids.split('-');
	for ( var i = 0; i < idarray.length; i++) {
		if (idarray[i]=="") continue;
		model = db.getCollection(params.collection).remove({"id":idarray[i]});
	}
} 

model;



