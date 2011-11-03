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
	$('div.pages div.views').slideUp('fast');
	$(v).slideDown('fast');
	$('div.pagebar div.back').slideDown('fast');
	$('div.pagebar div.addItem').slideUp('fast');
};

office.switchBack = function() {
	$('div.pages div.views').slideUp('fast');
	$('div.pages div.list').slideDown('fast');
	$('div.pagebar div.back').slideUp('fast');
	$('div.pagebar div.addItem').slideDown('fast');
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
		/*
		$.getJSON("/service/authority/current", {"r":new Date().getTime()}, 
				function(data) {
					office.currentUser = data.userName;
					if (data.userName.indexOf('guest.')>-1) {
						//匿名用户
						$('#loginLink').show();
						$('#helloLink').hide();
					} else if (data.userName.indexOf('3rd.')>-1) {
						$('#thirdPartyLink').show();
						$('#loginLink').hide();
						$('#helloLink').hide();
					} else {
						$('#loginLink').hide();
						$('#helloLink span').html('您好 ' + data.userName);
						$('#helloLink').show();
					}
				}
		);
		*/
		$.getJSON("/service/office/time/info", 
				{"r":new Date().getTime()},
				function(data){
					$('#yesterdayTime').html(office.time.formatDura(data.yesterday));
					$('#weekTime').html(office.time.formatDura(data.week));
					$('#totalTime').html(office.time.formatDura(data.total));
					$('#itemCount').html(data.count);
				}
		);
		
		
		var vNum = Math.random();
		vNum = Math.round(vNum*10);
		
		$('#hintinfo p').html(office.time.hitKeys[vNum] + "<br>" + office.time.hitInfos[vNum]);
		
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
						$('#hintinfo').show();
					} else {
						$('#hintinfo').hide();
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
		$('#timelist').append(timed);
		
		timed.removeClass('timeTemplate').addClass("timeItem");
		timed.data("timedata", o);
		
		timed.css("width", $('#timelist').css("width"));
		
		timed.find('div.timeOper a').attr("id", o.id);
		var dura = 0;
		var autostop = 0;
		
		if (o.autostop!=null) {
			autostop = parseFloat(o.autostop) * 60 * 60 * 1000;
		}
		
		
		if (o.laststart!=0) {  //表示正在运行的任务
			$('div.running').removeClass("running").addClass("pending");
			timed.addClass("running");
			dura = o.dura + (o.now-o.laststart);
		} else { 
			timed.addClass("pending");
			dura = o.dura;
		}
		timed.find('div.timeOper span').html(office.time.formatDura(dura));
		
		timed.find('div.timeStatics span.warning').hide();
		if (autostop!=0 && dura>=autostop) {
			timed.find('div.timeStatics span.warning').show();
			timed.removeClass("running").removeClass("pending").addClass("ended");
			
		}
		
		timed.find('div.timeStatics span.timeStart').html(office.time.formatHour(o.created));
		timed.find('div.timeStatics span.timePending').html((o.checks==null)?0:o.checks.length);
		timed.find('div.timeDesc').html(o.desc);
		
		timed.fadeIn('fast');
	},
	
	itemDetailView:function(data) {
		office.time.currentEdit = data;
		$('#editTime').val(data.desc);
		$('#autoStop').val((data.autostop==null)?"0":data.autostop);
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
						office.time.hideEdit();
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
						office.time.currentEdit = null;
						office.time.hideEdit();
						office.time.load();
					}
			);
		}
	},
	
	showAddTime:function() {
		$('#hintinfo').slideUp('fast');
		$('#itemedit').slideDown('fast');
		//$('#addTimeDiv').fadeIn(300);
	},
	hideAddTime:function() {
		$('#addTimeDiv').fadeOut(300);
	},
	
	adding: false,
	add:function(desc, autostop) {
		if (office.time.adding) return;
		
		office.time.adding = true;
		$.post("/service/office/time/add", 
				{
					"desc":desc,
					"autostop": autostop
				},
				function(data) {
					office.time.addUITime(jQuery.parseJSON(data));
					office.time.hideEdit();
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
					var autostop = 0;
					if (timedata.autostop!=null) {
						autostop = parseFloat(timedata.autostop) * 60 * 60 * 1000;
					}
					
					if (autostop!=0 && duraTime>=autostop) {
						$(this).find('div.timeStatics span.warning').show();
						$(this).removeClass("running").removeClass("pending").addClass("ended");
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
		$('#itemedit').slideUp('fast');
		office.time.adding = false;
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
	
	hideInfo: function() {
		$('#hintinfo').slideUp('fast');
	},
	
	hitKeys:[
	     '时间小贴士一.设立明确的目标',
	     '时间小贴士二.学会列清单',
	     '时间小贴士三.做好“时间日志”',
	     '时间小贴士四.制订有效的计划。',
	     '时间小贴士五.遵循20:80定律',
	     '时间小贴士六.安排“不被干扰”时间',
	     '时间小贴士七.确立个人的价值观',
	     '时间小贴士八.严格规定完成期限',
	     '时间小贴士九.学会充分授权',
	     '时间小贴士十.同-类的事情最好一次做完'
	],
	         
	hitInfos:[
	          "时间管理的目的是让你在最短时间内实现更多你想要实现的目标。把手头4到10个目标写出来，找出一个核心目标，并依次排列重要性，然后依照你的目标设定详细的计划，并依照计划进行。",
	          "把自己所要做的每一件事情都写下来，列一张总清单，这样做能让你随时都明确自己手头上的任务。在列好清单的基础上进行目标切割。",
	          "你花了多少时间在哪些事情，把它详细地，记录下来，每天从刷牙开始，洗澡，早上穿衣花了多少时间，早上搭车的时间，平上出去拜访客户的时间，把每天花的时间一一记录下来，做了哪些事，你会发现浪费了哪些时间。当你找到浪费时间的根源，你才有办法改变。",
	          "绝大多数难题都是由未经认真思考虑的行动引起的。在制订有效的计划中每花费1小时，在实施计划中就可能节省3-4小时，并会得到更好的结果。如果你没有认真作计划，那么实际上你正计划着失败。",
	          "用你80%的时间来做20%最重要的事情。生活中肯定会有一些突发困扰和迫不及待要解决的问题，如果你发现自己天天都在处理这些事情，那表示你的时间管理并不理想。一定要了解，对你来说，哪些事情是最重要的，是最有生产力的。",
	          "假如你每天能有一个小时完全不受任何人干扰地思考一些事情，或是做一些你认为最重要的事情，这一个小时可以抵过你一天的工作效率，甚至可能比三天的工作效率还要好。",
	          "假如价值观不明确，就很难知道什么对你是最重要的，当你的价值观不明确时，就无法做到合理地分配时间。时间管理的重点不在管理时间，而在于如何分配时间。你永远没有时间做每件事，但永远有时间做对你来说最重要的事。",
	          "巴金森(C.Noarthcote Parkinson)在其所著的《巴金森法则》中写下这段话“你有多少时间完成工作，工作就会自动变成需要那么多时间。”如果你有一整天的时间可以做某项工作，你就会花一天的时间去做它。而如果你只有一小时的时间可以做这项工作，你就会更迅速有效地在一小时内做完它。",
	          "列出你目前生活中所有觉得可以授权的事情，把它们写下来，找适当的人来授权。",
	          "假如你在做纸上作业，那段时间都做纸上作业；假如你是在思考，用一段时间只作思考；打电话的话，最好把电话累积到某一时间一次把它打完。"
	],
	
	other:null
};
