
if (!user.equals(owner)) {
	response.sendError(403);
}




var d = new Date();

var monthd = new Date();
monthd.setDate(1);

var cats = db.getCollection("categories").find({}).toArray();

var model = new Object();
model.result = new Array();
model.total = 0;
model.predict = 0;

for ( var i = 0; i < cats.length; i++) {
	var c = new Object();
	c.name = cats[i].name;
	c.predict = cats[i].predict;
	model.predict += parseInt(c.predict);
	var cur = db.getCollection("outcomes").find({"day":{"$gte":monthd},"category":c.name});
	c.sum =cur.sumValue("mount");
	model.total += parseInt(c.sum);
	model.result.push(c);
}


model;