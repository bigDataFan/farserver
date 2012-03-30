/**
 * 
 */
var dbs = {};

$(document).ready(function(){
	
	var tasksdb = new TAFFY();
	var breaksdb = new TAFFY();
	var plansdb = new TAFFY();
	tasksdb.store("tasks");
	breaksdb.store("breaks");
	plansdb.store("plans");
	
	dbs["todos"] = tasksdb;
	dbs["breaks"] = breaksdb;
	dbs["plans"] = plansdb;
	
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
	if ($('#' + name).filter(":visible").length==1) {
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

var editingId;
function showAdd(name) {
	type = name;

	$('#new-dialog .upper-title').hide();
	$('#' + name + "-title").show();
	 
	$('#new-dialog').animate({
	    top: 90
	  }, 500, function() {
	  });
}

function showEdit(name) {
	
}

function saveOrUpdate() {
	var object = {};
	if (editingId!=null) {
		object = $('#new-dialog').data('info');
		object.updated = new Date().getTime();
	} else {
		object.created = new Date().getTime();
	}
	
	object.title = $('#txtinput').val();

	var type = $('#task-list ul:visible').attr("id");

	if (editingId!=null) { 
		$('#' + editingId).html(object.title);
		dbs[type](editingId).update(object);
	} else {
		dbs[type].insert(object);
		var cloned = $('#todos li.hidden').clone();
		cloned.removeClass("hidden");
		cloned.hide();
		$('#' + type).find('li.intr').hide();
		$('#' + type).append(cloned);
		cloned.slideDown();
		cloned.find('div.left').html(object.title);
		cloned.find('div.left').attr("id", object.___id);
	}
	
	closeEdit();
}

function removeCurrent() {
	if (editingId!=null) {
		var type = $('#task-list ul:visible').attr("id");
		dbs[type](editingId).remove();
	}
}

function closeEdit() {
	$('#new-dialog').animate({
	    top: -140
	  }, 500, function() {
		  $('#txtinput').val('');
		  //$('#task-list').focus();
		  //$('#txtinput').hide();
	    // Animation complete.
	  });
}