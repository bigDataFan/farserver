var o = new Object();

o.cat = request.getParameter("cat");
o.pcat = request.getParameter("pcat");

appdb.getRootCollection().upsert(o);

"OK";