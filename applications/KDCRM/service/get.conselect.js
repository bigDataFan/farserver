var cursor = db.getCollection("consumers").find(
			{},
			{"name":1, "alias":1, "firstLetter":1}
		).sort({"firstLetter":1});

var result = new Array();
while (cursor.hasNext()) {
	result.push(cursor.next());
}

var s="";
s.
result;