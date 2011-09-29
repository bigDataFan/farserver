/**
 * 
 */

$(document).ready(function(){
	project.load();
	resource.load();
	layout.go('main', $('#mainwelcome'), ['btn-add-proj','btn-add-res']);
	
	
	$( "input.choosedate" ).datepicker({
		autoSize: false,
		dateFormat: 'yy-mm-dd' ,
		monthNames:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		showWeek: true
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
						project.loaded.push(data);
					}
					layout.close();
					project.ui.drawAddProject(result);
					project.ui.refreshView(result);
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
				projdiv.removeClass('projectTemplate');
			}
			projdiv.attr("id", 'project_'+proj.id);
			projdiv.data('projectData', proj);
			projdiv.find('span').html(proj.name);
		
			projdiv.show();
			
			projdiv.click(function(data) {
				project.ui.openProject(projdiv.data('projectData'));
			});
		},
		
		saveProgressNotes: function() {
			
		} ,
		
		saveMessage: function() {
			
		},
		
		saveFile:function() {
			
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
				{	"id":id, "n": new Date().getTime() },
				function(data) {
					project.ui.drawTaskEvents(data);
				}
		);
	},
	
	saveEvent: function(event) {
		$.post("/service/office/project/task/eventSave",
				event,
				function(data) {
					task.ui.addEvent(jQuery.parseJSON(data));
				}
		);
	},
	
	listEvent: function(taskid) {
		$.getJSON('/service/office/project/task/eventList',
				{'id':taskid, 'n':new Date().getTime()},
				function(data) {
					for ( var i = 0; i < data.length; i++) {
						task.ui.addEvent(data[i]);
					}
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
			layout.go(null, $('#taskdetails'), ['btn-return-main', 'btn-add-task', 'btn-task-edit','btn-add-message','btn-set-progress','btn-attach-file']);
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
	
		//绘制Task列表
		list: function(tasks) {
			//$('#tasklist').html('');
			for ( var i = 0; i < tasks.length; i++) {
				task.ui.addOrUpdate(tasks[i]);
			}
		},
		
		//绘制单个增加Task
		addOrUpdate:function(taskData) {
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
			taskDiv.find('.resource').html(taskData.resource);
			
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
					layout.go(null, $('#editTaskForm'), ['btn-close','btn-task-save','btn-task-remove']);
				}
			}
		},
		
		dialogAddMessage:function() {
			$('#addMessageForm input  #addMessageForm textarea').val('');
			layout.go(null, $('#addMessageForm'), ['btn-close','btn-save-message']);
		},
		saveMessage : function() {
			var msssage = {};
			message.title = $('#addMessageForm .title').val();
			message.desc = $('#addMessageForm .desc').val();
			task.saveEvent(message);
		},
		
		addEvent:function(event) {
			
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
	
	save:function(task) {
		if (task.id==null) {
			$.post("/service/office/project/updateTask",
					task,
					function(data) {
						project.ui.drawUpdateTask(data);
					}
			);
		} else {
			$.post("/service/office/project/updateTask",
					task,
					function(data) {
						project.ui.drawAddTask(data);
					}
			);
		}
	},
	
	ui: {
		//绘制资源列表
		drawResourceList : function() {
			
		}
	}
};


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
		layout.go('main', $('#mainwelcome'), ['btn-add-proj','btn-add-res']);
		
		$('div.selected').removeClass('selected');
	}
	
	
	
}

$('#ajaxInfos').ajaxSend(function() {
	$(this).text('正在发送请求');
});