$(document).ready(function(){
	if ($.os.ios || $.os.android || $.os.iphone || $.os.ipad) {
		bindEvent('touchend');
	} else {
		bindEvent('click');
	}
});


function getParam(name) {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href); 
	if (!results) { return 0; } return results[1] || 0;
}

function goToMain() {
	location.href = "index.html";
}

function addOutCome() {
	location.href = "outcome-edit.html";
}

function goOutComeList() {
	location.href = "outcome-list.html";
}

function addInCome() {
	location.href = "income-edit.html";
}

function configCategory() {
	location.href = "categories.html";
}

//depend on  jquery or zepto
function fillselect(select, categories) {
	for(var i=0; i<categories.length; i++) {
		select.append('<option>' + categories[i] + "</option>");
	}
}

function loadCategories(db, ary) {
	var categorydb = new TAFFY();
	categorydb.store(db);
	var categories = [];
	
	categorydb().each(
		function(r, i) {
			categories.push(r.category);
		}
	);
	
	for ( var i = 0; i < ary.length; i++) {
		fillselect(ary[i], categories);
	}
}




