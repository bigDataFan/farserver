var model = new Object();

if (user.equals(owner)) {
	model.owner = true;
} else {
	model.owner = false;
}
var subordinates = db.getCollection("users").find({"reportingto": user}).toArray();

model.subordinates = subordinates;


model;