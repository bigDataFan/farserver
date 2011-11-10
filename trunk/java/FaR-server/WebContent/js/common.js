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


var ie6sync = false;
var syncinit = false;
function synchronize(db, dbname, username) {
	
	//获取最近和服务器更新联系的时间
	var updated = $.cookie(username + "." + dbname + ".updated");
	if (updated==null) {
		updated = 0;
	} else {
		updated = parseInt(updated);
	}
	//IE6未同步的情况下
	if (!ie6sync && isIE6()) {
		updated = 0;
	}
	var currentTime = new Date().getTime();
	var newer = db().filter({"updated":{'gt': updated}});
	
	if (syncinit && newer.count()==0) {
		setTimeout(function(){
    		synchronize(db, dbname, username)
    	}, 10000);
		return;
	}
	$.post("/service/db/sync",
			{
				'updated': updated,
				'db': dbname,
				'list': newer.stringify()
		    },  function(data) {
		    	var result = $.parseJSON(data);
		    	
		    	for ( var j = 0; j < result.gotten.length; j++) {
		    		db.insert(result.gotten[j]);
				}
		    	
		    	for ( var id in result.added) {
		    		db(id).update({'_id': result.added[id]});
				}

		    	for ( var id in result.removed) {
		    		db(id).remove();
				}
		    	$.cookie(username + "." + dbname + ".updated", currentTime);
		    	
		    	syncinit = true;
		    	setTimeout(function(){
		    		synchronize(db, dbname, username)
		    	}, 10000);
		    }
	);
}

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


var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && (typeof date == "string" || date instanceof String) && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date();
		if (isNaN(date)) throw new SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

