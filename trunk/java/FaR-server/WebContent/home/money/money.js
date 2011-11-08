var categories = JSON.parse('{"children":[{"name":"多发点","children":[{"name":"水电费"},{"name":"说were"}]},{"name":"风尚大典","children":[{"name":"四点多方位"}]},{"name":"佛挡杀佛","children":[{"name":"电风扇发生大"},{"name":"第三方的发生地"}]}]}'); 
var groupdb;
var utils = {
		'single': "单笔支出",
		"multi": "多项支出",
		"exp":"预算外"
};


$(document).ready(function(){
	layout.pushCurrent($('#toplist'), $('#mainwelcome'));

	$( "input.choosedate" ).datepicker({
		autoSize: false,
		dateFormat: 'yy-mm-dd' ,
		monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		showWeek: true
	});
	
	$('#navoutcome').click(
			function(data) {
				layout.pushCurrent($('#outcomelist'), $('#addOutComeForm'));
				$('#outcomelist div.group').remove();
				money.uiResetOutCome();
				groupdb().order("___id desc").start(0).limit(10).each(
						function(record,recordnumber) {
							if (!record._deleted) {
								money.uiAddOrUpdateGroup(record);
							}
						}
				);
			}
	);
	
	$('#navsync').click(function() {
		var info = $('#syncinfo');
		layout.pushCurrent($('#toplist'), info);
		info.find('div.browser').html('浏览器类型：' + navigator.userAgent);
		
		
	});
	
	$('select.outtype').change(function(data){
		money.uiswitchType($(this).val());
	});
	$('select.category').each(
			function(){
				category.fillSelect($(this), categories);
			}
	);
	
	groupdb = new TAFFY();
	
	if (!isIE6()) {
		groupdb.store("moneygroup");
	}
	$.getJSON("/service/authority/current", {"r":new Date().getTime()}, 
			function(data) {
				currentUser = data.userName;
				synchronize(groupdb, 'ocgroup', currentUser);
			}
		);
});


var money = {
		
		//切换支出类型
		uiswitchType: function(t) {
			$('div.outcometype').hide();
			if (t=="single") {
				$('#single').show();
			} else if (t=="multi") {
				$('#multi').show();
			}
		},
		
		//增加或者更新左侧导航的支出项
		uiAddOrUpdateGroup:function(o) {
			$('#outcomelist div.emptyInfo').hide();
			var cloned = $('#' + o.___id);
			if (cloned.length==0) {
				cloned = $('div.taskItemTemplate').clone();
				$('#outcomelist').prepend(cloned);
				cloned.attr("id", o.___id);
				cloned.removeClass('taskItemTemplate').addClass('group').slideDown('fast');
			}
			
			cloned.find('.total').html(o.total);
			
			cloned.find('.resource span').html(utils[o.type]);
			if (o.desc.length>10) {
				cloned.find('.title').html(o.desc.substring(0,10) + "..");
			} else {
				cloned.find('.title').html(o.desc);
			}
			
			cloned.find('.info1').html(o.time);
			cloned.find('.info2').html(o.by);
			cloned.data("group", o);
		},
		
		//复制一个支出项
		cloneSubitem: function(o) {
			var cloned =  $('#subitemlist li.forclone').clone();
			cloned.removeClass('forclone').addClass('cloned').show();
			
			if (o) {
				cloned.find('input.desc').val(o.desc);
				cloned.find('input.cost').val(o.cost);
				cloned.find('input.category').val(o.cat);
			}
			
			
			cloned.find('a.delete').click(
					function() {
						cloned.remove();
					}
			);
			$('#subitemlist').append(cloned);
		},
		
		//根据支出对象打开支出表单
		uiEditOutCome: function(t) {
			var data = $(t).data('group');
			var form = $('#addOutComeForm');
			
			$('#outcomelist div.item').removeClass("selected");
			$(t).addClass("selected");
			
			form.data("group", data);
			
			form.find('input.desc').val(data.desc);
			form.find('input.start').val(data.time);
			form.find('input.total').val(data.total);
			form.find('select.outmethod').val(data.by);
			form.find('select.outtype').val(data.type);

			money.uiswitchType(data.type);
			
			form.find('li.cloned').remove();
			
			if (data.type=="single") {
				$('#single select').val(data.items[0].cat);
			} else if (data.type=="multi") {
				for(var i=0; i<data.items.length; i++) {
					money.cloneSubitem(data.items[i]);
				}
			}
		},
		
		//重置支出表单
		uiResetOutCome: function() {
			var form = $('#addOutComeForm');
			form.data("group", null);
			form.find('input.desc').val('');
			form.find('input.start').val('');
			form.find('input.total').val('');
			form.find('select.outmethod').val('现金');
			type:form.find('select.outtype').val('single');
			$('div.outcometype').hide();
			$('#single').show();
		},
		//将支出每项加到总额中
		calculateTotal: function() {
			var form = $('#addOutComeForm');
			var total = 0;
			$('#subitemlist li.cloned').each(
					function(){
						var li = $(this);
						if (!isNaN(li.find('input.cost').val())) {
							total += parseFloat(li.find('input.cost').val());
						}
					}
			);
			form.find('input.total').val(total);
		},
		//保存一笔支出
		uiSaveOutCome: function(createNew) {
			var form = $('#addOutComeForm');
			
			var group = form.data("group");
			var updated = true;
			if (group==null) {
				updated = false;
				group = {};
			};
			
			group.desc = form.find('input.desc').val();
			group.time = form.find('input.start').val();
			group.total = form.find('input.total').val();
			group.by = form.find('select.outmethod').val();
			group.type = form.find('select.outtype').val();
			group.updated = new Date().getTime();
			
			var groupid = group.___id;
			
			if (group.type=="single") {
				//保存1条支出记录
				var item = {
						'gid': groupid,
						'cat': $('#single select').val(),
						'cost': group.total,
						'updated': new Date().getTime()
				};
				group.items = [item]; 
			} else if (group.type=="multi") {
				group.items = new Array();
				//保存多条支出记录
				$('#subitemlist li.cloned').each(
						function(){
							var li = $(this);
							var item = {
									'gid': groupid,
									'updated': new Date().getTime(),
									'desc':  li.find('input.desc').val(),
									'cost': li.find('input.cost').val(),
									'cat': li.find('select').val()
							};
							group.items.push(item);	
						}
				);
			}
			if (updated) {
				groupdb({___id:groupid}).update(group);
			} else {
				groupdb.insert(group);
			}
			money.uiAddOrUpdateGroup(group);
			
			if (createNew) {
				money.uiResetOutCome();
			} else {
				form.data("group", group);
			}
		},
		
		uiRemoveCurrent: function() {
			var form = $('#addOutComeForm');
			var group = form.data("group");
			
			if (group!=null) {
				group["_deleted"] = 1;
				group["updated"] = new Date().getTime();
				groupdb({___id:group.___id}).update(group);
				
				$('#' + group.___id).remove();
			}
		}
		
		
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
					var cul = $('<ul></ul>');
					li.append(cul);
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




