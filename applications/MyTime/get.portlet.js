var today = new Date();

var dateStr = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
var isToday = true;
var doc = db.getCollection("worktimes").findOne({"dateStr": dateStr});

if (doc==null) {
	doc = new Object();
	doc.data = "[]";
	doc.dateStr = dateStr;
	db.getCollection("worktimes").insert(doc);
}

var result = new Object();

var entries = utils.evalJsonArray(doc.data);
	
for(var i=0; i<entries.length; i++) {
	if (entries[i].running) {
		entries[i].dura += new  Date().getTime() - entries[i].begins;  
	}
	entries[i].dura = formatDate(entries[i].dura);
}

result.entries = entries;
result;

function formatDate(mill) {
	var d3 = new Date(parseInt(mill));
	return ((d3.getDate()-1)*24 + (d3.getHours()-8)) + ":" 
	+ ((d3.getMinutes()<10)?("0"+d3.getMinutes()):d3.getMinutes()); 
}