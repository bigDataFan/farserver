/**
 * 
 */
var tasksdb;
var breaksdb;
var plansdb;


$(document).ready(function(){
	
	tasksdb = new TAFFY();
	breaksdb = new TAFFY();
	plansdb = new TAFFY();
	
	
	$('#breaks').slideUp();
	$('#plans').slideUp();
	$('#breaks-add').hide();
	$('#plans-add').hide();
	$('#timer').animate({
	    top: 90
	  }, 500, function() {
	    // Animation complete.
	  });
});


function showList(name) {
	if(addClicked) {
		addClicked = false;
		return;
	} 
	
	var src = $(this);
	$('#task-list div.title div.add').hide();
	$('#task-list ul').slideUp('fast');
	$('#' + name).slideDown('fast',
			function() {
				$("#" + name + "-add").fadeIn();	
			}
	);
}

var addClicked = false;
var type;
var editingId;
function showAdd(name) {
	addClicked = true;
	type = name;
	
	$('#txtinput').focus()
	$('#new-dialog').animate({
	    top: 90
	  }, 500, function() {
	    // Animation complete.
	  });
	
	if (name=="todos") {
		$('#new-dialog .upper-title h3').html('增加本日的计划');
	}
}

function showEdit(name) {
	
}

function saveOrUpdate() {
	var object = {};
	if (editingId!=null) {
		object = $('#new-dialog').data('info');
	}
	
	
	if (type=="todos") {
		object.title = $('#txtinput').val();
		object.created = new Date().getTime();
	} else if (type=="")
	
	
	
}

function removeCurrent() {
	
}

function closeEdit() {
	$('#new-dialog').animate({
	    top: -140
	  }, 500, function() {
	    // Animation complete.
	  });
}