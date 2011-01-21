
var o = new Object();
o.total = db.getGlobalCollection("jokes").count();

var seq = 0;
if (params.c) {
	seq = parseInt(params.c);
}

var cursor = db.getGlobalCollection("jokes").find({}).sort({"$natural":-1}).skip(params.c).limit(1);

if (cursor.hasNext()) {
	o.content = cursor.next().content;
}

o;