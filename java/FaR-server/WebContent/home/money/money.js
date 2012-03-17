var groupdb;
var incomedb;
var categories;
var dbinit = {};

var connected = false;

var CAT_STRING = '{"children":[{"name":"家居日常","children":[{"name":"米面粮油"},{"name":"蔬菜水果"},{"name":"厨卫用品"},{"name":"衣服鞋帽"},{"name":"小吃零食"},{"name":"外出就餐"}]},{"name":"固定开销","children":[{"name":"房租物业"},{"name":"水电煤气"},{"name":"通讯费用"},{"name":"交通费用"}]},{"name":"文体活动","children":[{"name":"旅游"},{"name":"体育健身"}]}]}';

var currentUser;

$(document).ready(function(){
	currentUser = $.cookie("365user");  
	$('#logoutLink').hide();
	if (currentUser!=null && currentUser.indexOf("guest.")==-1) {
		$('#loginLink').hide();
		$('#currentUserName').html('您好 ' + currentUser);
	} else {
		$('#currentUserName').html('您好  您未登录<font color="red">(当更换机器或清理浏览数据后，记账信息会丢失)</font>');
	}
	groupdb = new TAFFY();
	incomedb = new TAFFY();
	dbreg["groupdb"] = groupdb;
	dbreg["incomedb"] = incomedb;
	dbinit["groupdb"] = false;
	dbinit["incomedb"] = false;
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
				connected = true;
				currentUser = data.user;
				if (currentUser.indexOf("guest.")==-1) {
					$('#loginLink').hide();
					$('#currentUserName').html('您好 ' + currentUser);
					$('#logoutLink').show();
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
				
				$(document).append('<script type="text/javascript" src="http://v1.jiathis.com/code/jia.js?uid=ever365money" charset="utf-8"></script>');
			}
		);
});

function initStaticUI() {
	layout.dividerloc = 260;
	layout.pushCurrent($('#toplist'), $('#dashboard'));
	$('select').change(function(data){
		selectSwitch($(this));
	});
	$("input.choosedate").Zebra_DatePicker({});
}

function initDashBoard() {
	var day3 = new Date(new Date().getTime()-3*24*60*60*1000);
	var todayend = new Date(); todayend.setHours(23, 59, 59);
	
	var monthd = new Date(); monthd.setDate(1); monthd.setHours(0, 0, 0);
	
	var day3qry = groupdb({"time_millsecond":{gt :day3.getTime(), lt: todayend.getTime()}});
	var monthqry = groupdb({"time_millsecond":{gt :monthd.getTime()}});
	
	$('#recent3day').html(roundTo(day3qry.sum("total"), 10));
	$('#recent3daycount').html(day3qry.count());
	$('#recentmonth').html(roundTo(monthqry.sum("total"),10));
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
	$('select.year').val(d.getFullYear());
	$('select.month').val(d.getMonth()+1);
	$('#report div.reports').hide();
}

function navDashboardClick() {
	layout.pushCurrent($('#toplist'), $('#dashboard'));
	initDashBoard();
}

function navCategoryClick() {
	layout.pushCurrent($('#toplist'), $('#eidtCat'));
	$('#eidtCat ul.category li').remove();
	category.load($('#eidtCat ul.category'), categories, true);
}

function displayCurrentDB() {
	$('div.emptyInfo').show();
	$('#detailList div.item').remove();
	formReset(true);
	currentdb().order("time_millsecond desc").start(0).limit(10).each(
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
	currentdb().order("time_millsecond desc").start(currentLoaded).limit(10).each(
			function(record, recordernumber) {
				uiAddLeftItem(record);
			}
	);
	currentLoaded +=10;
	if (currentdb().count()<currentLoaded) {
		$('div.moreRecord').hide();
	}
}

function drawCategoryPie(dateStart, dateEnd, container, size) {
	
	var categories = {};
	
	groupdb({"time_millsecond":{gt :dateStart, lt: dateEnd}}).each(
			function(record, recordnumber) {
				if (record.category) {
					if (categories[record.category] == null) {
						categories[record.category] = parseInt(record.total);
					} else {
						categories[record.category] += parseInt(record.total);
					}
				} else {
					if (record.items && record.items.length>0) {
						for (var i=0; i<record.items.length; i++) {
							if (categories[record.items[i].category] == null) {
								categories[record.items[i].category] = parseInt(record.items[i].cost);
							} else {
								categories[record.items[i].category] += parseInt(record.items[i].cost);
							}
						}
					} else {
						if (categories['额外支出']==null) {
							categories['额外支出'] = parseInt(record.total);
						} else {
							categories['额外支出'] += parseInt(record.total);
						}
					}
				}
			}
	);
	var ts = "";
	var vs = "";
	for ( var key in categories) {
		ts += categories[key] + ",";
		vs += key + "|";
	}
	ts = ts.substring(0, ts.length-1);
	vs = vs.substring(0, vs.length-1);
	var url = 'http://chart.googleapis.com/chart?cht=p' 
		+ '&chd=t:' + ts 
		+ "&chds=a"
		+ '&chl=' + vs 
		+ '&chtt=支出按分类比例'
		+ '&chs=' + size;
	$('#' + container).attr('src', encodeURI(url)); 
	
	$('#jiathisshareOutComePie').show();
	$('#jiathisshareOutComePie').mouseover(function() {
		setShare("看吧，这是我最近消费支出的分类" ,  url);
	});
	
			//+ '&chdl=10%C2%B0|40%C2%B0|50%C2%B0|80%C2%B0');
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
	var curl = 'http://chart.googleapis.com/chart?cht=lxy&chs=' + ((size==null)?"450x200":size) 
	+ '&chd=t:' + x + '|' +  y 
	+ '&chco=3072F3&chxt=x,y&chxr=0,0,' + totalDays + '|1,0,' + max + '&chg=10,20&chds=0,' + totalDays +',0,' + max
	+ '&chxl=' + chxl + "|"  //&chdl=支出曲线
	+ '&chtt=按日支出曲线';
	$('#' + container).attr('src', curl);
	
	$('#jiathisshareOutComeLine').show();
	$('#jiathisshareOutComeLine').mouseover(function() {
		setShare("大家为 我的努力记账鼓掌吧，这是我的消费支出曲线" ,  curl);
	});
	
}

function analyzeMonth() {
	layout.switchRightFull();
	$('div.reports').hide();
	var year = parseInt($('select[name="generalyear"]').val());
	var month = parseInt($('select[name="generalmonth"]').val()) -1;
	$('#generalReport').show();
	$('#generalReport div.reportlist table').remove();
	var reportTable = $('<table width="740px" cellpadding="0" cellspacing="0" border="0" class="report"><tbody>' 
			+ '<tr><th width="60px">时间</th><th>支出说明</th><th width="80px">分类</th><th width="50px">支出项</th><th width="80px">支出方式</th><th width="50px">金额</th></tr></tbody></table>');
	var monthd = new Date(year, month, 1); monthd.setHours(0, 0, 0);
	var nextmonthd = new Date(year, month, 31); nextmonthd.setHours(23, 59, 59);
	var monthqry = groupdb({"time_millsecond":{gt :monthd.getTime(), lt: nextmonthd.getTime()}});
	
	var odd = true;
	monthqry.order("time_millsecond").each(
			function(record, recordnumber) {
				
				var cat = record.category;
				if (cat==null) {
					if (record.items!=null) {
						cat = "多个分类";
					} else {
						cat = "<font color='red'>额外支出</font>";
					}
				}
				var tr = $('<tr>'
						+ '<td>' + record.time + '</td>' 
						+ '<td>' + record.title + '</td>'
						+ '<td>' + cat + '</td>'
						+ '<td>' + ((record.items==null)?1:record.items.length) + '</td>'
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
	$('#generalReport div.reportlist').append(reportTable);
	reportTable.wrap("<div/>");
	drawSomeDaysLine(monthd.getTime(), nextmonthd.getTime(), 'outcomeline', '470x250');
	drawCategoryPie(monthd.getTime(), nextmonthd.getTime(), 'outcomepie', '350x250');
}

function analyzeMonthLine() {
	$('div.reports').hide();
	$('#monthReport').show();
	var year = parseInt($('select[name="monthlineselect"]').val());
	var xr = [];
	var months = [];
	
	for ( var i = 0; i < 12; i++) {
		months.push(new Date(year, i, 1));
		xr.push(i+1);
	}
	months.push(new Date(year, 12,31));
	var monthArray = [];
	var max = 0;
	for ( var i = 0; i < 12; i++) {
		var total = groupdb({"time_millsecond":{gt :months[i].getTime(), lt: months[i+1].getTime()}}).sum("total");
		if (total>max) max = total;
		monthArray.push(total);
	}
	
	var url = 'http://chart.googleapis.com/chart?cht=bvs&chs=450x300&chg=10,20'  
		+ '&chd=t:'  +  monthArray
		+ '&chds=0,' + max 
		+ '&chxr=0,1,12|1,0,' + max
		+ '&chco=3072F3&chxt=x,y' 
		+ '&chtt=' + year + '年每月支出';
	
	$('#outcomemonthline').attr('src', encodeURI(url));
	//outcomemonthline
}

function analyzeMonthIncomeLine() {
	$('div.reports').hide();
	$('#monthReport').show();
	var year = parseInt($('select[name="monthlineselectincome"]').val());
	var xr = [];
	var months = [];
	
	for ( var i = 0; i < 12; i++) {
		months.push(new Date(year, i, 1));
		xr.push(i+1);
	}
	months.push(new Date(year, 12,31));
	var monthArray = [];
	var max = 0;
	for ( var i = 0; i < 12; i++) {
		var total = incomedb({"time_millsecond":{gt :months[i].getTime(), lt: months[i+1].getTime()}}).sum("total");
		if (total>max) max = total;
		monthArray.push(total);
	}
	//http://chart.googleapis.com/chart?cht=bvs&chs=650x300&chd=t:22,0,0,0,0,0,0,55,12,232,234,2225.2&chds=0,2230&chco=3072F3&chxt=x,y&chxr=0,1,12|1,0,2225&chg=10,20&chtt=2011%C4%EA%C3%BF%D4%C2%D3%AF%D3%E0
	var url = 'http://chart.googleapis.com/chart?cht=bvs&chs=450x300&chg=10,20'  
		+ '&chd=t:'  +  monthArray
		+ '&chds=0,' + max 
		+ '&chxr=0,1,12|1,0,' + max
		+ '&chco=3072F3&chxt=x,y' 
		+ '&chtt=' + year + '年每月收入';
	$('#outcomemonthline').attr('src', encodeURI(url));
}

function analyzeMonthRemainLine() {
	$('div.reports').hide();
	$('#monthReport').show();
	var year = parseInt($('select[name="monthlineselectremain"]').val());
	var xr = [];
	var months = [];
	
	for ( var i = 0; i < 12; i++) {
		months.push(new Date(year, i, 1));
		xr.push(i+1);
	}
	months.push(new Date(year, 12,31));
	var monthArray = [];
	var max = 0;
	var min = 0 ;
	for ( var i = 0; i < 12; i++) {
		var outcometotal = groupdb({"time_millsecond":{gt :months[i].getTime(), lt: months[i+1].getTime()}}).sum("total");
		var incometotal = incomedb({"time_millsecond":{gt :months[i].getTime(), lt: months[i+1].getTime()}}).sum("total");
		var total = incometotal - outcometotal;
		if (total>max) max = total;
		if (total<0 && total<min) min = total;
		monthArray.push(total);
	}
	
	var url = 'http://chart.googleapis.com/chart?cht=bvs&chs=450x300&chg=10,20'  
		+ '&chd=t:'  +  monthArray
		+ '&chds=' + min + ',' + max 
		+ '&chxr=0,1,12|1,' + min + ',' + max
		+ '&chco=3072F3&chxt=x,y' 
		+ '&chtt=' + year + '年每月盈余';
	
	$('#outcomemonthline').attr('src', encodeURI(url));
}

function testFill() {
	for ( var i = 0; i < 11; i++) {
		for ( var j = 0; j < 31; j++) {
			var data = {
					category: "分类" + Math.floor(Math.random()*11),
					created: new Date().getTime(),
					db: "groupdb",
					formid: "addOutComeForm",
					outmethod: "现金",
					outtype: "单笔支出",
					time : new Date(2011,i,j).format("yyyy-mm-dd"),
					time_millsecond: new Date(2011,i,j).getTime(),
					title: "支出的标题" + Math.floor(Math.random()*100),
					total: Math.floor(Math.random()*100),
					updated:new Date().getTime()
			};
			groupdb.insert(data);
		}
	}
}

function initCategory() {
	categories = JSON.parse(CAT_STRING);
	if (window.localStorage!=null) {
		if (window.localStorage.getItem(currentUser+".category")!=null) {
			categories = JSON.parse(window.localStorage.getItem(currentUser+".category"));
		} 
	}
	
	$('select.category').each(
			function(){
				//删除现有的
				$(this).find('optgroup').remove();
				$(this).find('option').remove();
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
					var valstr = li.find('input[name="cost"]').val();
					var val = parseFloat(valstr);
					if (!isNaN(val)) {
						process += "+" + val ;
						total += val;
					}
				}
			}
	);
	total = roundTo(total, 10);
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
	initCategory();
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



var ie6sync = false;
var syncinit = false;

var dbreg = {};
function resync() {
	for ( var key in dbreg) {
		dbreg[key]().remove();
		$.cookie(currentUser + "." + key + ".updated", 0);
		location.href = location.href;
	}
};



function synchronize(db, dbname, username) {
	//获取最近和服务器更新联系的时间
	var updated = $.cookie(username + "." + dbname + ".updated");
	if (updated==null) {
		updated = 0;
	} else {
		updated = parseInt(updated);
	}
	var currentTime = new Date().getTime();
	var newerString = db().filter({"updated":{'gt': updated}}).stringify();

	//IE6未同步的情况下
	if (!dbinit[dbname]) {
		updated = 0;
		newerString = "[]";
	}
	
	if (dbinit[dbname] && newerString=="[]") {
		return;
	}
	
	$.post("/service/db/sync",
			{
				'updated': updated,
				'db': dbname,
				'list': newerString
		    },  function(data) {
		    	
		    	if (!dbinit[dbname]) {
		    		db().remove();
		    	}
		    	
		    	var result = $.parseJSON(data);
		    	for ( var j = 0; j < result.updated.length; j++) {
		    		var record = result.updated[j];
		    		record.___id = null;
		    		
		    		if(record.___id && db(record.___id).count()>0) {//表明是其他客户端执行了更新操作
		    			
		    			db(record.___id).update(record);
		    		} else {
		    			db.insert(record);
		    		}
				}
		    	for ( var id in result.added) {  //表明本次请求新增的数据
		    		db(id).update({'_id': result.added[id]});
		    		$('#' + id).find('div.priority img').attr('src', "online_dot.png");
				}
		    	
		    	for (var j=0; j<result.deleted.length; j++) {
					db(result.deleted[j]).remove();
				}
		    	
		    	$.cookie(username + "." + dbname + ".updated", currentTime);
		    	
		    	$('#' + dbname + 'size').html(db().count());
		    	
		    	$('#networkInfo').html('您已经连接到服务器 最近更新时间'  + new Date(currentTime).format("h:MM TT"));
		    	dbinit[dbname] = true;
		    	
		    	if (dbname=="groupdb") {
		    		initDashBoard();
		    	}
		    	/*
		    	setTimeout(function(){
		    		synchronize(db, dbname, username)
		    	}, 10000);
		    	*/
		    }
	);
}





saveCurrentForm = function() {
	var form = $('div.form:visible');
	form.each(
			function(data) {
				var extracted = extractFormObject(form);
				extracted.updated = new Date().getTime();
				if (extracted.___id) {
					dbreg[extracted.db](extracted.___id).update(extracted);
				} else {
					dbreg[extracted.db].insert(extracted);
				}
				uiAddLeftItem(extracted, true);
			}
	);
	formReset(true);
	
	synchronize(groupdb, 'groupdb', currentUser);
	synchronize(incomedb, 'incomedb', currentUser);
	
};

function fillEditForm(form, data) {
	formReset(false);
	form.data("data", data);
	for ( var key in data) {
		if (jQuery.isArray(data[key])) { //添加数组类型的成员
			var div = form.find('div[name="' + key + '"]');
			div.show();
			var subul = div.find('ul');
			if (subul.length!=0) {
				subul.find('li.cloned').remove();
				$(data[key]).each(function() {
					uicloneSubitem(this);
				});
			} else {
				var subitem = data[key][0];
				for(var subkey in subitem) {
					div.find('.' + subkey).val(subitem[subkey]);
				}
			}
		} else {
			var field = form.find('*[name="' + key + '"]');
			if (field.length!=0) {
				field.parent().show();
				field.val(data[key]);
				if (field.attr("tagName")=="select") {
					selectSwitch(field);
				}
			}
		}
	}
}

function selectSwitch(select) {
	select.find('option[targetDiv]').each(
			function() {
				$('#' + $(this).attr("targetDiv")).hide();
			}
	);
	var selected = select.find("option:selected");
	if (selected.attr('targetDiv')!=null) {
		$('#' + selected.attr('targetDiv')).show();
	}
}



//复制一个支出项
function uicloneSubitem(o) {
	var template = $('li.forclone');
	if (template.length!=0) {
		var cloned = template.clone();
		cloned.removeClass('forclone').addClass('cloned').show();
		if (o) {
			for(var subkey in o) {
				cloned.find('*[name="' + subkey + '"]').val(o[subkey]);
			}
		}
		cloned.find('a.delete').click(
				function() {
					cloned.remove();
				}
		);
		template.parent().append(cloned);
	}
};



uiRemoveSelected = function() {
	$('#detailList div.checked').each(
			function() {
				if ($(this).hasClass("selected")) {
					formReset(true);
				}
				var data = $(this).data("data");
				if (data!=null) {
					data["_deleted"] = 1;
					data["updated"] = new Date().getTime();
					dbreg[data.db](data.___id).update(data);
					$(this).remove();
				}
			}
	);
	
	synchronize(groupdb, 'groupdb', currentUser);
	synchronize(incomedb, 'incomedb', currentUser);
	
};


function uiAddLeftItem(o, w) {
	var listcontainer = $('#detailList');
	listcontainer.find('div.emptyInfo').hide();
	var cloned = $('#' + o.___id);
	if (cloned.length==0) {
		cloned = $('div.taskItemTemplate').clone();
		cloned.hide();
		if (w) {
			listcontainer.prepend(cloned);
			cloned.fadeIn();
		} else {
			$('div.moreRecord').before(cloned);
		}
		//listcontainer.append(cloned);
		cloned.attr("id", o.___id);
	}
	bindObject(cloned, o);
}


function bindObject(div, o) {
	if (o.___id) {
		div.attr("id", o.___id);
	}
	
	div.removeClass('taskItemTemplate').addClass('item').show();
	$(div).data("data", o);
	$(div).find('.bind').each(
			function() {
				var bindTo = $(this).attr("bindTo");
				var maxLength = $(this).attr("max");
				if (maxLength!=null) {
					maxLength = parseInt(maxLength);
				} else {
					maxLength = 100;
				}
				if (bindTo) {
					var keys = bindTo.split(",");
					for ( var i = 0; i < keys.length; i++) {
						if (o[keys[i]]!=null) {
							var fullvalue = o[keys[i]];
							if (fullvalue.length>maxLength) {
								$(this).html(fullvalue.substring(0,maxLength) + "...");
							} else {
								$(this).html(fullvalue);
							}
						}
					}
				}
			}
	);
	$(div).click(
			function() {
				if (!$(this).hasClass("selected") && o.formid) {
					var targetForm = $('#'  + o.formid);
					$('div.selected').removeClass('selected');
					$(this).addClass("selected");
					fillEditForm(targetForm, o);
				}
			}
	);
	$(div).find('div.dotc').click(
			function(data) {
				var container = $(this).parent().parent();
				if (container.hasClass("checked")) {
					container.removeClass("checked");
				} else {
					container.addClass("checked");
				}
				
				if ($('div.checked').length>0) {
					$('#btn-save-outcome-remove').show();
				} else {
					$('#btn-save-outcome-remove').hide();
				}
			}
	);
	if (o._id) {
		$(div).find('div.priority img').attr('src', "online_dot.png");
	} else {
		$(div).find('div.priority img').attr('src', "status_offline.png");
	}
}

function formReset(switched) {
	var form = $('div.form');
	form.data('data', null);
	
	form.find('input, textarea').val('');
	
	form.find('select').each(
		function() {
			var def = $(this).find('option[default="1"]');
			if (def.length!=0) {
				$(this).val(def.html());
			}
		}
	);
	form.find('div.switched').hide();
	
	if (switched) { //表示新建一个表单
		$('div.selected').removeClass('selected');
		form.find('div.switched').each(function(data) {
			if ($(this).attr("default")=="1") {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
	}
}

function extractFormObject(form) {
	var o = {created:new Date().getTime()};
	if (form.data("data")) {
		o = form.data("data");
	}
	if (form.attr("id")) {
		o.formid = form.attr("id");
	}
	o.db = form.attr("db");
	
	form.find('div.label>input:visible').each(
			function(data) {
				var input = $(this);
				if (input.hasClass("choosedate")) {
					o[input.attr('name') + "_millsecond"] = getDate(input.val()).getTime();
				}
				
				if (input.hasClass("number")) {
					if (jQuery.isNumeric(input.val())) {
						o[input.attr('name')] = parseFloat(input.val());
					} else {
						o[input.attr('name')] = 0;
					}
					return;
				}
				o[input.attr('name')] = input.val();
			}
	);
	
	form.find('div.label>select:visible').each(
			function(data) {
				var select = $(this);
				o[select.attr("name")] = select.val();
				var subitemul = form.find('div.' + select.attr("name") + ":visible ul");
				if (subitemul.length!=0) { //数组类型成员
					var a = new Array();
					subitemul.find('li.cloned').each(
							function(data) {
								var one = {};
								$(this).find('input,select,textarea').each(
										function() {
											one[$(this).attr("name")] = $(this).val();
										}
								);
								a.push(one);
							}
					);
					o[subitemul.parent().attr('name')] = a;
				} 
			}
	);
	form.find('div.label>textarea:visible').each(
			function(data) {
				var input = $(this);
				o[input.attr('name')] = input.val();
			}
	);
	form.data("data", o);
	return o;
	// div.label>select, div.label>textarea
}


function setShare(title, url) {
    jiathis_config.title = title;
    jiathis_config.pic = url;
}
var jiathis_config = {
    title: ""
};


