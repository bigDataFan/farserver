var more = new Object();

var categories = JSON.parse('{"children":[{"name":"多发点","children":[{"name":"水电费"},{"name":"说were"}]},{"name":"风尚大典","children":[{"name":"四点多方位"}]},{"name":"佛挡杀佛","children":[{"name":"电风扇发生大"},{"name":"第三方的发生地"}]}]}'); 

$(document).ready(function(){
	layout.pushCurrent($('#toplist'), $('#mainwelcome'));

	$('#navoutcome').click(
			function(data) {
				layout.pushCurrent($('#outcomelist'), $('#addOutComeForm'));
				
				$('#outcomelist div.group').remove();
				groupdb().order("___id desc").start(0).limit(10).each(
						function(record,recordnumber) {
							money.uiAddGroup(record);
						}
				);
			}
	);
	
	$('select.outtype').change(function(data){
		money.uiswitchType($(this).val());
	});
	/*
	category.load($('#selectCatul'), o, true);
	$('#selectCatul').find('span').remove();
	$( "#categoryDialog" ).dialog({
		autoOpen: true,
		show: "drop"
	});*/
	//category.fillSelect($('#category1'), categories);
	$('select.category').each(
			function(){
				category.fillSelect($(this), categories);
			}
	);
	groupdb = new TAFFY();
	groupdb.store("moneygroup");
	itemdb = new TAFFY();
	itemdb.store("itemgroup");
});

var groupdb;
var itemdb;

/*
more.showMenu = function() {
	$('#menu1').slideDown('fast');
	
	$('#menu1').hover(function(data){},
			function(data){
			$('#menu1').slideUp('fast');
			}
	);
};
*/
var utils = {
		'single': "单笔支出",
		"multi": "多项支出",
		"exp":"预算外"
};

var money = {
		
		uiswitchType: function(t) {
			$('div.outcometype').hide();
			if (t=="single") {
				$('#single').slideDown('fast');
			} else if (t=="multi") {
				$('#multi').slideDown('fast');
			}
		},
		
		uiAddGroup:function(o) {
			$('#outcomelist div.emptyInfo').hide();
			cloned = $('div.taskItemTemplate').clone();
			$('#outcomelist').prepend(cloned);
			cloned.removeClass('taskItemTemplate').addClass('group').slideDown('fast');
			cloned.find('.total').html(o.total);
			
			cloned.find('.resource span').html(utils[o.type]);
			if (o.desc.length>10) {
				cloned.find('.title').html(o.desc.substring(0,10) + "..");
			} else {
				cloned.find('.title').html(o.desc);
			}
			
			cloned.find('.info1').html(o.time);
			cloned.find('.info2').html(o.by);
			cloned.data("outcome", o);
		},
		
		cloneSubitem: function() {
			var cloned =  $('#subitemlist li.forclone').clone();
			cloned.removeClass('forclone').show();
			
			cloned.find('a.delete').click(
					function() {
						cloned.remove();
					}
			);
			$('#subitemlist').append(cloned);
		},
		
		uiEditOutCome: function(t) {
			var data = $(t).data('outcome');
			var form = $('#addOutComeForm');
			
			$('#outcomelist div.item').removeClass("selected");
			$(t).addClass("selected");
			
			form.data("outcome", data);
			
			form.find('input.desc').val(data.desc);
			form.find('input.start').val(data.time);
			form.find('input.total').val(data.total);
			form.find('select.outmethod').val(data.by);
			form.find('select.outtype').val(data.type);

			money.uiswitchType(data.type);
			if (data.type=="single") {
				$('#single select').val(itemdb({gid:data.___id}).cat);
			}
			
		},
		
		uiSaveOutCome: function() {
			var form = $('#addOutComeForm');
			
			var group = {
					desc: form.find('input.desc').val(),
					time: form.find('input.start').val(),
					total:form.find('input.total').val(),
					by: form.find('select.outmethod').val(),
					type:form.find('select.outtype').val(),
					updated: new Date().getTime()
			};
			groupdb.insert(group);
			var groupid = group.___id;
			
			if (group.type=="single") {
				//保存1条支出记录
				var item = {
						'gid': groupid,
						'cat': $('#single select').val(),
						'cost': group.total,
						'updated': new Date().getTime()
				};
				itemdb.insert(item);
			} else if (group.type=="multi") {
				//保存多条支出记录
				$('#subitemlist li').each(
						function(){
							var li = $(this);
							var item = {
									'gid': groupid,
									'updated': new Date().getTime(),
									'desc':  li.find('input.desc').val(),
									'cost': li.find('input.cost').val(),
									'cat': li.find('select').val()
							};
							itemdb.insert(item);			
						}
				);
			}
			money.uiAddGroup(group);
			form.find('input.desc').val('');
			form.find('input.start').val('');
			form.find('input.total').val('');
			form.find('select.outmethod').val('现金');
			type:form.find('select.outtype').val('single');
			$('div.outcometype').hide();
			$('#single').slideDown('fast');
			//groupdb.store('moneygroup');
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

