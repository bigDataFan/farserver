/**
 * 
 */

$(document).ready(function(){
	project.load();
	//resource.load();
	layout.go('main', $('#mainwelcome'), ['btn-add-proj']);
	
	$( "input.choosedate" ).datepicker({
		autoSize: false,
		dateFormat: 'yy-mm-dd' ,
		monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		showWeek: true
	});
	
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
	
});

var project = {
	
	loaded: [],
	load: function() {
		
		$.getJSON('/service/office/project/list', 
				{d:new Date().getTime()}, 
					function(data) {
						project.loaded = data;
						project.ui.drawProjectList();
				}
		);
	},
	
	save:function(projectData) {
		$.post("/service/office/project/update",
				projectData,
				function(data) {
					var result = jQuery.parseJSON(data); 
					if (projectData.id==null) {
						project.loaded.push(result);
					}
					layout.close();
					project.ui.drawAddProject(result);
					project.ui.refreshView(result);
				}
		);
	},
	
	remove: function(projectData) {
		$.post("/service/office/project/remove",
				{'id':projectData.id},
				function(data) {
					location.href = location.href;
				});
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
	save: function(taskData) {
		$.post("/service/office/project/task/update",
				taskData, 
				function(data){
					var result = jQuery.parseJSON(data);
					task.ui.addOrUpdate(result);
					layout.close();
				});
	},
	
	list: function(id) {
		$.getJSON("/service/office/project/task/list",
				{
					"project":id,
					"n": new Date().getTime() 
				}, function (data) {
					task.ui.list(data);
				});
	},
	
	mark: function(taskData) {
		
	},
	
	getTaskEvents: function(id) {
		$.getJSON("/service/office/project/task/events",
				{	"task":id, "n": new Date().getTime() },
				function(data) {
					task.ui.clearEvent();
					for ( var i = 0; i < data.length; i++) {
						task.ui.addEvent(data[i]);
					}
					layout.go(null, $('#taskdetails'), ['btn-return-main', 'btn-add-task', 'btn-task-edit','btn-add-message','btn-attach-file']);
				}
		);
	},
	
	saveEvent: function(event) {
		$.post("/service/office/project/task/eventSave",
				event,
				function(data) {
					task.ui.addEvent(jQuery.parseJSON(data));
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
	
	removeTask: function(task) {
		$.post("/service/office/project/task/remove", 
				{'id': task.id},
				function(data) {
					layout.home();
					project.ui.openProject(project.ui.currentProject);
				});
	},
	removeEvent: function(event) {
		$.post("/service/office/project/task/removeevent", 
				{'id': event.id},
				function(data) {
					task.ui.removeEventDiv(event);
				});
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
			task.getTaskEvents(taskData.id);
		},

		//保存任务编辑信息
		save: function() {
			var taskData = new Object();
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
			for ( var i = 0; i < taskData.resource.length; i++) {
				taskDiv.find('.resource').append('<span>' + taskData.resource[i] + "</span>");
			}			
			//taskDiv.find('.resource').html(taskData.resource);
			
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
				$('#editTaskForm input #editTaskForm textarea').val('');
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
			$('#addMessageForm input  #addMessageForm textarea').val('');
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
			var message = {};
			message.type = 'message';
			message.info = {
					'title': $('#addMessageForm input.title').val(),
					'desc':$('#addMessageForm .desc').val()
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
		return dd.getFullYear() + "-" + (dd.getMonth()+1) + "-" + dd.getDate()  + "   " + dd.getHours() + ":" + dd.getMinutes(); 
}


$('#ajaxInfos').ajaxSend(function() {
	$(this).text('正在发送请求');
});