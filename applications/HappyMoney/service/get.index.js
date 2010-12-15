if (!user.equals(owner)) {
	response.sendError(403);
}


var d = new Date();

var monthd = new Date();
monthd.setDate(1);
var cur = db.getCollection("outcomes").find({"day":{"$gte":monthd}});

var tdaybefore = new Date(d.getTime() - 4 * 24 * 60 * 60 * 1000);
var cur3 = db.getCollection("outcomes").find({"day":{"$gte":tdaybefore}});


var model = new Object();

model.month = cur.sumValue("mount");
model.threeday = cur3.sumValue("mount");
model;