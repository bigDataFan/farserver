var office = new Object();

office.file =  {
	load:function() {
		var uploader = new qq.FileUploader({
			element: document.getElementById('file-uploader-demo1'),
			action: '/service/office/upload',
			debug: false,
			onComplete: function(id, fileName, responseJSON){
				setTimeout("$('li.qq-upload-success').fadeOut(300)", 1000);
				addFile(responseJSON);
        	}
		});  
		$('div.pages').hide();
		$("#files").show();
		listFiles(getDateFormat(new Date()));
	},
	
	remove:function(a) {
		$.post("/service/office/delete", 
				{"id": a.attr("bid")},
				function(data) {
					a.parent().parent().fadeOut(300);
				}
		);
	}
};

office.time = {
	load:function() {
		$('div.pages').hide();
		$("#times").show();
		
		$.getJSON("/service/office/time/list",
				{'date':getDateFormat(new Date())},
				function(json) {
					for ( var i = 0; i < json.length; i++) {
						addTime(json[i]);
					}
				}
		);
		
		
		$("#times").find('div.running div.timeOper a').live('click', function(data) {
			alert($(this).attr('created'));
		});
		
		$("#times").find('div.pending div.timeOper a').live('click', function(data) {
			alert($(this).attr('created'));
		});
		
	},
	
	add:function(desc) {
		$.post("/service/office/time/add", 
				{"desc":desc},
				function(data) {
					addTime(data);
				});
	},
	
	stop:function(start) {
		$.post("/service/office/time/stop",
				{},
				function(data) {
					
				});
	},
	other:null
}



function addTime(o) {
	var timed = $('div.timeTemplate').clone();
	timed.removeClass('timeTemplate').addClass("timeItem");
	
	timed.find('div.timeOper a').attr("created", o.created);
	if (o.laststart!=0) {
		$('#times div.running').removeClass("running").addClass("pending");
		timed.addClass("running");
		timed.find('div.timeOper span').html(formatDate(o.dura + (new Date().getTime()-o.laststart)));
	} else {
		timed.addClass("pending");
		timed.find('div.timeOper span').html(formatDate(o.dura));
	}
	
	timed.find('div.timeDesc').html(o.desc);
	
	$('#times').prepend(timed);
	timed.fadeIn(500);
}


function listFiles(date) {
	$("#files div.fileItem").remove();
	$.getJSON("/service/office/daylist",
		{"date": date,
		"rnd":new Date().getTime()},
		function(data) {
			for(var i=0;i<data.length; i++) {
				addFile(data[i]);
			}
			
		}
	);
}



function addFile(o) {
	var filed = $('div.fileItemTemplate').clone();
	filed.removeClass("fileItemTemplate").addClass("fileItem");
	filed.find('div.image img').attr("src", getFileImage(o.name));
	filed.find('div.title').html(formatFileName(o.name));
	filed.find('div.desc').html('创建于 ' + formatHours(new Date(o.modified)) + "<br>"
			+ " 大小 " + formatSize(parseInt(o.size)));
	
	filed.find('a.delete').attr("bid", o.id);
	filed.find('a.delete').click(
		function() {
			var a = $(this);
			office.file.remove(a);
		}
	);
	filed.find('a.download').attr("href", "/d?id=" + o.id);
	$("#files").prepend(filed);
	filed.fadeIn(500);
}

function formatFileName(name){
    if (name.length > 43){
        name = name.slice(0, 29) + '...' + name.slice(-13);    
    }
    return name;
}

var endfixes = ["asf","avi","bmp","csv","cab","doc","docx","eml","exe","gif","htm","html","jp2","jpe","jpeg","jpg","jpx","js","lnk","mp3","mp4","mpeg","mpg","msg","odf","odg","odp","ods","odt","pdf","png","ppt","pptx","psd","rtf","shtml","swf","tif","tiff","txt","url","wmv","png","xls","xml","xsd","xsl","xlsx","gz","tar","zip"];
function getFileImage(name) {
	var pos = name.lastIndexOf(".");
	var ending = "";
	if (pos>-1) {
		ending =  name.substring(pos+1);
	}
	if ($.inArray(ending, endfixes)>-1) {
		return "/filetype/" + ending + ".gif";
	} else {
		return "/filetype/default.gif";
	}
}

function formatHours(date) {
	return date.getHours() + ":" + ((date.getMinutes()<10)?("0" + date.getMinutes()): date.getMinutes());
}
function getDateFormat(dd) {
	return dd.getFullYear() + "-" + (dd.getMonth()+1) + "-" + dd.getDate();
}

function formatSize(bytes){
    var i = -1;                                    
    do {
        bytes = bytes / 1024;
        i++;  
    } while (bytes > 99);
    
    return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];          
}


function formatDate(mill) {
	var d3 = new Date(parseInt(mill));
	return ((d3.getDate()-1)*24 + (d3.getHours()-8)) + ":" 
	+ ((d3.getMinutes()<10)?("0"+d3.getMinutes()):d3.getMinutes()); 
}

