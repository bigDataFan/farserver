/**
 * 
 */

$(document).ready(function(){
	project.load();
	resource.load();
	layout.home();
});

var project = {
	
	load: function() {
		
		$.getJSON('/service/office/project/list', 
				{d:new Date().getTime()}, 
					function(data) {
						project.storage.projects = data;
						project.ui.drawProjectList();
				}
		);
	},
	
	open:function() {
		$('#toplist').fadeOut();
	},
	
	
	save:function(proj) {
		if (proj.id==null) {
			$.post("/service/office/project/update",
					proj,
					function(data) {
						project.storage.projects.push(data);
						project.ui.drawAddProject(data);
					}
			);
		} else {
			$.post("/service/office/project/update",
					proj,
					function(data) {
					}
			);
		}
	},
	
	
	storage: {
		projects : null,
		resources: null
	},
	
	ui : {
		
		//点击项目， 进入展示的第二层
		openProject : function (t) {
			//project.ui.drawProjectEdit(t);
			$('button.mainbtn').hide();
			$('button.return').show();
			project.ui.drawTasks(t.id);
		},
		
		drawTasks: function(id) {
			
		},

		//显示编辑项目窗口
		dialogEdit: function (projectData) {
			if (projectData==null) {
				$('#createProjectForm input, #createProjectForm textarea').val('');
				$('#createProjectForm').data("projectData", null);
				$('#createProjectForm div.opers a').hide();
				
			} else {
				$('#createProjectForm .name').val(projectData.name);
				$('#createProjectForm .desc').val(projectData.desc);
				$('#createProjectForm .status').val(projectData.status);
				$('#createProjectForm .start').val(projectData.start)
				$('#createProjectForm .end').val(projectData.end);
				$('#createProjectForm .id').val(projectData.id);
				$('#createProjectForm').data('projectData', projectData);
			}
			
			layout.right.setCurrent($('#createProjectForm'));
		},
		
		//保存项目编辑信息
		saveProject: function() {
			
			if ($('#createProjectForm').data('projectData')==null) {
				var new_proj = {
						name: $('#createProjectForm .name').val(),
						desc: $('#createProjectForm .desc').val(),
						status: $('#createProjectForm .status').val(),
						start: $('#createProjectForm .start').val(),
						end: $('#createProjectForm .end').val()				
				};
				project.save(new_proj);
				$('#createProjectForm').data('projectData', new_proj);
			} else {
				var proj = $('#createProjectForm').data('projectData');
				proj.name = $('#createProjectForm .name').val();
				proj.desc = $('#createProjectForm .desc').val();
				proj.status = $('#createProjectForm .status').val();
				proj.start = $('#createProjectForm .start').val();
				proj.end = $('#createProjectForm .end').val();
				
				project.save(proj, project.ui.popCurrent());
			}
		},
		
		
		
		//绘制项目列表 
		drawProjectList: function () {
			for ( var i = 0; i < project.storage.projects.length; i++) {
				project.ui.drawAddProject(project.storage.projects[i]);
			}
		},
		
		//绘制单个项目UI
		drawAddProject: function(proj) {
			var projdiv = $('div.projectTemplate').clone();
			projdiv.removeClass('projectTemplate');
			projdiv.data('projectData', proj);
			projdiv.find('span').html(proj.name);
			$('div.projectlist').after(projdiv);
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
				function(){
					task.ui.addOrUpdate();
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
	
	
	
	getTaskEvents: function(id) {
		$.getJSON("/service/office/project/task/events",
				{	"id":id, "n": new Date().getTime() },
				function(data) {
					project.ui.drawTaskEvents(data);
				}
		);
	},
	
	ui : {
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
			for ( var i = 0; i < tasks.length; i++) {
				
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
			
			
			taskDiv.find('priority').html(taskData.priority);
			taskDiv.find('name').html(taskData.name);
			taskDiv.find('resource').html(taskData.resource);
			
			cloned.fadeIn('fast');
		},
		
		//显示创建任务框
		editDialog : function(projname, taskData) {
			if (taskData==null)  {
				$('#editTaskForm input #editTaskForm textarea').val('');
				$('##editTaskForm').data("taskData", null);
				project.ui.setCurrent($('#editTaskForm'));
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
	
	setButton:function(btns) {
		$('button.lbtn, button.rbtn').hide();
		for ( var i = 0; i < btns.length; i++) {
			$('#' + btns[i]).show();
		}
	},
	
	//点击返回到主页面
	home : function () {
		$('#tasklist').fadeOut();
		$('#toplist').fadeIn();
		layout.right.setCurrent($('#mainwelcome'));
		layout.setButton(['btn-add-proj','btn-add-res']);
	}
	
	
}

$('#ajaxInfos').ajaxSend(function() {
	$(this).text('正在发送请求');
});