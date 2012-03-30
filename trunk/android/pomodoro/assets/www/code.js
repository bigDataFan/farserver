/**
 * 
 */

$(document).ready(function(){
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
var adding;
function showAdd(name) {
	addClicked = true;
	adding = name;
	//$('#new-dialog').slideDown();
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

function saveOrUpdate() {
	
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