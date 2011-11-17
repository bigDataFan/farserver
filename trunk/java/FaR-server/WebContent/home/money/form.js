function fillEditForm(form, data) {
	form.data("data", data);
	for ( var key in data) {
		if (jQuery.isArray(data[key])) { //添加数组类型的成员
			var div = form.find('*[name="' + key + '"]');
			var subul = div.find('ul.subitems');
			if (subul.length!=0) {
				subul.find('li.cloned').remove();
				$(data[key]).each(function() {
					var cloned = subul.find("li.forclone").clone();
					cloned.removeClass("forclone").addClass('cloned');
					subul.append(cloned);
					var subitem = $(this)
					for(var subkey in subitem) {
						cloned.find('.' + subkey).val(subitem[subkey]);
					}
				});
			} else {
				var subitem = data[key][0];
				for(var subkey in subitem) {
					div.find('.' + subkey).val(subitem[subkey]);
				}
			}
		} else {
			form.find("." + key).val(data[key]);
		}
	}
}


function formReset() {
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
	form.find('div.switched').each(function(data) {
		if ($(this).attr("default")==1) {
			$(this).show();
		} else {
			$(this).hide();
		}
	});
}



function extractFormObject(form) {
	var o = {};
	if (form.data("data")) {
		o = form.data("data");
	}
	form.find('label>input:visible, div.label>input:visible').each(
			function(data) {
				var input = $(this);
				o[input.attr('name')] = input.val();
			}
	);
	
	form.find('label>select:visible, div.label>select:visible').each(
			function(data) {
				var select = $(this);
				o[select.attr("name")] = select.val();
				var subitemul = form.find('div.' + select.attr("name") + ":visible ul");
				if (subitemul.length!=0) { //数组类型成员
					var a = new Array();
					subitemul.find('li.cloned').each(
							function(data) {
								a.push(extractFormObject($(this)));
							}
					);
					o[subitemul.attr('name')] = a;
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


