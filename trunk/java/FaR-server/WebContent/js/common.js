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
		
		$('button.tbtn').hide();
		layout.showRelatedBtns(left);
		layout.showRelatedBtns(right);
	},
	
	showRelatedBtns: function(div) {
		if (div.attr('btns')!=null) {
			var lbtns = div.attr('btns').split(',');
			for ( var i = 0; i < lbtns.length; i++) {
				if (lbtns!="") {
					$('#' + lbtns[i]).show();
				}
			}
		}
	}, 
	
	popCurrent : function () {
		
		var v = layout.viewstacks.pop();
		if (layout.viewstacks.length>0) {
			v = layout.viewstacks[layout.viewstacks.length-1];
		}
		
		if (v.left!=layout.current.left) {
			layout.hideview(layout.current.left);
			layout.showview(v.left);
		};
		
		if (v.right!=layout.current.right) {
			layout.hideview(layout.current.right);
			layout.showview(v.right);
		};
		layout.current = v;
		layout.viewstacks.push(v);
		
		$('button.tbtn').hide();
		layout.showRelatedBtns(v.left);
		layout.showRelatedBtns(v.right);
	},

	
	hideview: function(div) {
		$(div).slideUp('fast');
	},
	showview: function(div) {
		$(div).slideDown('fast');
	},
	
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

var local = {
		updated: {},
		collections: {},
		getCollection: function(name) {
			if (local.collections[name]!=null) {
				var coll = [];
				for ( var i = 0; i < localStorage.length; i++) {
					var key = localStorage.key(i);
					if (key.indexOf(name+ '-')==0) {
						coll.push(localStorage.getItem(key));
					}
				}
				local.collections[name] = coll;
			}
			return local.collections[name];
		}
};

function Collection(name)  {
	this.name = name;
	this.list = [{parent:"aa"}];
	
	this.add = function(o) {
		this.list.push(o);
	};

	
	
	this.find = function(query) {
		var result = [];
		for ( var i = 0; i < this.list.length; i++) {
			var o = this.list[i];
			var matched = true;
			for (var q in query) {
				if (o[q]!=query[q]) {
					matched = false;
					break;
				} 
			}
			if (matched) {
				result.push(o);
			}
		}
		return result;
	};
}
