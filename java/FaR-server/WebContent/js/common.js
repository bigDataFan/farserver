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
		$(div).hide();
		//$(div).slideUp('fast');
	},
	showview: function(div) {
		$(div).show();
		//$(div).slideDown('fast');
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



var sync = {
		dbnames:[],
		dbs: [],
		request:0,
		connecting: false,
		doUpdate: function() {
			if (sync.connecting) {
				return;
			}
			sync.connecting = true;
			
			var updated = $.cookie("updated");
			if (updated==null) {
				updated = 0;
			} else {
				updated = parseInt(updated);
			}
			
			sync.request = 0;
			
			for ( var i = 0; i < sync.dbs.length; i++) {
				var newer = sync.dbs[i]().filter({"updated":{'gt': updated}});
				
				var currentIndex = i;
				if (newer.count()>0) {
					$.post("/service/db/sync",
							{
								'updated': updated,
								'db': sync.dbnames[i],
								'list': newer.stringify()
						    },  function(data) {
						    	sync.request ++;
						    	var result = $.parseJSON(data);
						    	
						    	for ( var j = 0; j < result.gotten.length; j++) {
						    		sync.dbs[currentIndex].insert(result.gotten[j]);
								}
						    	
						    	for ( var id in result.ids) {
						    		sync.dbs[currentIndex]({___id: id}).update({_id: result.ids[id]});
								}

						    	for ( var id in result.removed) {
						    		sync.dbs[currentIndex]({_id: id}).remove();
								}
						    	
						    	if (sync.request==sync.dbs.length) {
									sync.connecting = false;
									$.cookie("updated", new Date().getTime());
								}
						    }
					);
				} else {
					sync.request ++;
				}
			}
			
			if (sync.request==sync.dbs.length) {
				sync.connecting = false;
			}
		}
};


jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};


function isIE6() {
	return jQuery.browser.msie && jQuery.browser.version=="6.0";
}

