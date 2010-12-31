var id = getParam("id");
var collections = getParam('collection');

$(document).ready(function(){
	if (id!=null) {
		$.getJSON("../service/edit.gs",
				{
					"collection": collections,
					"id": id
				},
				function(data) {
					for(var o in data) {
						$('*[name="' + o + '"]').val(data[o]);
						if ($('*[name="' + o + '"]').attr("type")=="checkbox" && data[o]=="1") {
							$('*[name="' + o + '"]').attr("checked", true);
						}
						
						if ($('*[name="' + o + '"]').attr("multiple") && isArray(data[o])) {
							$('*[name="' + o + '"]').val(data[o].join(' '));
						}
						
						
					}
				}
		);
	}
	
	/**make some field autocomplete*/
	$('input,select,textarea').each(
			function() {
				var currentElem = $(this);
				if (currentElem.attr('selectable')=="true") {
					$.getJSON("../service/columns.gs",
							{
						"collection": collections,
						"column": $(this).attr('name')
							},
							function(data) {
								currentElem.tagSuggest({
									tags: data   
								});
							}  
					)
				}
			}
	);
	
	
});

function saveObj(create) {
	var req = new Object();
	req.collection = collections;
	if (id!=null) req.id = id;

	$('input,select,textarea').each(
			function() {
				if ($(this).attr("name")) {
					if ($(this).attr("type")=="checkbox") {
						if ($(this).attr("checked")) {
							req[$(this).attr("name")] = "1";
						} else {
							req[$(this).attr("name")] = "0";
						}
						return;
					}
					
					if ($(this).attr("multiple")) {
						req[$(this).attr("name")] = $(this).val().split(' ');
					} else {
						req[$(this).attr("name")] = $(this).val();
					}
				}
			}
	);

	$.post("../service/save.gs",
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

function seqAdd(seq, size) {
	
	var seqElem = $('input[name="' + seq + '"]');
	var coutElem = $('input[name="' + size + '"]');
	if (parseInt(seqElem.val()) && parseInt(coutElem.val())) {
		var from = parseInt(seqElem.val());
		var end = from + parseInt(coutElem.val());
		var req = new Object();
		req.collection = collections;
		$('input,select,textarea').each(
				function() {
					req[$(this).attr("name")] = $(this).val();
				}
		);
		postOne(req, seq, from, end)
	}
}

function postOne(req, name, from, end) {
	if (from==end) {
		alert("批量导入完成");
		history.back();
	} else {
		from ++;
		req[name] = from;
		$.post("../service/save.gs",
				req,
				function(data) {
					postOne(req, name, from, end);
				}
		);
		
		
	}
	
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

var isArray = function(v){
	  return Object.prototype.toString.apply(v) === '[object Array]';
}

