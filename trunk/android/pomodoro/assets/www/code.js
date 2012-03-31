/**
 * 
 */
var db;
var keys = ['todos', 'breaks', 'plans'];

$(document).ready(function(){
	
	db = new TAFFY();
	db.store("ever365.pomodoro");
	initWelcome();
	
	$('#breaks').slideUp();
	$('#plans').slideUp();
	$('#breaks-add').hide();
	$('#plans-add').hide();
	$('#timer').animate({
	    top: 90
	  }, 500, function() {
	    // Animation complete.
	  });
	displayAll();
});

function initWelcome() {
	$('#timer div.upper-title').html('欢迎使用番茄工作法');
	$('#time-remains').html('25+5 <small>分钟</small>');
	$('#timer div.operations a').hide();
	$('#btn-knowabout').show();
}

function displayAll() {
	db({type:"todos",finished:{"!is":true}}).each(
			function (record,recordnumber) {
				drawTodos(record);
			}
	);
	
	var d = new Date();
	
	db({type:"breaks"},date:d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()}).each(
			function (record,recordnumber) {
				drawBreaks(record);
			}	
	);
	checkAndFill();
}

function checkAndFill() {
	
	for ( var i in keys) {
		var name = keys[i];
		var l = $('#' + name + ' li.info').length;
		$('#' + name + ' li.empty').remove();
		
		if (l<3) {
			for ( var i = 0; i < 3-l; i++) {
				$('#' + name).append('<li class="task empty">');
			}
		}
	}
	
}


/**
 * 显示某个类别的列表，并收起未显示的类别
 * */
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


function uiShowEdit() {
	$('#new-dialog').animate({
	    top: 90
	  }, 500, function() {
	 });
}

var editingId;
function showAdd(name) {
	$('#new-dialog .upper-title').hide();
	$('#' + name + "-title").show();
	uiShowEdit();
}

function openRename() {
	$('#new-dialog .upper-title').hide();
	var data = $('#timer').data("data");
	$('#rename-title').show();
	
	$('#txtinput').val(data.title);
	$('#new-dialog').data("data", data);
	uiShowEdit();
}

function saveOrUpdate() {
	var object = $('#new-dialog').data('data');
	if (object==null) {
		object = {};
		object.created = new Date().getTime();
	}
	object.updated = new Date().getTime();
	object.title = $('#txtinput').val();
	var type = $('#task-list ul:visible').attr("id");
	object.type = type;
	
	if (object.___id) {
		$('#' + object.___id + " div.left").html(object.title);
		$('#timer div.upper-title').html(object.title);
		db(object.___id).update(object);
	} else {
		db.insert(object);
		if (type=="todos") {
			drawTodos(object);
		} else if (type=="breaks") {
			object.todo = $('#timer')
			drawBreaks(object);
		} else if (type=="plans") {
			
		}
	}
	closeEdit();
	checkAndFill();
}



function removeCurrent() {
	var data = $('#timer').data("data");
	if (data!=null) {
		db(data.___id).remove(true);
		$('#' + data.___id).remove();
		initWelcome();
	}
	checkAndFill();
}

function drawBreaks(object) {
	
}

function drawTodos(object) {
	var cloned = $('#todos li.hidden').clone();
	cloned.removeClass("hidden");
	cloned.addClass("info");
	//$('#todos').find('li.intr').hide();
	$('#todos').append(cloned);
	cloned.find('div.left').html(object.title);
	cloned.attr("id", object.___id);
	if (object.tomatoes) {
		cloned.find("p.tomatoes").css('width', object.tomatoes.length * 16 + "px");
	}
	if (object.quotes) {
		cloned.find("p.quotes").css('width', object.quotes.length * 16 + "px");
	}
	
	cloned.data("data", object);
	
	cloned.click(function(){
		var todo = $(this).data("data");
		$('#timer').data('data',todo);
		$('#timer div.upper-title').html(todo.title);
		$('#time-remains').html("25:00");
		$('#timer div.operations a').hide();
		$('#btn-start').show();
		$('#btn-rename').show();
		$('#btn-remove').show();
	});
}


function closeEdit() {
	$('#new-dialog').data('data', null);
	$('#new-dialog').animate({
	    top: -140
	  }, 500, function() {
		  $('#txtinput').val('');
		  //$('#task-list').focus();
		  //$('#txtinput').hide();
	    // Animation complete.
	  });
}