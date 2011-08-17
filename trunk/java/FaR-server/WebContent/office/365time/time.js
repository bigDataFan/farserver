var office = new Object();

office.date = new Date();

office.preday = function() {
	office.date = new Date(office.date.getTime() - 24*60*60*1000); 
	if (office.currentTab!=null) {
		office.currentTab.load();
	}
};

office.nextday = function() {
	office.date = new Date(office.date.getTime() + 24*60*60*1000);
	if (office.currentTab!=null) {
		office.currentTab.load();
	}
};

office.today = function() {
	office.date = new Date();
	if (office.currentTab!=null) {
		office.currentTab.load();
	}
};

office.getDateFormat = function(dd) {
	return dd.getFullYear() + "-" + (dd.getMonth()+1) + "-" + dd.getDate();
}


office.time = {
	load:function() {
		$("#times").find('div.running div.timeOper a').live('click', function(data) {
			office.time.stopItem();
		});
		$("#times").find('div.pending div.timeOper a').live('click', function(data) {
			office.time.startItem($(this).attr('id'));
		});
		office.time.listDay(office.getDateFormat(office.date));
	},
	
	listDay:function(date) {
		$("div.list div.timeItem").remove();
		$.getJSON("/service/office/time/list",
				{
				'date':date,
				'refresh':new Date().getTime()
				},
				function(json) {
					for ( var i = 0; i < json.length; i++) {
						office.time.addUITime(json[i]);
					}
					$('#addTimeDiv').fadeOut(300);
					office.time.updateTime();
				}
		);
		$('span.flipPageBar span.currentDaySpan').html(office.getDateFormat(office.date));
	},
	
	
	addUITime: function(o) {
		var timed = $('div.timeTemplate').clone();
		$('#times div.list').prepend(timed);
		
		timed.removeClass('timeTemplate').addClass("timeItem");
		timed.data("timedata", o);
		
		timed.find('div.timeOper a').attr("id", o.id);
		if (o.laststart!=0) {
			$('#times div.running').removeClass("running").addClass("pending");
			timed.addClass("running");
			timed.find('div.timeOper span').html(office.time.formatDura(o.dura + (new Date().getTime()-o.laststart)));
		} else {
			timed.addClass("pending");
			timed.find('div.timeOper span').html(office.time.formatDura(o.dura));
		}
		
		timed.find('div.timeStatics span.timeStart').html(office.time.formatHour(o.created));
		timed.find('div.timeDesc').html(o.desc);
		
		timed.fadeIn(300);
	},
	
	showAddTime:function() {
		$('#addTimeDiv').fadeIn(300);
	},
	hideAddTime:function() {
		$('#addTimeDiv').fadeOut(300);
	},
	add:function() {
		var desc = $('#newtime').val();
		$('#newtime').val('');
		$.post("/service/office/time/add", 
				{"desc":desc},
				function(data) {
					office.time.addUITime(jQuery.parseJSON(data));
				});
	},
	
	stopItem: function() {
		$.post("/service/office/time/stop", 
				null,
				function(data) {
					$("#times div.running").removeClass("running").addClass("pending");
				}
		);
	},



	startItem:function(id) {
		$.post("/service/office/time/start", 
				{"id":id},
				function(data) {
					$("#times div.running").removeClass("running").addClass("pending");
					
					jQuery.each($("#times div.timeItem"),
							function() {
								var timedata = $(this).data("timedata");
								if (timedata==null) return;
								
								if (timedata.id==id) {
									$(this).addClass("running").removeClass("pending");
								}
							}
					);
				}
		);
	},
	updateTime:function() {
		var total = 0;
		
		jQuery.each($("div.timeItem"),
			function() {
				var timedata = $(this).data("timedata");
				if (timedata==null) return;
				
				total += timedata.dura;
				if ($(this).hasClass("running")) {
					$(this).find('div.timeOper span').html(office.time.formatDura(timedata.dura + (new Date().getTime()-timedata.laststart)));
					total += (new Date().getTime()-timedata.laststart);
				}
			}
		 );
		$('div.pagebar div.summary').html("总计:" + office.time.formatDura(total));
		setTimeout('office.time.updateTime()', 60*1000);
	},

	formatDura:function(mill) {
		var d3 = new Date(parseInt(mill));
		return ((d3.getDate()-1)*24 + (d3.getHours()-8)) + ":" 
		+ ((d3.getMinutes()<10)?("0"+d3.getMinutes()):d3.getMinutes()); 
	},
	
	formatHour:function (mill) {
		var t = new Date(mill);
		return t.getHours() + ":" +  ((t.getMinutes()<10)?("0"+t.getMinutes()):t.getMinutes());
	},

	
	other:null
};
