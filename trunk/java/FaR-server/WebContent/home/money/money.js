var groupdb;
var incomedb;
var categories;

var CAT_STRING = '{"children":[{"name":"多发点","children":[{"name":"水电费"},{"name":"说were"}]},{"name":"风尚大典","children":[{"name":"四点多方位"}]},{"name":"佛挡杀佛","children":[{"name":"电风扇发生大"},{"name":"第三方的发生地"}]}]}';

var currentUser;

$(document).ready(function(){
	
	initStaticUI();
	initOutCome();
	initSync();
	
	groupdb = new TAFFY();
	incomedb = new TAFFY();
	$.getJSON("/service/db/config", {"r":new Date().getTime(),"app":"money"}, 
			function(data) {
				currentUser = data.user;
				if (!isIE6()) {
					groupdb.store(currentUser + ".moneygroup");
					incomedb.store(currentUser + ".income");
				}
				synchronize(groupdb, 'ocgroup', currentUser);
				synchronize(incomedb, 'icgroup', currentUser);
				
				initCategory();
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
				layout.pushCurrent($('#detailList'), $('#addOutComeForm'));
				$('#outcomelist div.group').remove();
				formReset(true);
				groupdb().order("___id desc").start(0).limit(10).each(
						function(record,recordnumber) {
							if (!record._deleted) {
								uiAddLeftItem(record, 'group');
							}
						}
				);
			}
	);
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
	http.saveConfig(CAT_STRING);
}

var http = {
		saveConfig:function(cat) {
			$.post("/service/db/setconfig",
					{"app":"money", 'name':"category", "value": cat},
					function(){});
		}
};

function uiAddLeftItem(o, type) {
	var listcontainer = $('#detailList');
	listcontainer.find('div.emptyInfo').hide();
	var cloned = $('#' + o.___id);
	if (cloned.length==0) {
		cloned = $('div.taskItemTemplate').clone();
		listcontainer.prepend(cloned);
		cloned.attr("id", o.___id);
	}
	bindObject(cloned, o);
}

//复制一个支出项
function uicloneSubitem(button, o) {
	var template = $('li.forclone');
	//var parentul = template.parent();
	if (template.length!=0) {
		var cloned = template.clone();
		cloned.removeClass('forclone').addClass('cloned').show();
		if (o) {
			fillEditForm(cloned, o);
		}
		cloned.find('a.delete').click(
				function() {
					cloned.remove();
				}
		);
		template.after(cloned);
		//parentul.append(cloned);
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

//根据支出对象打开支出表单
uiEdit = function(t) {
	var data = $(t).data('data');
	var form = $('#addOutComeForm');
	
	$('#detailList div.item').removeClass("selected");
	$(t).addClass("selected");
	
	fillEditForm(form, data);
};

//保存一笔支出
uiSaveOutCome = function(createNew) {
	var form = $('#addOutComeForm');
	var extracted = extractFormObject(form);
	extracted.updated = new Date().getTime();

	if (extracted.___id) {
		groupdb(extracted.___id).update(extracted);
	} else {
		groupdb.insert(extracted);
	}
	uiAddLeftItem(extracted, 'group');
};

uiRemoveSelected = function() {
	$('div.checked').each(
			function() {
				if ($(this).hasClass("selected")) {
					formReset(true);
				}
				var data = $(this).data("data");
				if (data!=null) {
					data["_deleted"] = 1;
					data["updated"] = new Date().getTime();
					if (data.formid=="addOutComeForm") {
						groupdb(data.___id).update(data);
					} 
					if (data.formid=="addInComeForm") {
						incomedb(data.___id).update(data);
					}
					$(this).remove();
				}
			}
	);
};

//保存一笔收入
uiSaveInCome = function(createNew) {
	var form = $('#addInComeForm');
	
	var income = form.data("income");
	var updated = true;
	if (income==null) {
		income = false;
		income = {};
	};
	
	income.title = form.find('input.title').val();
	income.total = form.find('input.total').val();
	income.time = form.find('input.time').val();
	income.type = form.find('select.intype').val();
	income.updated = new Date().getTime();
	income.desc = form.find('textarea.desc').val();
	income.from = form.find('textarea.from').val();
	
	if (updated) {
		incomedb(income.___id).update(income);
	} else {
		incomedb.insert(income);
	}
	uiAddLeftItem(income, 'income');
	if (createNew) {
		uiResetInCome();
	} else {
		form.data("income", income);
	}
};

resync =  function() {
	groupdb().remove();
	$.cookie(currentUser + ".ocgroup.updated", 0);
	location.href = location.href;
};


uiSaveCategory = function() {
	var o = category.toJson($('#eidtCat ul.category'), {});
	categories = o;
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