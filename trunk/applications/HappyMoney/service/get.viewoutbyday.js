var df = new Date(params.from);
var dt = new Date(params.to);

var cur = db.getCollection("outcomes").find({"day":{"$gte":df,"$lte":dt}}).sort({"day":true});

var total = 0;
var list = new Array();

var lastDay  = null;
var lastTotal = 0;
var dayArray = new Array();

while (cur.hasNext()) {
	var o =  cur.next();
	var nd  = new Date(o.day.getTime());
	var datStr = nd.getFullYear() + "/" + nd.getMonth() + "/" + nd.getDate();
	if (datStr!=lastDay) {
		addDayList(); 
		lastDay = datStr;
		dayArray = new Array();
		dayArray.push(o);
		lastTotal = o.mount;
	} else {
		dayArray.push(o);
		lastTotal += o.mount;
	}
}

addDayList();

var model = new Object();
model.total = total;
model.list = list;
model;


function addDayList() {
	if (lastDay!=null) {
		var sum = new Object();
		sum.day = lastDay;
		sum.total = lastTotal;
		sum.list = dayArray;
		list.push(sum);
		total += lastTotal;
	}

}
