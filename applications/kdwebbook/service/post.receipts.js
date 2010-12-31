var result = new Object();
db.getCollection("receipts").find({"active": true}).toArray();

