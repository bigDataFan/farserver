/**
 * 
 */

$(document).ready(function(){
	project.load();
	task.load();
	//resource.load();
	layout.go('main', $('#mainwelcome'), ['btn-add-proj']);
	
	$( "input.choosedate" ).datepicker({
		autoSize: false,
		dateFormat: 'yy-mm-dd' ,
		monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		showWeek: true
	});
	
	/*
	var uploader = new qq.FileUploader({
		element: document.getElementById('file-uploader-demo1'),
		action: '/service/office/upload',
		debug: false,
		allowedExtensions: ['doc','xls','ppt','txt','png','gif','jpg'],
		sizeLimit: 10240000,
		onComplete: function(id, fileName, responseJSON){
			task.ui.files.push(responseJSON);
			//task.ui
			//setTimeout("$('li.qq-upload-success').fadeOut(300)", 1000);
			//office.file.addUIFile(responseJSON);
    	},
    	
    	 messages: {
             typeError: "{file} 的扩展名不符合. 只允许上传扩展名为 {extensions} 的文件.",
             sizeError: "{file} 文件太大，文件最大限制是 {sizeLimit}.",
             minSizeError: "{file} is too small, minimum file size is {minSizeLimit}.",
             emptyError: "{file} 的大小为0，无法进行上传.",
             onLeave: "文件正在上传，离开此页面将中止上传进程."            
         }
	});
	*/  
	
});

var project = {
	
	loaded: [],
	load: function() {
		
		$.getJSON("/service/key/get",
				{"r":new Date().getTime(),
					"kind":"project",
					"key":"project"
				},
				
		function(data) {
					currentUser = data.user;
					if (currentUser.indexOf('guest.')>-1) {
						//匿名用户
						$('#loginLink').show();
						$('#helloLink').hide();
					} else {
						$('#loginLink').hide();
						$('#helloLink span').html('您好 ' + currentUser);
						$('#helloLink').show();
					}
					
					project.loaded = $.parseJSON(data.value);
					
					project.ui.drawProjectList();
		});
		/*
		
		$.getJSON('/service/office/project/list', 
				{d:new Date().getTime()}, 
					function(data) {
						project.loaded = data;
						project.ui.drawProjectList();
				}
		);
		*/
	},
	
	save:function(projectData) {
		
		var updated = false;
		
		for ( var i = 0; i < project.loaded.length; i++) {
			if (project.loaded[i].id==projectData.id) {
				project.loaded[i] = projectData;
				updated = true;
				break;
			}
		}
		
		if (!updated) {
			project.loaded.push(projectData);
		}
		
		
		$.post("/service/key/update",
				{	
				"kind":"project", 
				"key": "project",
				"value": JSON.stringify(project.loaded)
				},
				function(data) {
					/*
					var result = jQuery.parseJSON(data); 
					if (projectData.id==null) {
						project.loaded.push(result);
					}
					*/
					layout.close();
					project.ui.drawAddProject(projectData);
					project.ui.refreshView(projectData);
				}
		);
	},
	
	remove: function(projectData) {
		
		project.loaded = removeFromArrayByKey(project.loaded, "id", projectData.id);
		task.loaded = removeFromArrayByKey(task.loaded, "project", projectData.id);
		task.events = removeFromArrayByKey(task.events, "project", projectData.id);
		
		for ( var i = 0; i < project.loaded.length; i++) {
			if (project.loaded[i].id==projectData.id) {
				project.loaded.splice(i,1);
				//project.loaded[i] = null;
				break;
			}
		}

		$.post("/service/key/update",
				{	
				"kind":"project", 
				"key": "events",
				"value": JSON.stringify(task.events)
				},
				function(data) {
					$.post("/service/key/update",
							{	
							"kind":"project", 
							"key": "task",
							"value": JSON.stringify(task.loaded)
							},
							function(data) {
								$.post("/service/key/update",
										{	
										"kind":"project", 
										"key": "project",
										"value": JSON.stringify(project.loaded)
										},
										function(data) {
											location.href = location.href;
										}
								);
								
							}
					);
				}
		);
		
		
		
		
	
		
		
		
	},
	
	storage: {
		projects : null,
		resources: null
	},
	
	ui : {
		refreshView: function(projectData) {
			$('#projectView div.title h2').html(projectData.name);
			$('#projectView div.desc').html(projectData.desc.replace(/\n/g,"<br>"));
			$('#projectView div.status').html(projectData.status);
			
			$('#projectView .start').html(projectData.start);
			$('#projectView .end').html(projectData.end);
		},
		currentProject: null,
		
		//点击项目， 进入展示的第二层
		openProject : function (t) {
			project.ui.currentProject = t;
			layout.go('task', $('#projectView'), ["btn-return-main", 'btn-edit-proj', 'btn-add-task']);
			
			task.list(t.id);
			project.ui.refreshView(t);
		},

		edit:function() {
			if (project.ui.currentProject!=null) {
				project.ui.dialogEdit(project.ui.currentProject);
			}
		},
		
		//显示编辑项目窗口
		dialogEdit: function (projectData) {
			if (projectData==null) {
				$('#createProjectForm input, #createProjectForm textarea').val('');
				$('#createProjectForm').data("projectData", null);
				$('#createProjectForm div.opers a').hide();
				layout.go(null, $('#createProjectForm'), ["btn-close",'btn-project-save']);
			} else {
				$('#createProjectForm .name').val(projectData.name);
				$('#createProjectForm .desc').val(projectData.desc);
				$('#createProjectForm .status').val(projectData.status);
				$('#createProjectForm .start').val(projectData.start)
				$('#createProjectForm .end').val(projectData.end);
				$('#createProjectForm .id').val(projectData.id);
				$('#createProjectForm').data('projectData', projectData);
				layout.go(null, $('#createProjectForm'), ["btn-close",'btn-project-save','btn-project-remove']);
			}
			//layout.setButton(["btn-close"]);
		},
		
		//保存项目编辑信息
		saveProject: function() {
			var projectData = $('#createProjectForm').data('projectData');
			if (projectData==null) {
				projectData = {};
				projectData.id = new Date().getTime();
			}
			projectData.name = $('#createProjectForm .name').val();
			projectData.desc = $('#createProjectForm .desc').val();
			projectData.status = $('#createProjectForm .status').val();
			projectData.start = $('#createProjectForm .start').val();
			projectData.end = $('#createProjectForm .end').val();
			project.save(projectData);
		},
		
		//绘制项目列表 
		drawProjectList: function () {
			$('div.projectItemDiv').remove();
			
			for ( var i = 0; i < project.loaded.length; i++) {
				project.ui.drawAddProject(project.loaded[i]);
			}
		},
		
		
		
		//绘制单个项目UI
		drawAddProject: function(proj) {
			var projdiv = $('#project_'+proj.id);
			if (projdiv.length==0) {
				projdiv = $('div.projectTemplate').clone();
				$('div.projectlist').after(projdiv);
				projdiv.removeClass('projectTemplate').addClass("projectItemDiv");
			}
			projdiv.attr("id", 'project_'+proj.id);
			projdiv.data('projectData', proj);
			projdiv.find('span').html(proj.name);
		
			projdiv.show();
			
			projdiv.click(function(data) {
				project.ui.openProject(projdiv.data('projectData'));
			});
		},
		
		drawRemoveProjectDiv: function (id) {
			$('#project_'+ id).remove();
		},
		
		removeProject: function() {
			var projectData = $('#createProjectForm').data('projectData');
			project.remove(projectData);
		}
		
	}

};


var task = {
	loaded : [],
	events : [],
	load: function() {
			
		$.getJSON("/service/key/get",
				{"r":new Date().getTime(),
					"kind":"project",
					"key":"task"
				},
				
				function(data) {
					task.loaded = $.parseJSON(data.value);
				});
		
		$.getJSON("/service/key/get",
				{"r":new Date().getTime(),
					"kind":"project",
					"key":"events"
				},
				
				function(data) {
					task.events = $.parseJSON(data.value);
				});
	},
	
	save:function(taskData) {
		
		var updated = false;
		
		for ( var i = 0; i < task.loaded.length; i++) {
			if (task.loaded[i].id==taskData.id) {
				task.loaded[i] = taskData;
				updated = true;
				break;
			}
		}
		
		if (!updated) {
			task.loaded.push(taskData);
		}
		
		$.post("/service/key/update",
				{	
				"kind":"project", 
				"key": "task",
				"value": JSON.stringify(task.loaded)
				},
				function(data) {
					task.ui.addOrUpdate(taskData);
					layout.close();
				}
		);
	},
	
	list: function(id) {
		var filtered = filterFromArrayByKey(task.loaded, "project", id);
		task.ui.list(filtered);
	},
	
	mark: function(taskData) {
		if (taskData.mark==null) {
			taskData.mark = true;
		} else {
			taskData.mark = !taskData.mark;
		}
		
		task.save(taskData);
	},
	
	
	
	
	getTaskEvents: function(id) {
		var filtered = filterFromArrayByKey(task.events, "task", id);
		
		task.ui.clearEvent();
		for ( var i = 0; i < filtered.length; i++) {
			task.ui.addEvent(filtered[i]);
		}
		layout.go(null, $('#taskdetails'), ['btn-return-main', 'btn-add-task', 'btn-task-edit','btn-add-message']);
	},
	
	saveEvent: function(event) {
		task.events.push(event);
		
		$.post("/service/key/update",
				{	
				"kind":"project", 
				"key": "events",
				"value": JSON.stringify(task.events)
				},
				function(data) {
					task.ui.addEvent(event);
					layout.close();
				}
		);
	},
	
	saveAttaches : function(attach) {
		$.post("/service/office/project/task/attach",
				attach,
				function(data) {
					task.ui.addEvent(jQuery.parseJSON(data));
					layout.close();
				}
		);
	},
	
	removeTask: function(tt) {
		task.loaded = removeFromArrayByKey(task.loaded, "id", tt.id);
		task.events = removeFromArrayByKey(task.events, "task", tt.id);
		
		$.post("/service/key/update",
				{	
				"kind":"project", 
				"key": "events",
				"value": JSON.stringify(task.events)
				},
				function(data) {
				}
		);
		
		$.post("/service/key/update",
				{	
				"kind":"project", 
				"key": "task",
				"value": JSON.stringify(task.loaded)
				},
				function(data) {
					layout.home();
					project.ui.openProject(project.ui.currentProject);
				}
		);
	},
	
	
	removeEvent: function(event) {
		
		task.events = removeFromArrayByKey(task.events, "id", event.id);
		
		$.post("/service/key/update",
				{	
				"kind":"project", 
				"key": "events",
				"value": JSON.stringify(task.events)
				},
				function(data) {
					task.ui.removeEventDiv(event);
				}
		);
	},

	ui : {
		
		current : null,
		
		//点击任务， 打开任务的活动，进入任务视图
		open: function(t) {
			var taskDiv = $(t);
			var taskData = taskDiv.data('taskData');
			
			if ($('#tasklist div.selected').length>0 && taskData==task.ui.current) {
				return;
			}
			
			task.ui.current = taskData;
			$('#tasklist div.item').removeClass("selected");
			taskDiv.addClass("selected");
			
			$('#taskdetails div.title h2').html(taskData.name);
			
			task.getTaskEvents(taskData.id);
		},

		//保存任务编辑信息
		save: function() {
			var taskData = {id:new Date().getTime()};
			
			if ($('#editTaskForm').data('taskData')!=null) {
				//表示更新
				taskData  = $('#editTaskForm').data('taskData');
			}
			taskData.project = $('#editTaskForm .project').val();
			taskData.name = $('#editTaskForm .name').val();
			taskData.desc = $('#editTaskForm .desc').val();
			taskData.priority = $('#editTaskForm .priority').val();
			taskData.start = $('#editTaskForm .start').val();
			taskData.end = $('#editTaskForm .end').val();
			taskData.resource = $('#editTaskForm .resource').val();
			taskData.progress = $('#editTaskForm .progress').val();
			task.save(taskData);
		},
		
		remove: function() {
			if ($('#editTaskForm').data('taskData')!=null) {
				//表示更新
				taskData  = $('#editTaskForm').data('taskData');
				task.removeTask(taskData);
			}
		},
	
		//绘制Task列表
		list: function(tasks) {
			$('#tasklist span.name').html(project.ui.currentProject.name);
			
			if (tasks.length==0) {
				$('#tasklist div.emptyInfo').show();
			}
			
			for ( var i = 0; i < tasks.length; i++) {
				task.ui.addOrUpdate(tasks[i]);
			}
		},
		
		
		
		//绘制单个增加Task
		addOrUpdate:function(taskData) {
			$('#tasklist div.emptyInfo').hide();
			var taskDiv = null;
			if ($('#task' + taskData.id).length==0) {
				taskDiv = $('div.taskItemTemplate').clone();
				$('#tasklist').append(taskDiv);
			} else {
				taskDiv = $('#task' + taskData.id);
			}
			taskDiv.removeClass('taskItemTemplate').addClass('item');
			taskDiv.attr('id', 'task' + taskData.id);
			taskDiv.find('.priority').html(taskData.priority);
			taskDiv.find('.title').html(taskData.name);
			
			taskDiv.find('.resource span').remove();
			var peoples = taskData.resource.split(" ");
			
			for ( var i = 0; i < peoples.length; i++) {
				if (peoples[i]=="") continue;
				taskDiv.find('.resource').append('<span>' + peoples[i] + "</span>");
			}			
			//taskDiv.find('.resource').html(taskData.resource);
			
			if (taskData.mark) {
				taskDiv.find('div.star div').removeClass('unmark').addClass('mark');
			} else {
				taskDiv.find('div.star div').removeClass('mark').addClass('unmark');
			}
			
			taskDiv.find('div.progress').progressbar({
				value: parseInt(taskData.progress)
			});
			taskDiv.find('div.snapshot .tj').html(taskData.progress + "%完成");
			taskDiv.data('taskData', taskData);
			taskDiv.fadeIn('fast');
		},
		
		
		//显示创建任务框
		dialogEdit : function(t) {
			
			var projectSelect = $('#editTaskForm select.project');
			projectSelect.html('');
			for ( var i = 0; i < project.loaded.length; i++) {
				projectSelect.append('<option value="' + project.loaded[i].id + '">' + project.loaded[i].name + '</option>');
			}
			
			projectSelect.val(project.ui.currentProject.id);
			
			if (t==null)  {
				$('#editTaskForm input').val('');
				$('#editTaskForm textarea').val('');
				$('#editTaskForm').data("taskData", null);
				layout.go(null, $('#editTaskForm'), ['btn-close','btn-task-save']);
			} else {
				taskData = task.ui.current;
				if (taskData!=null) {
					$('#editTaskForm').data('taskData', taskData);
					$('#editTaskForm .name').val(taskData.name);
					$('#editTaskForm .desc').val(taskData.desc);
					$('#editTaskForm .priority').val(taskData.priority);
					$('#editTaskForm .start').val(taskData.start);
					$('#editTaskForm .end').val(taskData.end);
					$('#editTaskForm .progress').val(taskData.progress);
					$('#editTaskForm .resource').val(taskData.resource);
					layout.go(null, $('#editTaskForm'), ['btn-close','btn-task-save','btn-task-remove']);
				}
			}
		},
		
		dialogAddMessage:function() {
			$('#addMessageForm input').val('');
			$('#addMessageForm textarea').val('');
			
			
			layout.go(null, $('#addMessageForm'), ['btn-close','btn-save-message']);
		},
		
		files:[],
		
		dialogAttachFile: function() {
			$('#addAttachmentForm ul.qq-upload-list li').remove();
			task.ui.files = [];
			layout.go(null, $('#addAttachmentForm'), ['btn-close','btn-save-files']);
		},
		
		saveFiles: function() {
			var message = {};
			message.type = 'files';
			
			message.project = project.ui.currentProject.id;
			message.task = task.ui.current.id;
			
			var fileids = '';
			var filenames = "";
			for ( var i = 0; i < task.ui.files.length; i++) {
				fileids += task.ui.files[i].id + ',';
				filenames += task.ui.files[i].name + ",";
			}
			
			message.info = {
					'files': fileids,
					'fileNames': filenames,
					'desc': $('#addAttachmentForm .desc').val()
			};
			
			task.saveEvent(message);
		},
		
		saveMessage : function() {
			var message = {id:new Date().getTime()};
			message.type = 'message';
			message.info = {
					'title': $('#addMessageForm input.title').val(),
					'desc':$('#addMessageForm .desc').val(),
					"created": new Date().getTime()
			};
			message.task = task.ui.current.id;
			message.project = task.ui.current.project;
			task.saveEvent(message);
		},
		
		clearEvent: function() {
			$('#taskdetails div.taskEventDiv').remove();
		},
		
		addEvent:function(event) {
			if (event.type=="message") {
				var cloned = $('div.taskMessageTemplate').clone();
				cloned.attr("id", "event_" + event.id);
				cloned.removeClass('taskMessageTemplate').addClass('taskEventDiv');
				cloned.find('div.title span').html(event.info.title);
				cloned.find('div.time').html(formateDate(event.created));
				cloned.find('div.oper').html(event.info.desc.replace(/\n/g,'<br>'));
				cloned.data('eventData', event);
				$('#taskdetails').append(cloned);
				cloned.show();
			}
			
			/*
			if (event.type=="files") {
				var cloned = $('div.taskMessageTemplate').clone();
				cloned.attr("id", "event_" + event.id);
				cloned.removeClass('taskMessageTemplate').addClass('taskEventDiv');
				
				var fileNameArray = event.info.fileNames.split(',');
				var fileIdArray = event.info.files.split(',');
				
				cloned.find('div.title span').html('附加的' + (fileNameArray.length-1) + "个文件");
				cloned.find('div.time').html(formateDate(event.created));
				
				filehtml = '';
				for ( var i = 0; i < fileIdArray.length; i++) {
					if (fileIdArray[i]=="") {
						continue;
					}
					filehtml += '<a href="/d?id=' + fileIdArray[i] + '">' + fileNameArray[i] + "</a><br>";
				}
				
				cloned.find('div.oper').html(
						filehtml + 
						event.info.desc.replace(/\n/g,'<br>'));
				cloned.data('eventData', event);
				$('#taskdetails').append(cloned);
				cloned.show();
			}
			*/
		},
		
		removeEvent:function(div) {
			var taskEventDiv = $(div).parent().parent();
			task.removeEvent(taskEventDiv.data("eventData"));
		},
		
		removeEventDiv : function(event) {
			$("#event_" + event.id).fadeIn().remove();
		},
		
		mark: function(t) {
			var p = $(t).parent().parent().parent();
			if (p.hasClass('item')) {
				task.mark(p.data("taskData"));
				
				if ($(t).hasClass('mark')) {
					$(t).removeClass('mark').addClass('unmark');
				} else{
					$(t).removeClass('unmark').addClass('mark');
				}
			}
		}
	}
};


/*

var resource = {
	load:function () {
		$.getJSON("/service/office/project/resources",
				{d:new Date().getTime()},
				function (data) {
					resource.loaded = data;
					resource.ui.drawResourceList();
		});
	},
	
	loaded: null,
	
	ui: {
		//绘制资源列表
		drawResourceList : function() {
			$('div.resourceItemDiv').remove();
			for ( var i = 0; i < resource.loaded.length; i++) {
				resource.ui.drawAddResource(resource.loaded[i]);
			}
		},
		//绘制单个Resource UI
		drawAddResource: function(name) {
			var projdiv = $('div.projectTemplate').clone();
			$('div.resourceList').after(projdiv);
			projdiv.removeClass('projectTemplate').addClass("resourceItemDiv");
			projdiv.find('span').html(name);
		
			projdiv.show();
			
			projdiv.click(function(data) {
				//project.ui.openProject(projdiv.data('projectData'));
			});
		},
		
	}
};

*/
var layout = {
	go: function(left, right, btn) {
		if (left=="main") {
			$('#toplist').show();
			$('#tasklist').hide();
		} 
		if (left=="task") {
			$('#toplist').hide();
			$('#tasklist').show();
		}
		
		layout.right.setCurrent(right);
		layout.setButton(btn);
	},
	
	btns:[],
	
	close: function() {
		layout.right.popCurrent();
		layout.btns.pop();
		var btn = layout.btns.pop();
		layout.setButton(btn);
	} ,
	
	right : {
		//设置右边当前呈现的层
		setCurrent : function (data) {
			layout.right.currentContent = data;
			
			if (layout.right.contentStacks[layout.right.contentStacks.length-1]!=data) {
				layout.right.contentStacks.push(data);
			}
			
			$('div.right .content').hide();
			data.fadeIn('fast');
		},
		//Pop当前在右边显示的层 
		popCurrent: function () {
			if (layout.right.contentStacks.length>1) {
				layout.right.contentStacks.pop();
				layout.right.setCurrent(layout.right.contentStacks.pop());
			}
		},
		currentContent: null,
		contentStacks: []
	},
	
	setButton:function(btn) {
		$('button.lbtn, button.rbtn').hide();
		layout.btns.push(btn);
		for ( var i = 0; i < btn.length; i++) {
			$('#' + btn[i]).show();
		}
	},
	
	//点击返回到主页面
	home : function () {
		layout.go('main', $('#mainwelcome'), ['btn-add-proj']);
		$('#tasklist div.item').remove();
		$('div.selected').removeClass('selected');
	}
};


function formateDate(str) {
		var dd = new Date(str);
		return dd.getFullYear() + "-" + (dd.getMonth()+1) + "-" + dd.getDate()  + "   " + dd.getHours() + ":" + ((dd.getMinutes()<10)?("0" + dd.getMinutes()):dd.getMinutes()); 
}


var currentUser = null;

function initUserInfo() {
	$.getJSON("/service/authority/current", {"r":new Date().getTime()}, 
			function(data) {
				currentUser = data.userName;
				if (data.userName.indexOf('guest.')>-1) {
					//location.href="/office/login.jsp?redirectTo=/office/project/index.html";
					//匿名用户
					$('#loginLink').show();
					$('#helloLink').hide();
				} else {
					$('#loginLink').hide();
					$('#helloLink span').html('您好 ' + data.userName);
					$('#helloLink').show();
				}
	}
	);
}

function filterFromArrayByKey(array, key, value) {
	var dumped = [];
	for ( var i = 0; i < array.length; i++) {
		if (array[i][key]==value) {
			dumped.push(array[i]);
		} else {
			
		}
	}
	return dumped;
}

var JSON;if(!JSON)JSON={};(function(){var n="number",m="object",l="string",k="function";"use strict";function f(a){return a<10?"0"+a:a}if(typeof Date.prototype.toJSON!==k){Date.prototype.toJSON=function(){var a=this;return isFinite(a.valueOf())?a.getUTCFullYear()+"-"+f(a.getUTCMonth()+1)+"-"+f(a.getUTCDate())+"T"+f(a.getUTCHours())+":"+f(a.getUTCMinutes())+":"+f(a.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b===l?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(i,j){var f="null",c,e,d,g,h=gap,b,a=j[i];if(a&&typeof a===m&&typeof a.toJSON===k)a=a.toJSON(i);if(typeof rep===k)a=rep.call(j,i,a);switch(typeof a){case l:return quote(a);case n:return isFinite(a)?String(a):f;case"boolean":case f:return String(a);case m:if(!a)return f;gap+=indent;b=[];if(Object.prototype.toString.apply(a)==="[object Array]"){g=a.length;for(c=0;c<g;c+=1)b[c]=str(c,a)||f;d=b.length===0?"[]":gap?"[\n"+gap+b.join(",\n"+gap)+"\n"+h+"]":"["+b.join(",")+"]";gap=h;return d}if(rep&&typeof rep===m){g=rep.length;for(c=0;c<g;c+=1)if(typeof rep[c]===l){e=rep[c];d=str(e,a);d&&b.push(quote(e)+(gap?": ":":")+d)}}else for(e in a)if(Object.prototype.hasOwnProperty.call(a,e)){d=str(e,a);d&&b.push(quote(e)+(gap?": ":":")+d)}d=b.length===0?"{}":gap?"{\n"+gap+b.join(",\n"+gap)+"\n"+h+"}":"{"+b.join(",")+"}";gap=h;return d}}if(typeof JSON.stringify!==k)JSON.stringify=function(d,a,b){var c;gap="";indent="";if(typeof b===n)for(c=0;c<b;c+=1)indent+=" ";else if(typeof b===l)indent=b;rep=a;if(a&&typeof a!==k&&(typeof a!==m||typeof a.length!==n))throw new Error("JSON.stringify");return str("",{"":d})};if(typeof JSON.parse!==k)JSON.parse=function(text,reviver){var j;function walk(d,e){var b,c,a=d[e];if(a&&typeof a===m)for(b in a)if(Object.prototype.hasOwnProperty.call(a,b)){c=walk(a,b);if(c!==undefined)a[b]=c;else delete a[b]}return reviver.call(d,e,a)}text=String(text);cx.lastIndex=0;if(cx.test(text))text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse");}})();


function removeFromArrayByKey(array, key, value) {
	var dumped = [];
	for ( var i = 0; i < array.length; i++) {
		if (array[i][key]==value) {
			
		} else {
			dumped.push(array[i]);
		}
	}
	return dumped;
}