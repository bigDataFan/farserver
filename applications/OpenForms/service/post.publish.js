params.ispub = true;
db.getUserCollection("forms").upsert({"id":params.id},{ "$set" : { "ispub" : true } });

"1";