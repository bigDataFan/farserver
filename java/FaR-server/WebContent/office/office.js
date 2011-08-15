var office = new Object();

office.date = new Date();

office.preday = function() {
	office.date = new Date(office.date.getTime() - 24*60*60*1000); 
	if (office.currentTab!=null) {
		office.currentTab.load();
	}
};

office.nextday = function() {
	office.date = new Date(office.date.getTime() + 24*60*60*1000);
	if (office.currentTab!=null) {
		office.currentTab.load();
	}
};

office.today = function() {
	office.date = new Date();
	if (office.currentTab!=null) {
		office.currentTab.load();
	}
};

office.currentTab = null;

office.file =  {
	load:function() {
		var uploader = new qq.FileUploader({
			element: document.getElementById('file-uploader-demo1'),
			action: '/service/office/upload',
			debug: false,
			onComplete: function(id, fileName, responseJSON){
				//setTimeout("$('li.qq-upload-success').fadeOut(300)", 1000);
				office.file.addUIFile(responseJSON);
        	}
		});  
		office.currentTab = office.file;
		$('div.pages').hide();
		$("#files").show();
		office.file.listFiles(getDateFormat(office.date));
	},

	listFiles:function(date) {
		$("#files div.fileItem").remove();
		$('span.flipPageBar span.currentDaySpan').html(date);
		$.getJSON("/service/office/daylist",
			{"date": date,
			"rnd":new Date().getTime()},
			function(data) {
				for(var i=0;i<data.length; i++) {
					office.file.addUIFile(data[i]);
				}
			}
		);
	},

	addUIFile:function(o) {
		var filed = $('div.fileItemTemplate').clone();
		filed.removeClass("fileItemTemplate").addClass("fileItem");
		filed.find('div.image img').attr("src", getFileImage(o.name));
		filed.find('div.title').html(office.file.formatFileName(o.name));
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
		$("#files div.panel").prepend(filed);
		filed.fadeIn(300);
	},
	
	remove:function(a) {
		$.post("/service/office/delete", 
				{"id": a.attr("bid")},
				function(data) {
					a.parent().parent().fadeOut(300);
				}
		);
	},

	formatFileName:function(name){
	    if (name.length > 43){
	        name = name.slice(0, 29) + '...' + name.slice(-13);    
	    }
	    return name;
	}

};

office.time = {
	load:function() {
		$('div.pages').hide();
		$("#times").show();
		$("#times").find('div.running div.timeOper a').live('click', function(data) {
			office.time.stopItem();
		});
		$("#times").find('div.pending div.timeOper a').live('click', function(data) {
			office.time.startItem($(this).attr('id'));
		});
		office.currentTab = office.time;
		office.time.listDay(getDateFormat(office.date));
	},
	
	listDay:function(date) {
		$("#times div.timeItem").remove();
		$.getJSON("/service/office/time/list",
				{
				'date':date,
				'refresh':new Date().getTime()
				},
				function(json) {
					for ( var i = 0; i < json.length; i++) {
						office.time.addUITime(json[i]);
					}
					$('#addTimeDiv').fadeOut(300);
					office.time.updateTime();
				}
		);
		$('span.flipPageBar span.currentDaySpan').html(getDateFormat(office.date));
	},
	
	
	addUITime: function(o) {
		var timed = $('div.timeTemplate').clone();
		$('#times div.panel').prepend(timed);
		
		timed.removeClass('timeTemplate');
		timed.addClass("timeItem");
		timed.data("timedata", o);
		
		timed.find('div.timeOper a').attr("id", o.id);
		if (o.laststart!=0) {
			$('#times div.running').removeClass("running").addClass("pending");
			timed.addClass("running");
			timed.find('div.timeOper span').html(formatDate(o.dura + (new Date().getTime()-o.laststart)));
		} else {
			timed.addClass("pending");
			timed.find('div.timeOper span').html(formatDate(o.dura));
		}
		
		timed.find('div.timeDesc').html(o.desc);
		
		timed.fadeIn(300);
	},
	
	showAddTime:function() {
		$('#addTimeDiv').fadeIn(300);
	},
	hideAddTime:function() {
		$('#addTimeDiv').fadeOut(300);
	},
	add:function() {
		var desc = $('#newtime').val();
		$('#newtime').val('');
		$.post("/service/office/time/add", 
				{"desc":desc},
				function(data) {
					office.time.addUITime(jQuery.parseJSON(data));
				});
	},
	
	stopItem: function() {
		$.post("/service/office/time/stop", 
				null,
				function(data) {
					$("#times div.running").removeClass("running").addClass("pending");
				}
		);
	},



	startItem:function(id) {
		$.post("/service/office/time/start", 
				{"id":id},
				function(data) {
					$("#times div.running").removeClass("running").addClass("pending");
					
					jQuery.each($("#times div.timeItem"),
							function() {
								var timedata = $(this).data("timedata");
								if (timedata==null) return;
								
								if (timedata.id==id) {
									$(this).addClass("running").removeClass("pending");
								}
							}
					);
				}
		);
	},
	updateTime:function() {
		var total = 0;
		
		jQuery.each($("#times div.timeItem"),
			function() {
				var timedata = $(this).data("timedata");
				if (timedata==null) return;
				
				total += timedata.dura;
				if ($(this).hasClass("running")) {
					$(this).find('div.timeOper span').html(formatDate(timedata.dura + (new Date().getTime()-timedata.laststart)));
					total += (new Date().getTime()-timedata.laststart);
				}
			}
		 );
		$('#timeTotal').html("总计:" + formatDate(total));
		setTimeout('office.time.updateTime()', 60*1000);
	},
	other:null
};


office.notes = {
	load:function() {
		$('div.pages').hide();
		$("#notes div.noteItem").remove();
		$('#notes').show();
		office.currentTab = office.notes;
		$.getJSON("/service/office/note/list", 
				{
					"start": 0,
					"limit":10,
					"refresh":new Date().getTime()
				},
				function(data) {
					for ( var i = 0; i < data.length; i++) {
						office.notes.drawNote(data[i]);
					}
				}
		);
	},
	
	add: function() {
		var content = $('#newNote').val();
		
		$.post("/service/office/note/add",
				{"content":content},
				function(data) {
					office.notes.drawNote(jQuery.parseJSON(data));
					$('#newNote').val('');
					office.notes.hideAddNote();
				});
	},

	edit: function(o) {
		var data = $(o).parent().parent().data('noteData');
		alert(data.id);
	},
	remove: function(o) {
		var data = $(o).parent().parent().data('noteData');
		
		$.post("/service/office/note/remove",
				{"id": data.id},
				function(data) {
					$(o).parent().parent().fadeOut(300);
				});
	},	
	showAddNote:function() {
		$('#addNoteDiv').fadeIn(300);
	},
	
	hideAddNote:function() {
		$('#addNoteDiv').fadeOut(300);
	},
	
	
	
	drawNote:function(o) {
		var cloned = $('div.notesTemplate').clone();
		cloned.removeClass('notesTemplate');
		cloned.addClass("noteItem");
		cloned.data('noteData', o);
		$('#notes div.panel').append(cloned);
		
		cloned.find('div.content').html(o.content.replace(/\n/g, '<br>'));
		cloned.fadeIn(300);
	},
	other:null	
};


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


