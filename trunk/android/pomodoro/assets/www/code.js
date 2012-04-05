/**
 * 
 */
var db;
var keys = ['todos', 'breaks', 'plans'];

var WORK_TIME = 25 * 60 * 1000;

$(document).ready(function(){
	
	db = new TAFFY();
	db.store("ever365.pomodoro");
	
	initWelcome();
	
	$('#timer').css('top', 90);
	displayAll();
	
	var startItem = db({start:{isNumber:true}});
	
	if (startItem.count()==1) {
		var data = startItem.first();
		switchTodo(data);
		$('#timer').data("running", data);
		uiUpdateTime();
		return;
	}
	
	if (getBreakDuration()>-1) {
		switchBreaks();
		uiUpdateTime();
	}
});

function initWelcome() {
	//$('#timer div.upper-title').html('请选择要执行的任务');
	$('#time-remains').html(formatDura(WORK_TIME));
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
	
	db({type:"breaks", date:d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()}).each(
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

function start() {
	var data = $('#timer').data('data');
	$('#timer').data("running", data);
	data.start = new Date().getTime();
	db(data.___id).update(data);
	uiUpdateTime();
}

function stop() {
	if (confirm("您将无法为任务获取番茄， 如无特别紧急的中断， 请集中精力完成一个番茄时间。是否继续？")) {
		var data = $('#timer').data('data');
		$('#timer').data('running', null);
		data.start = null;
		db(data.___id).update(data);
		$('#btn-start').show();
		$('#btn-stop').hide();
	}
}

//开始休息按钮点击事件
function breaks() {
	getPomodoro();
	switchBreaks();
}

function getPomodoro() {
	var data = $('#timer').data('data');
	if (data && data.start) {
		var now = new Date().getTime();
		
		var remains = WORK_TIME - (now - data.start);
		
		if (remains<0) {
			if (data.pomodoroes==null) {
				data.pomodoroes = [];
			}
			data.pomodoroes.push(data.start + "-" + now);
			
			data.start = null;
			running = false;
			setBreakStart(now);
			saveObject(data);
		}
	}
}

function switchBreaks() {
	running = false;
	$('#timer div.upper-title').html("休息中");
}

function uiUpdateTime() {
	var data = $('#timer').data('running');
	if (data && data.start) {
		var now = new Date().getTime();
		
		var remains = WORK_TIME - (now - data.start);
		$('#btn-start').hide();
		
		if (remains<0) {
			$('#time-remains').html("00:00");
			$('#btn-stop').hide();
			$('#btn-break').show();
		}  else {
			$('#btn-stop').show();
			if (remains<5*60*1000) {
				$('#time-remains').addClass("green");
			}
			$('#time-remains').html(formatDura(remains));
		}
		setTimeout('uiUpdateTime()', 1000);
		return;
	}
	var breakDuration = getBreakDuration();
	if (breakDuration>-1) {
		$('#time-remains').html(formatDura(remains));
		setTimeout('uiUpdateTime()', 1000);
		return;
	}
	
	$('#time-remains').html(formatDura(WORK_TIME));
}


/**
 * 显示某个类别的列表，并收起未显示的类别
 * */
function showList(name) {
	if ($('#' + name).filter(":visible").length==1) {
		return;
	}
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
	} else {
		if (type=="todos") {
			drawTodos(object);
			saveObject(object);
		} else if (type=="breaks") {
			object.todo = $('#timer').data('running').___id;
			var d = new Date();
			object.date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
			saveObject(object);
			
			var runningData = $('#timer').data('running');
			
			if (runningData.quotes==null) {
				runningData.quotes = [];
			}
			runningData.quotes.push(object);
			saveObject(runningData);
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
	$('#breaks').append('<li class="task info"><div class="left">' + object.title + '</div></li>');
}

function drawTodos(object) {
	var cloned = $('#todos li.hidden').clone();
	cloned.removeClass("hidden");
	cloned.addClass("info");
	//$('#todos').find('li.intr').hide();
	$('#todos').append(cloned);
	cloned.find('div.left').html(object.title);
	cloned.attr("id", object.___id);
	if (object.pomodoroes) {
		cloned.find("p.tomatoes").html(object.pomodoroes.length);
	}
	if (object.quotes) {
		cloned.find("p.quotes").html(object.quotes.length);
	}
	
	cloned.data("data", object);
	
	cloned.click(function(){
		var todo = $(this).data("data");
		switchTodo(todo);
	});
}


function getBreakDuration() {
	var breakStart = 0;
	
	if(localStorage) {
		breakStart = localStorage.getItem("breakStart");
	}
	if (breakStart ==null) {
		return -1;
	}
	var now = new Date().getTime();
		
	if (now - breakStart>60*60*1000) {
		return -1;
	}
		
	return now - breakStart;
}

function setBreakStart(now) {
	if(localStorage) {
		localStorage.setItem("breakStart", now);
	}
}


function switchTodo(data) {
	if (isRunning()) return;
	$('#timer').data('data',data);
	$('#timer div.upper-title').html(data.title);
	$('#time-remains').html(formatDura(WORK_TIME));
	$('#timer div.operations a').hide();
	$('#btn-start').show();
	$('#btn-rename').show();
	$('#btn-remove').show();
}


function isRunning() {
	return !($('#timer').data('running')==null);
}

function saveObject(data) {
	if (data) {
		if (data.___id) {
			db(data.___id).update(data);
		} else {
			db.insert(data);
		}
	}
}

function showAdd(name) {
	if (name=="breaks" && !isRunning()) {
		alert("当您开始番茄时间后，才能记录中断");
		return;
	}
	
	$('#new-dialog .upper-title').hide();
	$('#' + name + "-title").show();
	uiShowEdit();
}


function uiShowEdit() {
	$('#new-dialog').animate({
	    top: 60
	  }, 500, function() {
	 });
}

function closeEdit() {
	$('#new-dialog').data('data', null);
	
	$('#new-dialog').animate({
	    top: -140
	  }, 500, function() {
		  $('#txtinput').val('');
		  //$('#txtinput').hide();
		  // Animation complete.
	  });
}


function formatDura(mill) {
	var d3 = new Date(parseInt(mill));
	return ((d3.getMinutes()<10)?("0"+d3.getMinutes()):d3.getMinutes()) + ":" + ((d3.getSeconds()<10)?("0" + d3.getSeconds()):d3.getSeconds()); 
}