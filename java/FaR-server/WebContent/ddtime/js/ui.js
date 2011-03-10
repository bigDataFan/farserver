function bindEvents(uidiv_global_popup) {
	
	/**列表和统计图形切换*/
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
				$("#gq_extension_timer_chart").hide();
				uidiv_global_popup.find('div.list').fadeIn();
			}	
	);
	
	/**新增事件按钮*/
	/*
	uidiv_global_popup.find('a.new').click(
			function() {
				showEditBox(null);
			}
	);
	*/
	
	/**新增保存按钮*/
	uidiv_global_popup.find('a.run').click(
			function() {
				saveEditBox();
			}
	);
	
	
	uidiv_global_popup.find('a.cancel').click(
			function() {
				if (uidiv_global_popup.find('.inputarea').data("srcDiv")) {
					removeItemFromStore(uidiv_global_popup.find('.inputarea').data("srcDiv").attr("id"));
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


function calculateUiTotal() {
	var total = 0;
	uidiv_global_popup.find("div.list div.entry a.rs").each(
			function() {
				total += formatedToMill($(this).html());
			}
	);
	$('#total').html(formatDate(total));
	//uidiv_global_popup.find('div.summary').find('h4 a').html();
}

function updateUiTotal(total) {
}

function cleanUi() {
	uidiv_global_popup.find('div.list').html('');
}


function addUiItem(item) {
	
	var dura = item.dura;
	if (item.running) {
		dura = item.dura + (new Date().getTime() - item.begins);
	}
	
	var entryDiv = $('<div id="' + item.start + '" class="entry ' + (item.running?"running":"normal") + '"><h4><span class="desc">'
			+ item.desc + ' </span><span class="config">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' 
			//+ '<small>' + new DateFormat(new Date(item.start)).format('hh:mi')  + '</small>'
			+ '<a class="rs" href="#">'
			+ formatDate(dura) + '</a></h4></div>');
	uidiv_global_popup.find('div.list').append(entryDiv);

	/*
	if (showRunning) {
		entryDiv.css("padding", "25px");
		entryDiv.css("margin", "0px -30px");
	} else {
		entryDiv.css("margin", "0px");
		entryDiv.css("padding", "8px");
	}
	
	*/
	
	entryDiv.find('span.config').hide();

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
					stop();
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
	startItemInStore(parentDiv.attr('id') , function(data) {
			$('div.running').removeClass("running").addClass("normal").css("margin", "0px").css("padding", "8px");
			parentDiv.removeClass("normal").addClass("running").css("padding","25px").css("margin", "0px -30px");
			rebindAll();
			setTimeout("scheduleUpdate()",60000);
		}
	);
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

function stop() {
	stopItemInStore();
	uidiv_global_popup.find('div.running').removeClass("running").addClass("normal").css("margin", "0px").css("padding", "8px");
	rebindAll();
}

function formatDate(mill) {
	var d3 = new Date(parseInt(mill));
	return ((d3.getDate()-1)*24 + (d3.getHours()-8)) + ":" 
	+ ((d3.getMinutes()<10)?("0"+d3.getMinutes()):d3.getMinutes()); 
}

function formatedToMill(formated) {
	if (formated==null) return 0;
	var sr = formated.split(":");
	return parseInt(sr[0])*60*60*1000 + parseInt(sr[1].charAt(0)=='0'?sr[1].charAt(1):sr[1])*60*1000;
}



function showEditBox(srcDiv) {
	uidiv_global_popup.find('div.running').hide();
	uidiv_global_popup.find('div.list').slideUp(200);
	uidiv_global_popup.find('div.additem').show();
	uidiv_global_popup.find('.inputarea').val('');
	uidiv_global_popup.find('.inputarea').data("srcDiv",null);
	if (srcDiv) {
		uidiv_global_popup.find('.inputarea').data("srcDiv",srcDiv);
		uidiv_global_popup.find('.inputarea').val(srcDiv.find('h4 span.desc').html());
	} 
}

function cancelEditBox() {
	uidiv_global_popup.find('div.additem').hide();
	uidiv_global_popup.find('div.running').show();
	uidiv_global_popup.find('div.list').slideDown(200);
}

function saveEditBox() {
	$('span.saving').show();
	if ($('.inputarea').data("srcDiv")) {
		updateItemInStore($('.inputarea').data("srcDiv").attr("id"), $('.inputarea').val(),
				function(data) {
					$('.inputarea').data("srcDiv").find('h4 span.desc').html($('.inputarea').val());
					$('span.saving').hide();
					$('div.additem').slideUp(200);
					$('div.list').slideDown(200);
					$('div.running').fadeIn(400);
				}
		)
	} else {
		addItem2Store($('.inputarea').val(),
				function (data) {
					var item = JSON.parse(data);
					addUiItem(item);
					$('span.saving').hide();
					$('div.additem').slideUp(200);
					$('div.list').slideDown(200);
					$('div.running').fadeIn(400);
				}
		);
	}
}


	//setTimeout("scheduleUpdate()",60000);

function scheduleUpdate() {
	
	if (uidiv_global_popup) {
		var durhtml = uidiv_global_popup.find("div.list div.running a.rs");
		if (durhtml) {
			$(durhtml).html(formatDate(formatedToMill($(durhtml).html()) + 60*1000));
			//var totalhtml = uidiv_global_popup.find('div.summary').find('h4 a');
			$("#total").html(formatDate(formatedToMill($("#total").html()) + 60*1000))
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

function getTodayItemsInStore(cb) {
	$.getJSON("service/today.gs",
			{},
			cb);
}

function getRecentItemsInStore(cb) {
	$.getJSON("service/recents.gs",
			{},
			cb);
}



function updateItemInStore(id, content, cb) {
	$.post("service/update.gs",
			{
				"id":id,
				"content":content
			},
			cb
	);
}

function removeItemFromStore(id, cb) {
	$.post("service/remove.gs",
			{
				"id":id
			},
			cb
	);
}


function startItemInStore(id, cb) {
	if ($.browser.msie) {
		location.href = "service/start.gs?id=" + id;
	} else {
		$.post("service/start.gs",
				{
			"id":id
				},
				cb
		);
	}
}

function stopItemInStore() {
	$.post("service/stop.gs",
			function(data) {
			}
	);
}

function addItem2Store(content, cb) {
	$.post("service/add.gs",
			{"desc":content},
			cb
	);
}