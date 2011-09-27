/**
 * 
 */

$(document).ready(function(){
	
	project.ui.setCurrent($('#mainwelcome'));
	
	project.load();
});

var project = {
	
	load: function() {
		
		$.getJSON('/service/office/project/list', 
				{d:new Date().getTime()}, 
					function(data) {
						project.storage.projects = data;
						$.getJSON("/service/office/project/resources",
							{d:new Date().getTime()},
							function (data) {
								project.storage.resources = data;
								project.ui.drawProjectList();
								project.ui.drawResourceList();
						})
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
						project.ui.addProject(data);
					}
			);
		}
	},

	
	saveTask:function(task) {
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
	
	updateTask: function(taskData,cb) {
		$.post("/service/office/project/task/update",
				taskData, 
				cb);
	},
	
	listTask: function(id) {
		$.getJSON("/service/office/project/task/list",
				{
					"project":id,
					"n": new Date().getTime() 
				}, function (data) {
					project.ui.drawTaskList(data);
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
	
	storage: {
		projects : null,
		resources: null
	},
	
	ui : {
		//点击返回到主页面
		returnHome : function () {
			project.ui.popCurrent();
			$('button.mainbtn').show();
			$('button.return').hide();
		},
		
		
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
		drawProjectEdit: function (projectData) {
			$('#createProjectForm .name').val(projectData.name);
			$('#createProjectForm .desc').val(projectData.desc);
			$('#createProjectForm .status').val(projectData.status);
			$('#createProjectForm .start').val(projectData.start)
			$('#createProjectForm .end').val(projectData.end);
			$('#createProjectForm .id').val(projectData.id);
			$('#createProjectForm').data('projectData', projectData);
			project.ui.setCurrent($('#createProjectForm'));
		},
		
		//绘制资源列表
		drawResourceList : function() {
			
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
		
		//绘制Task列表
		drawTaskList: function(tasks) {
			for ( var i = 0; i < tasks.length; i++) {
				
			}
		},
		
		//绘制单个增加Task
		drawAddOneTask:function(task) {
			var cloned = $('div.taskItemTemplate').clone();
			
			cloned.find('priority').html(task.priority);
			cloned.find('name').html(task.name);
			cloned.find('resource').html(task.resource);
			
			$('#tasklist').append(cloned);
			cloned.fadeIn('fast');
		},
		
		
		//显示创建项目框
		drawCreateProject: function() {
			$('#createProjectForm input, #createProjectForm textarea').val('');
			$('#createProjectForm').data("projectData", null);
			project.ui.setCurrent($('#createProjectForm'));
		},
		
		
		
		//显示创建任务框
		drawAddTask : function(projname) {
			$('#editTaskForm input #editTaskForm textarea').val('');
			$('##editTaskForm').data("taskData", null);
			project.ui.setCurrent($('#editTaskForm'));
		},
		
		//设置右边当前呈现的层
		setCurrent : function (data) {
			project.ui.currentContent = data;
			project.ui.contentStacks.push(data);
			$('div.right .content').slideUp("fast");
			data.slideDown('fast');
		},
		//Pop当前在右边显示的层 
		popCurrent: function () {
			if (project.ui.contentStacks.length>1) {
				project.ui.contentStacks.pop();
				project.ui.setCurrent(project.ui.contentStacks.pop());
			}
		},
		
		currentContent: null,
		
		contentStacks: [],
		
		
		saveProgressNotes: function() {
			
		} ,
		
		saveMessage: function() {
			
		},
		
		saveFile:function() {
			
		},

		//保存任务编辑信息
		saveTask: function() {
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
			project.saveTask(taskData);
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
			} else {
				var proj = $('#createProjectForm').data('projectData');
				proj.name = $('#createProjectForm .name').val();
				proj.desc = $('#createProjectForm .desc').val();
				proj.status = $('#createProjectForm .status').val();
				proj.start = $('#createProjectForm .start').val();
				proj.end = $('#createProjectForm .end').val();
				
				project.save(proj, project.ui.popCurrent());
			}
		}
	}

};


$('#ajaxInfos').ajaxSend(function() {
	$(this).text('正在发送请求');
});