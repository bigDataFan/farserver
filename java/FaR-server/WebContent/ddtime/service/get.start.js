//stop all runnings;
var runnings = db.getCollection("activities").find({"running" : true});

while(runnings.hasNext()) {
	var item = runnings.next();
	item.running = false;
	item.dura += new Date().getTime() - item.begins;
	db.getCollection("activities").upsert(item);
}

var itemToStart = db.getCollection("activities").findOne({"start":parseInt(params.id)});

if (itemToStart) {
	itemToStart.running = true;
	itemToStart.begins = new Date().getTime();
	db.getCollection("activities").upsert(itemToStart);
}

response.sendRedirect("../index.gs");

