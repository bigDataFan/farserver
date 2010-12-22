var id = getParam("id");
var collections = getParam('collection');

$(document).ready(function(){

	if ($('.multiconsumerselect').length>0) {
		$.getJSON("service/conselect.gs", 
				{},
				function(data) {
					var wul = $('.multiconsumerselect div.slider-content ul');
					for(var i=0; i<data.length; i++) {
						if (data[i].firstLetter) {
							var l = data[i].firstLetter.toLowerCase();
							var group = $('#' + l);
							if (group.length==0) {
								group = $('<li id="' + l + '"><a name="' + l + '" class="title">' + l + '</a><ul></ul></li>');
								wul.append(group);
							}
							group.find('ul').append('<li><a href="javascript:void(0)" id="' + data[i].id + '">' + data[i].name + "(" + data[i].alias + ')</a></li>');
						} 
					}
					$('.slider-content ul ul li a').click(function(){
						var mulinput = $('input.multiconsumerselectinput');
						mulinput.val(mulinput.val() + " " + $(this).html());
						var singleinput = $('input.singleconsumerselectinput');
						singleinput.val($(this).html());
					});
					$('.multiconsumerselect').sliderNav();
				}
		);
	}
	
	if (id!=null) {
		$.getJSON("service/edit.gs",
				{
					"collection": collections,
					"id": id
				},
				function(data) {
					for(var o in data) {
						$('*[name="' + o + '"]').val(data[o]);
					}
				}
		);
	}
});

function saveObj(create) {
	var req = new Object();
	req.collection = collections;
	if (id!=null) req.id = id;

	$('input,select,textarea').each(
			function() {
				req[$(this).attr("name")] = $(this).val();
			}
	);

	$.post("service/save.gs",
			req,
			function(data) {
				if (create) {
					location.href = location.pathname;
				} else {
					alert("保存完成");
					history.back();
				}
			}
	);
}

function getParam(strname) {
	var hrefstr, pos, parastr, para, tempstr;
	hrefstr = window.location.href;
	pos = hrefstr.indexOf("?")
	parastr = hrefstr.substring(pos + 1);
	para = parastr.split("&");
	tempstr = "";
	for (i = 0; i < para.length; i++)
	{
		tempstr = para[i];
		pos = tempstr.indexOf("=");
		if (tempstr.substring(0, pos) == strname) {
			return tempstr.substring(pos + 1);
		}
	}
	return null;
}
