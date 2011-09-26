/**
 * 
 */

$(document).ready(function(){
	
	project.ui.setCurrent($('#mainwelcome'));
	project.ui.drawProjectList();
	
	//project.ui.slideback();
	
});

var project = {
		
	
	open:function() {
		$('#toplist').fadeOut();
	},
	
	
	save:function(proj, cb) {
		if (proj.id==null) {
			$.post("/service/office/project/update",
					proj,
					function(data) {
						project.ui.popCurrent();
						project.ui.addProject(data);
					}
			);
		} else {
			$.post("/service/office/project/update",
					proj,
					function(data) {
						project.ui.popCurrent();
						project.ui.addProject(data);
					}
			);
		}
	},

	
	
	
	list: function(cb) {

		$.getJSON('/service/office/project/list', 
				{d:new Date().getTime()}, cb
		);
	},
	
	ui : {
		
		openProject : function (t) {
			project.ui.drawProjectEdit(t);
			project.ui.drawTasks(t.id);
		},
		
		
		
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
		
		drawProjectList: function () {
			project.list(function(data) {
				for ( var i = 0; i < data.length; i++) {
					project.ui.addProject(data[i]);
				}
			});
		},
		
		
		addProject: function(proj) {
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
		
		
		setCurrent : function (data) {
			project.ui.currentContent = data;
			project.ui.contentStacks.push(data);
			$('div.right .content').slideUp("fast");
			data.slideDown('fast');
		},
		

		createProject: function() {
			$('#createProjectForm input, #createProjectForm textarea').val('');
			$('#createProjectForm').data("projectData", null);
			project.ui.setCurrent($('#createProjectForm'));
		},
		
		editProject: function(proj) {
			
		},
		
		popCurrent: function () {
			if (project.ui.contentStacks.length>1) {
				project.ui.contentStacks.pop();
				project.ui.setCurrent(project.ui.contentStacks.pop());
			}
		},
		
		currentContent: null,
		
		contentStacks: [],
		
		saveClose: function() {
			
			if ($('#createProjectForm').data('projectData')==null) {
				var new_proj = {
						name: $('#createProjectForm .name').val(),
						desc: $('#createProjectForm .desc').val(),
						status: $('#createProjectForm .status').val(),
						start: $('#createProjectForm .start').val(),
						end: $('#createProjectForm .end').val()				
				};
				project.save(new_proj, project.ui.popCurrent());
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
