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
			category.ui.addSub(ul);
		},
		ui : {
			addSub : function(p) {
				var n = $('<li><h3><input type="text" class="nname"><a href="javascript:void(0)">保存</a></h3></li>');
				$(p).append(n);
				n.find('a').click(function(data) {
					var parent = $(this).parent().parent();
					var v = parent.find('input').val();
					parent.html('<h3>' + v + '<span class="oper"><a href="javascript:void(0)">编辑</a><a href="javascript:void(0)">删除</a> <a href="javascript:void(0)">增加子类</a></span>' + '</h3>');
					parent.hover(
							function(){
								$(this).find('span').show();
							}, 
							function() {
								$(this).find('span').hide();
							}
					);
					
				});
			}	
		}
};

