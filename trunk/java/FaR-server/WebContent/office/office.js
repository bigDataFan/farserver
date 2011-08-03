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
		$("#files").show();
		listFiles(getDateFormat(new Date()));
	}	
};


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
			$.post("/service/office/delete", 
					{"id": $(this).attr("bid")},
					function(data) {
						a.parent().parent().fadeOut(300);
					}
			);
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