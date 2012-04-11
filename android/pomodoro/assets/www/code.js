/**
 * 
 */
var db;
var keys = ['todos', 'breaks', 'plans'];

var WORK_TIME = 25 * 60 * 1000;
var BREAK_TIME = 5 * 60 * 1000;
var CLICK_TIME = 10 * 60 * 1000;

var VIEW_RUNNING = 0;
var VIEW_FREE = 1;
var VIEW_BREAKING = 2;
var VIEW_RUNOVER = 3;

var currentView;

$(document).ready(function(){
	$('.btn-a,.add').bind("touchstart", onTouchedDown);
	$('.btn-a,.add').bind("touchend", onTouchedUp);
	db = new TAFFY();
	db.store("ever365.pomodoro");
	
	displayAll();
	var running = getRunningDuration();
	
	$('#header .header-btn').hide();
	
	if (running>0) {
		if (running>WORK_TIME && running <CLICK_TIME + WORK_TIME) {
			currentView = VIEW_RUNOVER;
			viewRunOver();
		} else if (running<WORK_TIME) {
			currentView = VIEW_RUNNING;
			viewRunning();
		} else {
			var startItem = db({start:{isNumber:true}});
			if (startItem.count()==1) {
				var data = startItem.first();
				data.start = null;
				db(data.___id).update(data);
			}
			currentView = VIEW_FREE;
			viewFree();
		}
	} else if (getBreakDuration()>-1 && getBreakDuration()<BREAK_TIME) {
		currentView = VIEW_BREAKING;
		viewBreaking();
	} else {
		currentView = VIEW_FREE;
		viewFree();
	}
	
	//alert(currentView);
});

function onTouchedDown() {
	$(this).addClass("button-down");
}

function onTouchedUp() {
	$(this).removeClass("button-down");
}

function viewRunning() {
	var startItem = db({start:{isNumber:true}});
	if (startItem.count()==1) {
		var data = startItem.first();
		$('#timer .btn-a').hide();
		$('#timer .upper-title').html(data.title);
		$('#timer').data("running", data);
		$('#btn-start').hide();
		$('#btn-stop').show();
		$('#btn-knowabout').hide();
		uiUpdateTime();
		return;
	}
}


function viewRunOver() {
	var startItem = db({start:{isNumber:true}});
	$('#timer .btn-a').hide();
	$('#btn-break').show();
	
	if (startItem.count()==1) {
		var data = startItem.first();
		$('#timer').data("running", data);
		$('#timer .upper-title').html(data.title);
		$('#btn-knowabout').hide();
		$('#time-remains').html("00:00");
		return;
	}
}

function viewFree() {
	$('#timer .upper-title').html("请选择任务");
	$('#time-remains').html(formatDura(WORK_TIME));
	$('#timer div.operations a').hide();
	$('.header-btn').hide();
	$('#btn-knowabout').show();
}

function viewBreaking() {
	$('#timer').data('running', null);
	$('#timer .btn-a').hide();
	$('#timer div.upper-title').html("休息中");
	$('#btn-break-stop').show();
	$('#btn-knowabout').hide();
	uiUpdateTime();
}

function displayAll() {
	var d = new Date();
	var todayFormat = formateDate(d);
	db({type:"todos",finished:{"!is":true}}).each(
			function (record,recordnumber) {
				if(record.finishDate && record.finishDate!=todayFormat) {
					return;
				}
				drawTodos(record);
			}
	);
	var d = new Date();
	
	db({type:"breaks", date:d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()}).each(
			function (record,recordnumber) {
				drawBreaks(record);
			}	
	);
	
	
	db({type:"plans"}).each(
			function (record,recordnumber) {
				drawPlans(record);
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
	$('#header .header-btn').hide();
	var data = $('#timer').data('data');
	$('#timer').data("running", data);
	$('#btn-start').hide();
	$('#btn-stop').show();
	data.start = new Date().getTime();
	db(data.___id).update(data);
	currentView = VIEW_RUNNING;
	uiUpdateTime();
}

function stop() {
	if (confirm("您将无法为任务获取番茄， 如无特别紧急的中断， 请集中精力完成一个番茄时间。是否继续？")) {
		var data = $('#timer').data('running');
		$('#timer').data('running', null);
		data.start = null;
		db(data.___id).update(data);
		$('#timer .upper-title').html('请选择任务');
		$('#btn-start').show();
		$('#btn-stop').hide();
		currentView = VIEW_FREE;
		viewFree();
	}
}

//开始休息按钮点击事件
function breaks() {
	getPomodoro();
	currentView = VIEW_BREAKING;
	viewBreaking();
}

function finishBreak() {
	if (confirm("建议您休息必要的时间以更好的工作。确认中断休息？")) {
		setBreakStart(0);
		currentView = VIEW_FREE;
		$('#timer .upper-title').html('请选择任务');
		viewFree();
	}
}

function getPomodoro() {
	var startItem = db({start:{isNumber:true}});
	
	if (startItem.count()==1) {
		var data = startItem.first();
		var now = new Date().getTime();
		
		var remains = WORK_TIME - (now - data.start);
		
		if (remains<0) {
			if (data.pomodoroes==null) {
				data.pomodoroes = [];
			}
			data.pomodoroes.push(data.start + "-" + now);
			data.start = null;
			setBreakStart(now);
			saveObject(data);
		}
		
		$('#' + data.___id).find("p.tomatoes").html(data.pomodoroes.length);
	}
}


/**
 * 更新页面上的读秒
 * */
function uiUpdateTime() {
	if(currentView==VIEW_FREE) return;
	
	if(currentView==VIEW_RUNNING) {
		var data = $('#timer').data('running');
		if (data && data.start) {
			var now = new Date().getTime();
			var remains = WORK_TIME - (now - data.start);
			
			if (remains<0) {
				currentView = VIEW_RUNOVER;
				viewRunOver();
			}  else {
				if (remains<5*60*1000) {
					$('#time-remains').addClass("green");
				}
				$('#time-remains').html(formatDura(remains));
			}
			setTimeout('uiUpdateTime()', 1000);
			return;
		}
	} else if (currentView==VIEW_BREAKING) {
		var breakDuration = getBreakDuration();
		if (breakDuration==-1 || breakDuration>BREAK_TIME) {
			setBreakStart(0);
			currentView=VIEW_FREE;
			viewFree();
		} else {
			$('#time-remains').addClass("green");
			$('#time-remains').html(formatDura(BREAK_TIME-breakDuration));
			setTimeout('uiUpdateTime()', 1000);
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
	$('li.checked').removeClass('checked');
	$('#header .header-btn').hide();
	
	$('#task-list div.title div.add').hide();
	$('#task-list ul').slideUp('fast');
	$('#' + name).slideDown('fast',
			function() {
				$("#" + name + "-add").fadeIn();	
			}
	);
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
	
	if (type=="todos") {
		saveObject(object);
		if ($('#' + object.___id).length==1) {
			$('#' + object.___id + " div.left").html(object.title);
			$('#timer div.upper-title').html(object.title);
		} else {
			drawTodos(object);
		}
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
		saveObject(object);
		drawPlans(object);
	}
	closeEdit();
	checkAndFill();
}


function openRename() {
	$('#new-dialog .upper-title').hide();
	
	var data = $('li.checked').data('data');
	
	if (data!=null) {
		$('#rename-title').show();
		$('#txtinput').val(data.title);
		$('#new-dialog').data("data", data);
		uiShowEdit();
	}
}

function removeCurrent() {
	var data = $('li.checked').data("data");
	//var data = $('#timer').data("data");
	
	if (data.type=="todos") {
		viewFree();
	}
	$('.header-btn').hide();
	if (data!=null) {
		db(data.___id).remove(true);
		$('#' + data.___id).remove();
	}
	checkAndFill();
}

function setAsTodo() {
	var data = $('li.checked').data("data");
	if (data.type=="plans") {
		$('#header .header-btn').hide();
		data.type = "todos";
		saveObject(data);
		drawTodos(data);
		$('li.checked').remove();
	}
}

function finishCurrent() {
	var data = $('li.checked').data("data");
	if (data.type=="todos") {
		data.finishDate = formateDate(new Date());
		data.finishTime = new Date().getTime();
		saveObject(data);
		$('#header .header-btn').hide();
		$('#btn-unfinished').show();
		$('li.checked').addClass('finished');
	}
}

function unfinishCurrent() {
	var data = $('li.checked').data("data");
	if (data.type=="todos") {
		data.finishDate = null;
		data.finishTime = null;
		saveObject(data);
		$('#header .header-btn').hide();
		$('li.checked').removeClass('finished');
		
		if (currentView==VIEW_FREE) {
			$('#btn-rename').show();
			$('#btn-remove').show();
			$('#btn-finished').show();
		}
	}
}

function drawBreaks(object) {
	if ($('#' + object.___id).length==1) {
		$('#' + object.___id).find('div.left').html(object.title);
		$('#' + object.___id).data("data", object);
	} else {
		var li = $('<li class="task info"><div class="left">' + object.title + '</div></li>');
		li.attr("id", object.___id);
		li.data("data", object);
		li.bind(BIND, function(){
			$('li.checked').removeClass('checked');
			$(this).addClass('checked');
			$('#btn-rename, #btn-remove').show();
		});
		
		$('#breaks').append(li);
	}
}

function drawPlans(object) {
	if ($('#' + object.___id).length==1) {
		$('#' + object.___id).find('div.left').html(object.title);
		$('#' + object.___id).data("data", object);
	} else {
		var li = $('<li class="task info"><div class="left">' + object.title + '</div></li>');
		li.attr("id", object.___id);
		li.data("data", object);
		
		li.bind(BIND, function(){
			$('li.checked').removeClass('checked');
			$(this).addClass('checked');
			$('#btn-rename, #btn-remove, #btn-setTodo').show();
		});
		
		$('#plans').append(li);
	}
}


function drawTodos(object) {
	var cloned = $('#todos li.hidden').clone();
	cloned.removeClass("hidden");
	cloned.addClass("info");
	$('#todos').append(cloned);
	cloned.find('div.left').html(object.title);
	cloned.attr("id", object.___id);
	if (object.pomodoroes) {
		cloned.find("p.tomatoes").html(object.pomodoroes.length);
	}
	if (object.quotes) {
		cloned.find("p.quotes").html(object.quotes.length);
	}
	
	if (object.finishDate) {
		cloned.addClass("finished");
	}
	
	cloned.data("data", object);
	
	
	cloned.bind(BIND, onTodoItemClick);
	
	//cloned.click();
}

function onTodoItemClick() {
	var todo = $(this).data("data");
	$('li.checked').removeClass('checked');
	$(this).addClass('checked');
	
	$('#header .header-btn').hide();

	if (todo.finishDate) {
		$('#btn-unfinished').show();
		return;
	}
	
	if (currentView==VIEW_FREE) {
		$('#btn-rename').show();
		$('#btn-remove').show();
		$('#btn-finished').show();
		$('#timer').data("data", todo);
		$('#timer .upper-title').html(todo.title);
		$('#btn-knowabout').hide();
		$('#btn-start').show();
	} else {
		showMessage("您需要在任务完成后才能进行修改", 3000);
	}
}

/**
 * 获取正在运行的任务已经执行时间  
 * 如果没有 返回-1
 * */
function getRunningDuration() {
	var startItem = db({start:{isNumber:true}});
	if (startItem.count()==1) {
		var data = startItem.first();
		return new Date().getTime() - data.start;
	} else {
		return -1;
	}
}

/**
 * 获取中断的已经执行时间
 * @returns {Number}
 */
function getBreakDuration() {
	var breakStart = 0;
	
	if(localStorage) {
		breakStart = parseFloat(localStorage.getItem("breakStart"));
	}
	
	if (breakStart ==null || breakStart==0 ) {
		return -1;
	}
	var now = new Date().getTime();
	if (now - breakStart>BREAK_TIME) {
		return -1;
	}
	return now - breakStart;
}

function setBreakStart(now) {
	if(localStorage) {
		localStorage.setItem("breakStart", now);
	}
}

function isInLine() {
	if (getBreakDuration()==-1 || getBreakDuration()>BREAK_TIME) {
		return false;
	}
	
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
	
	if (name=="breaks") {
		if (currentView==VIEW_RUNNING) {
			$('#new-dialog .upper-title').hide();
			$('#' + name + "-title").show();
			uiShowEdit();
		} else {
			showMessage("当您开始番茄时间后，才能记录中断", 3000);
		}
	} else {
		$('#new-dialog .upper-title').hide();
		$('#' + name + "-title").show();
		uiShowEdit();
	}
}


function uiShowEdit() {
	$('#new-dialog').animate({
	    top: 51
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

function showMessage(msg, hideMill) {
	$('#message').slideDown();
	$('#message').html(msg);
	$('#header').slideUp();
	
	setTimeout('headerResume()', hideMill);
}

function headerResume() {
	$('#message').slideUp();
	$('#header').slideDown();
}

function formatDura(mill) {
	var d3 = new Date(parseInt(mill));
	return ((d3.getMinutes()<10)?("0"+d3.getMinutes()):d3.getMinutes()) + ":" + ((d3.getSeconds()<10)?("0" + d3.getSeconds()):d3.getSeconds()); 
}
function formateDate(date) {
	return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
	
}
