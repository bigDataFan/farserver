params.submituser = user.getName();
params.remoteip = request.getRemoteAddr();
params.submitdate = new Date();

db.getUserCollection("results").save(params);

"1";