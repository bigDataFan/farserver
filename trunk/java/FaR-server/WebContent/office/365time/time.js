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

office.switchView = function(v) {
	$('div.pages div.views').hide();
	$(v).show();
	$('div.pagebar div.back').show();
	$('div.pagebar div.addItem').hide();
};

office.switchBack = function() {
	$('div.pages div.views').hide();
	$('div.pages div.list').show();
	$('div.pagebar div.back').hide();
	$('div.pagebar div.addItem').show();
},


office.today = function() {
	office.date = new Date();
	if (office.currentTab!=null) {
		office.currentTab.load();
	}
};

office.getDateFormat = function(dd) {
	return dd.getFullYear() + "-" + (dd.getMonth()+1) + "-" + dd.getDate();
},


office.currentTab = null;

office.currentUser = null;

office.time = {
	load:function() {
		office.currentTab = office.time;
		
		$('div.running div.timeOper a').live('click', function(data) {
			office.time.stopItem();
		});
		$('div.pending div.timeOper a').live('click', function(data) {
			office.time.startItem($(this).attr('id'));
		});
		$('div.timeStatics a.details').live('click', function(data) {
			office.time.itemDetailView($(this).parent().parent().data("timedata"));
		});
		
		$.getJSON("/service/authority/current", null, 
				function(data) {
					office.currentUser = data.userName;
					if (data.userName.indexOf('guest.')>-1) {
						//匿名用户
						$('div.pleaseLogin').show();
						$('div.helloUser').hide();
					} else {
						$('div.pleaseLogin').hide();
						$('div.helloUser').html('您好 ' + data.userName);
						$('div.helloUser').show();
					}
				}
		);
		
		$.getJSON("/service/office/time/info", 
				null,
				function(data){
					$('#yesterdayTime').html(office.time.formatDura(data.yesterday));
					$('#weekTime').html(office.time.formatDura(data.week));
				}
		);
		office.time.listDay(office.getDateFormat(office.date));
	},
	
	listDay:function(date) {
		$("div.timeItem").remove();
		$.getJSON("/service/office/time/list",
				{
				'date':date,
				'refresh':new Date().getTime()
				},
				function(json) {
					var hasItem = false;
					for ( var i = 0; i < json.length; i++) {
						//office.date = new Date(json[i].now);
						hasItem = true;
						office.time.addUITime(json[i]);
					}
					if (!hasItem) {
						$('#emptyinfo').show();
					} else {
						$('#emptyinfo').hide();
					}
					
					$('#addTimeDiv').fadeOut(300);
					if (!office.time.schedued) {
						office.time.updateTime();
						office.time.schedued = true;
					}
				}
		);
		//$('div.flipPageBar span.currentDaySpan').html(office.getDateFormat(office.date));
	},
	schedued:false,
	
	
	addUITime: function(o) {
		var timed = $('div.timeTemplate').clone();
		$('#content div.list').append(timed);
		
		timed.removeClass('timeTemplate').addClass("timeItem");
		timed.data("timedata", o);
		
		timed.find('div.timeOper a').attr("id", o.id);
		var dura = 0;
		
		
		if (o.laststart!=0) {
			$('div.running').removeClass("running").addClass("pending");
			timed.addClass("running");
			dura = o.dura + (o.now-o.laststart);
		} else {
			timed.addClass("pending");
			dura = o.dura;
		}
		timed.find('div.timeOper span').html(office.time.formatDura(dura));
		timed.find('div.timeStatics span.warning').hide();
		if (o.autostop!=null && o.autostop!=0 && dura>o.autostop*60*1000) {
			timed.find('div.timeStatics span.warning').show();
		}
		
		timed.find('div.timeStatics span.timeStart').html(office.time.formatHour(o.created));
		timed.find('div.timeStatics span.timePending').html((o.checks==null)?0:o.checks.length);
		timed.find('div.timeDesc').html(o.desc);
		
		timed.fadeIn(300);
	},
	
	itemDetailView:function(data) {
		office.time.currentEdit = data;
		$('#editTime').val(data.desc);
		$('#autoStop').val((data.autostop==null)?"0":data.autostop);
		
		if (office.currentUser.indexOf("@weibo.com>0")) {
			$('div.sharetosina').show();
		}
		office.switchView('div.details');
	},
	
	sinaShareMessage:function() {
		$.post("/service/sina/update", 
				{'msg':office.time.currentEdit.desc},
				function(data) {
					if (data==200) {
						alert("共享到微博成果");
					} else if (data==400) {
						alert("您以发表了这个消息");
					} else {
						alert("请检查您的用户名是否是  @weibo.com");
					}
				});
	},
	
	currentEdit:null,
	
	updateItem: function () {
		if (office.time.currentEdit!=null) {
			$.post("/service/office/time/update", 
					{
						"id":office.time.currentEdit.id,
						"desc": $('#editTime').val(),
						"autostop": $('#autoStop').val()
					},
					function(data) {
						//office.switchBack();
						$('#itemedit').hide();
						office.time.load();
					}
			);
		} else {
			office.time.add($('#editTime').val(), $('#autoStop').val());
		}
	},
	
	removeItem:function() {
		if (office.time.currentEdit!=null) {
			$.post("/service/office/time/delete", 
					{
						"id":office.time.currentEdit.id
					},
					function(data) {
						//office.switchBack();
						$('#itemedit').hide();
						office.time.load();
					}
			);
		}
	},
	
	showAddTime:function() {
		$('#emptyinfo').hide();
		$('#itemedit').slideDown('fast');
		//$('#addTimeDiv').fadeIn(300);
	},
	hideAddTime:function() {
		$('#addTimeDiv').fadeOut(300);
	},
	add:function(desc, autostop) {
		$.post("/service/office/time/add", 
				{
					"desc":desc,
					"autostop": autostop
				},
				function(data) {
					office.time.addUITime(jQuery.parseJSON(data));
					$('#itemedit').hide();
				});
	},
	
	stopItem: function() {
		$.post("/service/office/time/stop", 
				null,
				function(data) {
					//将  中断x次部分的数字更新
			   		$("div.running div.timeStatics span.timePending").each(function() {
			   			$(this).html(parseInt($(this).html()) + 1);
			   		});
			   		
					$("div.running").removeClass("running").addClass("pending");
				}
		);
	},

	startItem:function(id) {
		$.post("/service/office/time/start", 
				{"id":id},
				function(data) {
					//将  中断x次部分的数字更新
					$("div.running div.timeStatics span.timePending").each(function() {
			   			$(this).html(parseInt($(this).html()) + 1);
			   		});
					
					$("div.running").removeClass("running").addClass("pending");
			   		

					jQuery.each($("div.timeItem"),
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
				
				if ($(this).hasClass("running")) {
					var duraString = $(this).find('div.timeOper span').html();
					var duraTime = office.time.formatedToMill(duraString) + 60*1000;
					
					if (timedata.autostop!=null && timedata.autostop!=0 && duraTime>timedata.autostop*60*1000) {
						$(this).find('div.timeStatics span.warning').show();
					}
					
					$(this).find('div.timeOper span').html(office.time.formatDura(duraTime));
					total += duraTime;
				} else {
					total += timedata.dura;
				}
			}
		 );
		$('div.nav div.total').html(office.time.formatDura(total));
		setTimeout('office.time.updateTime()', 60*1000);
	},
	
	hideEdit: function() {
		$('#itemedit').hide();
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
	
	formatedToMill: function(formated) {
		var sr = formated.split(":");
		return parseInt(sr[0])*60*60*1000 + parseInt(sr[1].charAt(0)=='0'?sr[1].charAt(1):sr[1])*60*1000;
	},

	
	other:null
};
