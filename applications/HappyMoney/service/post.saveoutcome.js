
var n = new Number(params.mount);
params.mount = isNaN(n)?0:n.valueOf();
params.day = isNaN(Date.parse(params.day))?new Date():new Date(params.day); 

db.getCollection("outcomes").upsert(params);

response.sendRedirect("outgoings.gs");
