if (params.skip ==null) {
	params.skip = 0;
}

if (params.limit == null) {
	params.limit = 20;
}

db.getCollection("attachments").find().skip(params.skip).limit(params.limit);
