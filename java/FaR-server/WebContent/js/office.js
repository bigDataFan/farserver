var office = new Object();

office.file =  {
	load:function() {
		var uploader = new qq.FileUploader({
			element: document.getElementById('file-uploader-demo1'),
			action: '/service/office/upload',
			debug: false,
			onComplete: function(id, fileName, responseJSON){
				//setTimeout("$('li.qq-upload-success').fadeOut(300)", 1000);
				//listFiles(getDateFormat(new Date()));
				addFile(responseJSON);
        	}
		});  
		
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
	$("#files").append(filed);
	filed.fadeIn(500);
}

function formatFileName(name){
    if (name.length > 43){
        name = name.slice(0, 29) + '...' + name.slice(-13);    
    }
    return name;
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