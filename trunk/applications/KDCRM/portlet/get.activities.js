db.getCollection("activities").find({}).sort({"$natural":-1}).limit(8).toArray();

