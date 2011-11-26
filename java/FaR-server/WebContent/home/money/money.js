var groupdb;
var incomedb;
var categories;


var CAT_STRING = '{"children":[{"name":"家居日常","children":[{"name":"米面粮油"},{"name":"蔬菜水果"},{"name":"厨卫用品"},{"name":"衣服鞋帽"},{"name":"小吃零食"},{"name":"外出就餐"}]},{"name":"固定开销","children":[{"name":"房租物业"},{"name":"水电煤气"},{"name":"通讯费用"},{"name":"交通费用"}]},{"name":"文体活动","children":[{"name":"旅游"},{"name":"体育健身"}]}]}';

var currentUser;

$(document).ready(function(){
	initStaticUI();
	initOutCome();
	initInCome();
	initSync();
	initReport();
	initCategory();
	
	groupdb = new TAFFY();
	incomedb = new TAFFY();
	dbreg["groupdb"] = groupdb;
	dbreg["incomedb"] = incomedb;
	
	currentUser = $.cookie("365ticket");  
	$.getJSON("/service/db/config", {"r":new Date().getTime(),"app":"money"}, 
			function(data) {
				currentUser = data.user;
				if (currentUser.indexOf("guest.")==-1) {
					$('#loginLink').hide();
					$('#userInfo span.name').html(currentUser);
					$('#userInfo').show();
				}
				$('#networkInfo').html('您已经连接到服务器');
				if (!isIE6()) {
					groupdb.store(currentUser + ".moneygroup");
					incomedb.store(currentUser + ".income");
				}
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

function initSync() {
	$('#navsync').click(function() {
		var info = $('#syncinfo');
		layout.pushCurrent($('#toplist'), info);
		info.find('div.browser').html('浏览器类型：' + navigator.userAgent);
		info.find('div.localstorage').html("支持本地数据存储:"  + ((window.localStorage==null)? "否":"是"));
		info.find('div.user').html("你的用户账号:"  + currentUser);
		info.find('div.updated').html("你的数据更新时间: "  + new Date(parseInt($.cookie(currentUser + ".ocgroup.updated"))).format('isoDateTime'));
	});
}

function initOutCome() {
	$('#navoutcome').click(
			function(data) {
				$('div.emptyInfo').show();
				layout.pushCurrent($('#detailList'), $('#addOutComeForm'));
				$('#detailList div.item').remove();
				formReset(true);
				groupdb().order("time").start(0).limit(10).each(
						function(record,recordnumber) {
							if (!record._deleted) {
								uiAddLeftItem(record);
							}
						}
				);
			}
	);
}

function initInCome() {
	$('#navincome').click(
			function(data) {
				$('div.emptyInfo').show();
				layout.pushCurrent($('#detailList'), $('#addInComeForm'));
				$('#detailList div.item').remove();
				formReset(true);
				incomedb().order('time').start(0).limit(10).each(
						function(record, recordernumber) {
							uiAddLeftItem(record);
						}
				);
			}
	);
}

function initReport() {
	$('#navreport').click(
			function(data) {
				layout.pushCurrent($('#reportList'), $('#report'));
				$('#report div.reports').hide();
			}
	);
}

function analyzeMonth() {
	var year = parseInt($('select[name="generalyear"]').val());
	var month = parseInt($('select[name="generalmonth"]').val());
	$('#generalReport').show();
	$('#generalReport div.title div.info').html(year + "年" + month + "月支出账目");
	
	$('#generalReport div.reportlist').html('');
	var d = new Date(year, month, 0);
	
	var total = 0;
	var daysCost = [];
	var xCost = [];
	var categoryCost = {};
	for ( var i = 1; i <= d.getDate(); i++) {
		var daydiv  = $('<div class="days"><div class="date">' + i + '</div></div'); 
		var a = new Date(year, month, i);
		if(a.getDay()==5 || a.getDay()==6 ) {
			daydiv.addClass("weekend");
		}
		var daytotal = 0;
		groupdb({time:year+"-"+month + "-" + ((i<10)?("0"+i):i)}).start(0).each(
				function(record,recordnumber) {
					if (!record._deleted) {
						var infodiv = $('<div class="info"><div class="title">' +record.title + " 总计" +  record.total + '</div>');
						if (record.items) {
							for ( var j = 0; j < record.items.length; j++) {
								infodiv.find('div.title').append('<p>' + record.items[j].title + "  " + record.items[j].cost  + '</p>');
								if (categoryCost[record.items[j].category]==null) {
									categoryCost[record.items[j].category] = parseInt(record.items[j].cost);
								} else {
									categoryCost[record.items[j].category] += parseInt(record.items[j].cost);
								}
							}
						}
						if (record.category) {
							if (categoryCost[record.category]==null) {
								categoryCost[record.category] = parseInt(record.total);
							} else {
								categoryCost[record.category] += parseInt(record.total);
							}
						}
						total += parseInt(record.total);
						daytotal += parseInt(record.total);
						daydiv.append(infodiv);
					}
				}
		);
		daysCost.push(daytotal);
		if (daytotal==0) {
			daydiv.addClass("empty");
		}
		xCost.push(i);
		
		$('#generalReport div.reportlist').append(daydiv);
	}
	$('#generalReport div.reportlist').append('<div class="total">总计: '  + total + '</div');

	 chart = new Highcharts.Chart({
	      chart: {
	         renderTo: 'outcomeline',
	         defaultSeriesType: 'line',
	         marginRight: 130,
	         marginBottom: 25
	      },
	      title: {
	         text:  '月开销图表',
	         x: -20 //center
	      },
	      xAxis: {
	         categories:xCost
	      },
	      yAxis: {
	         title: {
	            text: '单位:元'
	         },
	         plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	         }]
	      },
	      tooltip: {
	         formatter: function() {
	                   return '<b>'+ this.y +'</b>';
	         }
	      },
	      legend: {
	         layout: 'vertical',
	         align: 'right',
	         verticalAlign: 'top',
	         x: -10,
	         y: 100,
	         borderWidth: 0
	      },
	      series: [{
	         name: year + '年'  + month + '月',
	         data: daysCost
	      }]
	   });
	  
	 
	 var chartSource = [];
	 for ( var key in categoryCost) {
		 chartSource.push([key, categoryCost[key]]);
	}
	
	 new Highcharts.Chart({
	      chart: {
	         renderTo: 'categorychart',
	         plotBackgroundColor: null,
	         plotBorderWidth: null,
	         plotShadow: false
	      },
	      title: {
	         text: '按分类查看开销'
	      },
	      tooltip: {
	         formatter: function() {
	            return '<b>'+ this.point.name +'</b>: '+ Math.floor(this.percentage) +' %';
	         }
	      },
	      plotOptions: {
	         pie: {
	            allowPointSelect: true,
	            cursor: 'pointer',
	            dataLabels: {
	               enabled: true,
	               //color: Highcharts.theme.textColor || '#000000',
	               //connectorColor: Highcharts.theme.textColor || '#000000',
	               formatter: function() {
	                  return '<b>'+ this.point.name +'</b>: '+ Math.floor(this.percentage) +' %';
	               }
	            }
	         }
	      },
	       series: [{
	         type: 'pie',
	         name: 'Browser share',
	         data: chartSource
	      }]
	   });
	 
}

function reportToggleEmpty() {
	$('div.reportlist div.empty').toggle();
}

function initStaticUI() {
	layout.pushCurrent($('#toplist'), $('#mainwelcome'));
	$( "input.choosedate" ).datepicker({
		autoSize: false,
		dateFormat: 'yy-mm-dd' ,
		monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		showWeek: true
	});
	
	$('select').change(function(data){
		var select = $(this);
		var selected = select.find("option:selected");
		$('div.' + select.attr("rellabel")).hide();
		if (selected.attr('reldiv')!=null) {
			$('#' + selected.attr('reldiv')).show();
		}
	});
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