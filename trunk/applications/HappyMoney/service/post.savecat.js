
var n = new Number(params.predict);
params.predict = isNaN(n)?0:n.valueOf();

db.getCollection("categories").upsert(params);

response.sendRedirect("categories.gs");
