
saveCurrentForm = function() {
	var form = $('div.form:visible');
	form.each(
			function(data) {
				var extracted = extractFormObject(form);
				extracted.updated = new Date().getTime();
				if (extracted.___id) {
					dbreg[extracted.db](extracted.___id).update(extracted);
				} else {
					extracted.___id = "T" + new Date().getTime();
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
		if (w) {
			listcontainer.prepend(cloned);
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
					alert(input.val()  +  new Date(input.val()).getTime());
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


