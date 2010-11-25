params.perpage = parseInt(params.perpage);
db.getCollection("config").upsert({},params);

response.sendRedirect("config.html");


