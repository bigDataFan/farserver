db.getCollection("config").upsert(params);

response.sendRedirect("config.html");


