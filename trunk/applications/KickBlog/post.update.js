
if (!user.equals(owner)) {
	response.sendError(403);
}

var now = new Date();
params.tags = params.tags.split(" "); 

if (params.tags.length==1 && params.tags[0]=="") {
	params.tags = [];
}


params.datetag = now.getFullYear() + "-" + (now.getMonth()+1);
params.modifier = user.getName();
params.modified = now;
params.visited = 0;
params.replied = 0;
db.getCollection("blogs").upsert(params);
response.sendRedirect("index.gs");

