var more = new Object();

$(document).ready(function(){
});


more.showMenu = function() {
	$('#menu1').slideDown('fast');
	
	$('#menu1').hover(function(data){},
			function(data){
			$('#menu1').slideUp('fast');
			}
	);
};

var money = {
		cloneSubitem: function() {
			var cloned =  $('#subitemlist li.forclone').clone();
			cloned.removeClass('forclone').show();
			
			cloned.find('a.delete').click(
					function() {
						cloned.remove();
					}
			);
			$('#subitemlist').append(cloned);
		},
		
		showSingle: function() {
			$('div.outcometype').hide();
			$('#single').slideDown('fast');
		},

		showMulti: function() {
			$('div.outcometype').hide();
			$('#multi').slideDown('fast');
		}
		
};




var category = {
		addRoot: function() {
			var ul = $('ul.category');
			category.showEdit(ul, true);
		},
		
		showEdit: function(p,c) {
			var n = $('<li><h3><input type="text" class="nname"><a href="javascript:void(0)">保存</a></h3></li>');
			$(p).append(n);
			
			n.find('a').click(function(data) {
				var li = $(this).parent().parent();
				category.editSave(li, c);
			});
		},
		
		editSave: function(li, c) {
			var v = li.find('input').val();
			li.data('v',v);
			li.html('<h3>' + v + '<span class="oper"><a href="javascript:void(0)" class="edit">编辑</a><a href="javascript:void(0)" class="delete">删除</a> '
					+ (c?'<a href="javascript:void(0)" class="addchild">增加子类</a>':'') + '</span>' + '</h3>');
			if (c) {
				li.addClass('parent');
			} else {
				li.addClass('sub');
			}
			
			li.find('a.edit').click(
					function(data) {
						
					}
			);
			
			li.find('a.delete').click(
					function(data) {
						var li = $(this).parent().parent().parent();
						li.remove();
					}
			);
			
			li.find('a.addchild').click(
					function(data) {
						var li = $(this).parent().parent().parent();
						category.showEdit(li, false);
					}
			);
			
			
			li.hover(
					function(){
						$(this).find('span').show();
					}, 
					function() {
						$(this).find('span').hide();
					}
			);
			
		}
};

