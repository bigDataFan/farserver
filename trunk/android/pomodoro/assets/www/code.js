/**
 * 
 */

$(document).ready(function(){
	$('#breaks').slideUp();
	$('#plans').slideUp();
	$('#breaks-add').hide();
	$('#plans-add').hide();
});


function showList(name) {
	var src = $(this);
	$('#task-list div.title div.add').hide();
	$('#task-list ul').slideUp('fast');
	$('#' + name).slideDown('fast',
			function() {
				$("#" + name + "-add").fadeIn();	
			}
	);
}
