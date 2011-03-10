var b = new Date();
b.setHours(0, 0, 0, 0);

var model = new Object();
model.list = db.getCollection("activities").find({
				"start":{
					"$gte": b.getTime(),
					"$lte": b.getTime()+24*60*60*1000
				}
			}).toArray();


var total = 0;
for ( var i = 0; i < model.list.length; i++) {
	var item = model.list[i];
	var dura = item.dura;
	if (item.running) {
		dura = item.dura + (new Date().getTime() - item.begins);
		model.list[i].css = "running";
	} else {
		model.list[i].css = "normal";
	}
	total += dura;
	model.list[i].dura = formatDate(dura);
}

model.total = formatDate(total);

model;


function formatDate(mill) {
	var d3 = new Date(parseInt(mill));
	return ((d3.getDate()-1)*24 + (d3.getHours()-8)) + ":" 
	+ ((d3.getMinutes()<10)?("0"+d3.getMinutes()):d3.getMinutes()); 
}

