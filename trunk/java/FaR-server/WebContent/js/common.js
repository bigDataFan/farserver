var layout = {
	current : {
		left: null,
		right:null
	},
	viewstacks : new Array(),
	//当前的左右信息
	pushCurrent : function (left, right) {
		var newview = {'left': left, 'right':right};
		if (left!=layout.current.left) {
			layout.hideview(layout.current.left);
			layout.showview(left);
		};
		
		if (right!=layout.current.right) {
			layout.hideview(layout.current.right);
			layout.showview(right);
		};
		layout.viewstacks.push(newview);
		layout.current = newview;
	},
	
	popCurrent : function () {
		var v = layout.viewstacks.pop();
		
		if (v.left!=layout.current.left) {
			layout.hideview(layout.current.left);
			layout.showview(v.left);
		};
		
		if (v.right!=layout.current.right) {
			layout.hideview(layout.current.right);
			layout.showview(v.right);
		};
		layout.current = v;
	},

	
	hideview: function(div) {
		$(div).slideUp();
	},
	showview: function(div) {
		$(div).slideDown();
	},
	
	btns:[],
	
	back: function() {
		layout.popCurrent();
	} ,
	
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
