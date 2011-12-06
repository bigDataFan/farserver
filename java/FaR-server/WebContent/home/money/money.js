var groupdb;
var incomedb;
var categories;

var CAT_STRING = '{"children":[{"name":"家居日常","children":[{"name":"米面粮油"},{"name":"蔬菜水果"},{"name":"厨卫用品"},{"name":"衣服鞋帽"},{"name":"小吃零食"},{"name":"外出就餐"}]},{"name":"固定开销","children":[{"name":"房租物业"},{"name":"水电煤气"},{"name":"通讯费用"},{"name":"交通费用"}]},{"name":"文体活动","children":[{"name":"旅游"},{"name":"体育健身"}]}]}';

var currentUser;

$(document).ready(function(){
	
	currentUser = $.cookie("365user");  
	groupdb = new TAFFY();
	incomedb = new TAFFY();
	dbreg["groupdb"] = groupdb;
	dbreg["incomedb"] = incomedb;
	if (!isIE6()) {
		groupdb.store(currentUser + ".moneygroup");
		incomedb.store(currentUser + ".income");
	}
	$('#groupdbsize').html(groupdb().count());
	$('#incomedbsize').html(incomedb().count());
	
	initCategory();
	initStaticUI();
	$.getJSON("/service/db/config", {"r":new Date().getTime(),"app":"money"}, 
			function(data) {
				currentUser = data.user;
				if (currentUser.indexOf("guest.")==-1) {
					$('#loginLink').hide();
					$('#userInfo span.name').html(currentUser);
					$('#userInfo').show();
				}
				$('#networkInfo').html('您已经连接到服务器');
				
				synchronize(groupdb, 'groupdb', currentUser);
				synchronize(incomedb, 'incomedb', currentUser);
				
				if (data.category) {
					categories = JSON.parse(data.category.value);
					if (window.localStorage!=null) {
						window.localStorage.setItem(currentUser+".category", data.category.value);
					}
				} 
			}
		);
});

function initStaticUI() {
	layout.pushCurrent($('#toplist'), $('#dashboard'));
	$( "input.choosedate" ).datepicker({
		autoSize: false,
		dateFormat: 'yy-mm-dd' ,
		monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		showWeek: true
	});
	
	$('select').change(function(data){
		selectSwitch($(this));
	});
	initDashBoard();
}

function initDashBoard() {
	var day3 = new Date(new Date().getTime()-3*24*60*60*1000);
	var todayend = new Date(); todayend.setHours(23, 59, 59);
	
	var monthd = new Date(); monthd.setDate(1); monthd.setHours(0, 0, 0);
	
	var day3qry = groupdb({"time_millsecond":{gt :day3.getTime(), lt: todayend.getTime()}});
	var monthqry = groupdb({"time_millsecond":{gt :monthd.getTime()}});
	
	$('#recent3day').html(day3qry.sum("total"));
	$('#recent3daycount').html(day3qry.count());
	$('#recentmonth').html(monthqry.sum("total"));
	$('#recentmonthcount').html(monthqry.count());
	$('#outcometotalcount').html(groupdb().count());
	
	var d1 = new Date().getTime() - 30*24*60*60*1000;
	var d2 = new Date().getTime();
	drawSomeDaysLine(d1, d2, 'recent30daygraph');
}


var currentdb = null;
var currentLoaded = 0;

function navOutComeClick() {
	currentdb = groupdb;
	layout.pushCurrent($('#detailList'), $('#addOutComeForm'));
	displayCurrentDB();
}

function navInComeClick() {
	currentdb = incomedb;
	layout.pushCurrent($('#detailList'), $('#addInComeForm'));
	displayCurrentDB();
}

function navReportClick() {
	layout.pushCurrent($('#reportList'), $('#report'));
	var d = new Date();
	$('select[name="generalyear"]').val(d.getFullYear());
	$('select[name="generalmonth"]').val(d.getMonth()+1);
	
	$('#report div.reports').hide();
}

function navDashboardClick() {
	layout.pushCurrent($('#toplist'), $('#dashboard'));
	initDashBoard();
}


function displayCurrentDB() {
	$('div.emptyInfo').show();
	$('#detailList div.item').remove();
	formReset(true);
	currentdb().order("time").start(0).limit(10).each(
			function(record,recordnumber) {
				if (!record._deleted) {
					uiAddLeftItem(record);
				}
			}
	);
	currentLoaded  = 10;
	if (currentdb().count()>currentLoaded) {
		$('div.moreRecord').show();
	} else {
		$('div.moreRecord').hide();
	}
}



function showMore() {
	currentdb().start(currentLoaded).limit(10).each(
			function(record, recordernumber) {
				uiAddLeftItem(record);
			}
	);
	currentLoaded +=10;
	if (currentdb().count()<currentLoaded) {
		$('div.moreRecord').hide();
	}
}


function drawSomeDaysLine(dateStart, dateEnd, container, size) {
	var nowTime = dateStart;
	var totalDays =Math.floor( (dateEnd-dateStart)/(24*60*60*1000));
	var i = 0;
	var x = "";
	var y = "";
	var max = 0;
	chxl = "0:";
	while (nowTime < dateEnd) {
		var time = new Date(nowTime);
		var dtext = time.format("yyyy-mm-dd");
		var total = groupdb({time:dtext}).sum("total");
		if (total>max) max =total;
		x += i + ",";
		y += total + ",";
		nowTime += 24*60*60*1000;
		i++;
		if (i%5==0) {
			chxl += "|" + time.format('mm-dd');
		}
	}
	x = x.substring(0, x.length-1);
	y = y.substring(0, y.length-1);
	$('#' + container).attr('src', 'http://chart.googleapis.com/chart?cht=lxy&chs=' + ((size==null)?"450x200":size) 
			+ '&chd=t:' + x + '|' +  y 
			+ '&chco=3072F3&chdl=按日对比&chxt=x,y&chxr=0,0,' + totalDays + '|1,0,' + max + '&chg=10,20&chds=0,' + totalDays +',0,' + max
			+ '&chxl=' + chxl + "|");
}

function analyzeMonth() {
	var year = parseInt($('select[name="generalyear"]').val());
	var month = parseInt($('select[name="generalmonth"]').val()) -1;
	$('#generalReport').show();
	//$('#generalReport div.title div.info').html(year + "年" + (month+1) + "月支出账目");

	var reportTable = $('<table cellpadding="0" cellspacing="0" border="0" class="report"><tbody>' 
			+ '<tr><th width="30px">序号</th><th width="40px">时间</th><th >支出说明</th><th width="100px">分类</th><th width="80px">&nbsp;</th><th width="80px">支出方式</th><th width="30px">金额</th></tr></tbody></table>');
	var monthd = new Date(year, month, 1); monthd.setHours(0, 0, 0);
	var nextmonthd = new Date(year, month, 31); nextmonthd.setHours(23, 59, 59);
	var monthqry = groupdb({"time_millsecond":{gt :monthd.getTime(), lt: nextmonthd.getTime()}});
	
	var odd = true;
	monthqry.order("time_millsecond").each(
			function(record, recordnumber) {
				var tr = $('<tr><td>' + recordnumber + '</td>'
						+ '<td>' + record.time + '</td>' 
						+ '<td>' + record.title + '</td>'
						+ '<td>' + record.category + '</td>'
						+ '<td>' + record.outtype + '</td>'
						+ '<td>' + record.outmethod + '</td>'
						+ '<td>' + record.total + '</td>'
						+ '</tr>');
				odd = !odd;
				if (odd) {
					tr.addClass('odd'); 
				} else {
					tr.addClass('even'); 
				}
				reportTable.append(tr);
			}
	);
	drawSomeDaysLine(monthd.getTime(), nextmonthd.getTime(), 'outcomeline', '650x300');
	$('#generalReport div.reportlist').append(reportTable);
}


function initCategory() {
	categories = JSON.parse(CAT_STRING);
	if (window.localStorage!=null) {
		if (window.localStorage.getItem(currentUser+".category")!=null) {
			categories = JSON.parse(window.localStorage.getItem(currentUser+".category"));
		} 
	}
	
	$('#navcat').click(
			function(data) {
				layout.pushCurrent($('#toplist'), $('#eidtCat'));
				$('#eidtCat ul.category li').remove();
				category.load($('#eidtCat ul.category'), categories, true);
			}
	);
	$('select.category').each(
			function(){
				category.fillSelect($(this), categories);
			}
	);
	//http.saveConfig(CAT_STRING);
}

var http = {
		saveConfig:function(cat) {
			$.post("/service/db/setconfig",
					{"app":"money", 'name':"category", "value": cat},
					function(){});
		}
};

//将支出每项加到总额中
calculateTotal = function() {
	var form = $('#addOutComeForm');
	var total = 0;
	
	var process = "";
	$('#multiitems li.cloned').each(
			function(){
				var li = $(this);
				if (!isNaN(li.find('input[name="cost"]').val())) {
					var val = parseFloat(li.find('input[name="cost"]').val());
					process += "+" + val ;
					total += val;
				}
			}
	);
	
	if(process.charAt(0)=='+') {
		process = "=" + process.substring(1);
	}
	$('#calculateTotalProcess').hide().html(process).fadeIn();
	$('#calculateTotalProcess').delay(2000).fadeOut();
	
	form.find('input[name="total"]').val(total);
};


function calculateTax() {
	if (!isNaN($('input[name="fullSalary"]').val())) {
		var fullvalue = parseInt($('input[name="fullSalary"]').val());
		var housingReserve = Math.floor(fullvalue * 0.12);
		var endowmentInsurance = Math.floor(fullvalue * 0.08);
		var medicalInsurance = Math.floor(fullvalue * 0.02);
		var jobInsurance = Math.floor(fullvalue * 0.002);
		var remains = fullvalue - housingReserve - endowmentInsurance - medicalInsurance - jobInsurance;
		var tax = getFloorTax(remains);
		
		$('input[name="housingReserve"]').val(housingReserve);
		$('input[name="endowmentInsurance"]').val(endowmentInsurance);
		$('input[name="medicalInsurance"]').val(medicalInsurance);
		$('input[name="jobInsurance"]').val(jobInsurance);
		$('input[name="personalTax"]').val(tax);
	}
}

uiSaveCategory = function() {
	var o = category.toJson($('#eidtCat ul.category'), {});
	categories = o;
	if (window.localStorage!=null) {
		window.localStorage.setItem(currentUser+".category", JSON.stringify(categories));
	} 
	http.saveConfig( JSON.stringify(categories));
};

var category = {
		fillSelect:function(sel, json) {
			var children = json.children;
			if (children!=null) {
				for ( var i = 0; i < children.length; i++) {
					var o = children[i];
					
					if (o.children) {
						var group = $('<optgroup></optgroup>');
						sel.append(group);
						group.attr('label', children[i].name);
						category.fillSelect(group, o);
					} else {
						var option = $('<option></option>');
						sel.append(option);
						option.attr('label', children[i].name);
						option.html(children[i].name);
					}
				}
			}
		},
		
		load: function(ul, json, t) {
			var children = json.children;
			if (children!=null) {
				for ( var i = 0; i < children.length; i++) {
					var li = $('<li></li>');
					ul.append(li);
					category.drawLi(li, children[i].name, t);
					if (t) {
						var cul = $('<ul></ul>');
						li.append(cul);
					}
					category.load(cul, children[i], false);
				}
			}
		},
		
		
		toJson: function(ul, o) {
			o.children = [];
			var lis = ul.children('li');
			for ( var i = 0; i < lis.length; i++) {
				var li = $(lis[i]);
				var b = {};
				b.name = li.data('v');
				var childul = li.children('ul');
				if (childul.length!=0) {
					b = category.toJson(childul, b);
				}
				o.children.push(b);
			}
			return o;
		},
		addRoot: function(ul) {
			category.showEdit(ul, true);
		},
		
		showEdit: function(p,c) {
			var n = $('<li><h3><input type="text" class="nname"><a href="javascript:void(0)">保存</a></h3></li>');
			$(p).append(n);
			
			n.find('a').click(function(data) {
				var li = $(this).parent().parent();
				category.editSave(li, c);
			});
		},
		
		drawLi: function(li, v, c)  {
			li.data('v',v);
			li.children('h3').remove();
			li.prepend('<h3>' + v + '<span class="oper"><a href="javascript:void(0)" class="edit">编辑</a><a href="javascript:void(0)" class="delete">删除</a> '
					+ (c?'<a href="javascript:void(0)" class="addchild">增加子类</a>':'') + '</span>' + '</h3>');
			if (c) {
				li.addClass('parent');
			} else {
				li.addClass('sub');
			}
			li.find('a.edit').click(
					function(data) {
						var h3 = $(this).parent().parent();
						v = h3.parent().data('v');
						h3.html('<input type="text" class="nname"><a href="javascript:void(0)">保存</a>');
						h3.find('input').val(v);
						
						h3.find('a').click(function(data) {
							var li = $(this).parent().parent();
							category.editSave(li, c);
						});
					}
			);

			li.find('a.delete').click(
					function(data) {
						var li = $(this).parent().parent().parent();
						li.remove();
					}
			);
			
			li.find('a.addchild').click(
					function(data) {
						var li = $(this).parent().parent().parent();
						var ul = li.find('ul');
						if (ul.length==0) {
							ul = $('<ul></ul>');
							li.append(ul);
						}
						category.showEdit(ul, false);
					}
			);
			
			li.children('h3').children('span').hide();
			li.hover(
					function(){
						$(this).children('h3').children('span').show();
					}, 
					function() {
						$(this).children('h3').children('span').hide();
					}
			);
			
		},
		editSave: function(li, c) {
			var v = li.find('input').val();
			category.drawLi(li, v, c);
		}
};