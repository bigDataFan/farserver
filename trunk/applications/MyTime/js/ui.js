var uidiv_global_popup = null;
var CHART_ID = "gq_extension_timer_chart";

var loadedData;


function uiDraw(content) {
	loadedData = content;
	uidiv_global_popup = $('#gq_extension_wrapper');
	
	if (uidiv_global_popup.length!=0) {
		uidiv_global_popup.html('');
	} else {
		uidiv_global_popup = $('<div id="gq_extension_wrapper" class="extension_wrapper"></div>');
		$('body').append(uidiv_global_popup);
	}
	/*
	if (uidiv_global_popup.length==0) {
		var gqwrapdiv = $('<div id="gq_extension_wrapper" class="extension_wrapper"></div>');
		$('body').append(gqwrapdiv);
		uidiv_global_popup = $('#gq_extension_wrapper'); 
	} else {
		return;
	}
	*/
	
	
	uidiv_global_popup.append('<div class="close"><a class="close" href="#">&nbsp;</a></div>');
	//draw  content
	uidiv_global_popup.append('<h1>My Time&Work <a class="list" href="#">&nbsp;</a> <a class="graph" href="#">&nbsp;</a> <a class="new" href="#">&nbsp;</a></h1>');

	uidiv_global_popup.append('<div class="list"></div>');
	uidiv_global_popup.append('<div class="graph" id="' + CHART_ID + '"></div>');
	
	uidiv_global_popup.append('<div class="additem" style="display: none">' 
			+ '<input class="inputarea"></input><a class="run" href="#">&nbsp;</a>'
			+ '<a class="cancel" href="#">&nbsp;</a>'
			+ '</div>');
	
	var additemdiv = uidiv_global_popup.find('div.additem');
	additemdiv.css("padding","25px");
	additemdiv.css("margin", "0px -30px");
	
	uidiv_global_popup.append('<div class="summary">'
			+ '<h4>Total<a>00:00</a></h4>'
			+ '</div>');   
	
	TimeStore.Init(loadedData.data);
	
	uidiv_global_popup.find('h1 a').css("padding-top","1px");
	uidiv_global_popup.find('h1 a').css("padding-left","10px");
	uidiv_global_popup.find('h1 a').css("margin-lef","10px");
	uidiv_global_popup.find('h1 a').css("margin-bottom","5px");
	uidiv_global_popup.find('h1 a').css("text-decoration","none");
	
	
	uidiv_global_popup.find('div.close a.close').click(
			function() {
				closeUi();
			}
	);
	
	uidiv_global_popup.find('a.graph').click(
			function() {
				$(this).hide();
				uidiv_global_popup.find('a.new').hide();
				uidiv_global_popup.find("h1 a.list").show();
				drawChart();
			}
	);
	
	uidiv_global_popup.find("h1 a.list").hide();
	uidiv_global_popup.find("h1 a.list").click(
			function() {
				$(this).hide();
				uidiv_global_popup.find('a.graph').show();
				uidiv_global_popup.find('a.new').show();
				$("#" + CHART_ID).hide();
				uidiv_global_popup.find('div.list').fadeIn();
			}	
	);
	
	
	uidiv_global_popup.find('a.new').click(
		function() {
			if (loadedData.isToday) {
				showEditBox(null);
			}
		}
	);
		
	
	
	uidiv_global_popup.find('a.run').click(
			function() {
				saveEditBox();
			}
	);

	
	uidiv_global_popup.find('a.cancel').click(
			function() {
				if (uidiv_global_popup.find('.inputarea').data("srcDiv")) {
					TimeStore.removeItem(uidiv_global_popup.find('.inputarea').data("srcDiv").attr("id"));
					removeUiItem(uidiv_global_popup.find('.inputarea').data("srcDiv").attr("id"));
				}
				cancelEditBox();
			}
	);

	uidiv_global_popup.find('div.entry').dblclick(
		function() {
			showEditBox($(this));
		}
	);
	uidiv_global_popup.slideDown();
	
	setTimeout("scheduleUpdate()",60000);
}


function closeUi() {
	uidiv_global_popup.slideUp("normal",
			function() {
				uidiv_global_popup.remove();
			});
}



function removeUiItem(id) {
	$('#' + id).remove();
}


function updateUiTotal(total) {
	uidiv_global_popup.find('div.summary').find('h4 a').html(formatDate(total));
}

function cleanUi() {
	uidiv_global_popup.find('div.list').html('');
}


function addUiItem(item) {
	
	var dura = item.dura;
	
	var showRunning = item.running && loadedData.isToday;
	if (showRunning) {
		dura = item.dura + (new Date().getTime() - item.begins);
	}
	
	var entryDiv = $('<div id="' + item.start + '" class="entry ' + (showRunning?"running":"normal") + '"><h4><b>'
			+ item.desc + '</b> <span class="config">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' 
			//+ '<small>' + new DateFormat(new Date(item.start)).format('hh:mi')  + '</small>'
			+ '<a class="rs" href="#">'
			+ formatDate(dura) + '</a></h4></div>');
	uidiv_global_popup.find('div.list').append(entryDiv);
	
	if (showRunning) {
		entryDiv.css("padding", "25px");
		entryDiv.css("margin", "0px -30px");
	} else {
		entryDiv.css("margin", "0px");
		entryDiv.css("padding", "8px");
	}
	
	entryDiv.find('span.config').hide();

	if (!loadedData.isToday) return;

	//add controls for today items
	entryDiv.find('span.config').click(
		function(){ 
			showEditBox(entryDiv);
		}
	);
	
	entryDiv.hover(
			function() {
				$(this).find('span.config').show();
			},
			function() {
				$(this).find('span.config').hide();
			}
	);
	
	if (item.running) {
		entryDiv.find('a').click(
				function(){
					var parentDiv = $(this).parent().parent();
					stop(parentDiv);
				}
		);
	} else {
		entryDiv.find('a').click(
				function(){
					var parentDiv = $(this).parent().parent();
					run(parentDiv);
				}
		);
	}
}

function run(parentDiv) {
	TimeStore.runItem(parentDiv);
	setTimeout("scheduleUpdate()",60000);
	
	uidiv_global_popup.find('div.running').removeClass("running").addClass("normal").css("margin", "0px").css("padding", "8px");
	parentDiv.removeClass("normal").addClass("running").css("padding","25px").css("margin", "0px -30px");

	rebindAll();
}



function rebindAll() {
	uidiv_global_popup.find('div.entry h4 a').unbind("click");
	
	uidiv_global_popup.find('div.running h4 a').click(
		function() {
			var parentDiv = $(this).parent().parent();
			stop(parentDiv);
		}
	);
	
	uidiv_global_popup.find('div.normal h4 a').click(
		function() {
			var parentDiv = $(this).parent().parent();
			run(parentDiv);
		}
	);
}

function stop(parentDiv) {
	TimeStore.stopRunning();
	uidiv_global_popup.find('div.running').removeClass("running").addClass("normal").css("margin", "0px").css("padding", "8px");
	rebindAll();
}

function formatDate(mill) {
	var d3 = new Date(parseInt(mill));
	return ((d3.getDate()-1)*24 + (d3.getHours()-8)) + ":" 
	+ ((d3.getMinutes()<10)?("0"+d3.getMinutes()):d3.getMinutes()); 
}

function formatedToMill(formated) {
	if (formated==null) return;
	var sr = formated.split(":");
	return parseInt(sr[0])*60*60*1000 + parseInt(sr[1].charAt(0)=='0'?sr[1].charAt(1):sr[1])*60*1000;
}



function showEditBox(srcDiv) {
	uidiv_global_popup.find('div.running').hide();
	uidiv_global_popup.find('div.list').slideUp();
	uidiv_global_popup.find('div.additem').fadeIn();
	uidiv_global_popup.find('.inputarea').val('');
	uidiv_global_popup.find('.inputarea').data("srcDiv",null);
	if (srcDiv) {
		uidiv_global_popup.find('.inputarea').data("srcDiv",srcDiv);
		uidiv_global_popup.find('.inputarea').val(srcDiv.find('h4 b').html());
	} 
}

function cancelEditBox() {
	uidiv_global_popup.find('div.additem').slideUp();
	uidiv_global_popup.find('div.list').slideDown();
	uidiv_global_popup.find('div.running').fadeIn(1500);
}

function saveEditBox() {
	if ($('.inputarea').data("srcDiv")) {
		$('.inputarea').data("srcDiv").find('h4 b').html($('.inputarea').val());
		TimeStore.saveItem($('.inputarea').data("srcDiv").attr("id"),$('.inputarea').val());
	} else {
		var item = TimeStore.createItem($('.inputarea').val());
		addUiItem(item);
	}
	$('div.additem').slideUp();
	$('div.list').slideDown();
	$('div.running').fadeIn(1500);
}


	//setTimeout("scheduleUpdate()",60000);

function scheduleUpdate() {
	
	if (uidiv_global_popup) {
		var durhtml = uidiv_global_popup.find("div.list div.running a.rs");
		if (durhtml) {
			var totalhtml = uidiv_global_popup.find('div.summary').find('h4 a');
			$(durhtml).html(formatDate(formatedToMill($(durhtml).html()) + 60*1000));
			$(totalhtml).html(formatDate(formatedToMill($(totalhtml).html()) + 60*1000))
		}
	}
	
	setTimeout("scheduleUpdate()",60000);
}




function drawChart() {
	uidiv_global_popup.find("div.list").hide();
	uidiv_global_popup.find("div.graph").fadeIn();

	var chartArray = TimeStore.getGraphArray();
	var chart = new Highcharts.Chart({
		chart: {
			renderTo: CHART_ID,
			margin: [20, 60, 50, 20]
		},
		title: {
			text: "Time Chart"
		},
		plotArea: {
			shadow: null,
			borderWidth: null,
			backgroundColor: null
		},
		tooltip: {
			formatter: function() {
				return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
			}
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				dataLabels: {
					enabled: true,
					formatter: function() {
						if (this.y > 5) return this.point.name;
					},
					color: 'white',
					style: {
						font: '13px Trebuchet MS, Verdana, sans-serif'
					}
				}
			}
		},
		legend: {
			layout: 'vertical',
			style: {
				bottom: '10px',
				right: '10px',
				left:'auto',
				top:'auto'
			}
		},
		credits: {
			href:"http://www.g-qu.net",
			text:"g-qu.net"
		},
	        series: [{
			type: 'pie',
			name: 'Browser share',
			data: chartArray
			/*
			[
				['Firefox',   44.2],
				['IE7',       26.6],
				{
					name: 'IE6',
					y: 20,
					sliced: true,
					selected: true
				},
				['Chrome',    3.1],
				['Safari',    2.7],
				['Opera',     2.3],
				['Mozilla',   0.4]
			]
			*/
			//data: [3.40, 1.05, 2.90, 1.65, 1.35, 2.59, 1.39, 3.07, 2.82]
		}]
	});
	
	
}