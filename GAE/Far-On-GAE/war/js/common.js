var layout = {
	current : {
		left: null,
		right:null
	},
	dividerloc: 0,
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
		if ($(div).parent().hasClass('left')) {
			$(div).slideUp();
		} else {
			$(div).hide();
		}
		//$(div).slideUp('fast');
	},
	showview: function(div) {
		if ($(div).parent().hasClass('left')) {
			$(div).slideDown();
		} else {
			//$(div).fadeIn();
			$(div).show();
		}
		
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
	},
	rememberedBtns : [],
	switchRightFull: function() {
		$('#switchBackBtn').show();
		$('#btn-return-main').hide();
		layout.current.left.parent().hide();
		layout.current.right.parent().css("left", "0px");
	},
	
	switchDividedView: function () {
		$('#btn-return-main').show();
		$('#switchBackBtn').hide();
		layout.current.left.parent().show();
		layout.current.right.parent().css("left", layout.dividerloc + "px");
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


function getTax(A) {
	if((A-3500)<1500) return 0.03*(A-3500);
	if((A-3500)<4500) return 0.1*(A-3500)-105;
	if((A-3500)<9000) return 0.2*(A-3500)-555; 
	if((A-3500)<35000) return 0.25*(A-3500)-1005;
	if((A-3500)<55000) return 0.3*(A-3500)-2755; 
	if((A-3500)<80000) return 0.35*(a-3500)-5505;
	return 0.45*(A-3500)-13505; 
}

function getFloorTax(A) {
	return Math.floor(getTax(A));
}

function getDate(s) {
	var abs = s.split(' ');
	var days = abs[0].split("-");
	var date = new Date();
	date.setFullYear(days[0], parseInt(days[1])-1, days[2]);
	
	if (abs.length>1) {
		var hours = abs[1].split(":");
		date.setHours(hours[0], hours[1], hours[2], 0);
	}
	return date;
}

var JSON;if(!JSON)JSON={};(function(){var n="number",m="object",l="string",k="function";"use strict";function f(a){return a<10?"0"+a:a}if(typeof Date.prototype.toJSON!==k){Date.prototype.toJSON=function(){var a=this;return isFinite(a.valueOf())?a.getUTCFullYear()+"-"+f(a.getUTCMonth()+1)+"-"+f(a.getUTCDate())+"T"+f(a.getUTCHours())+":"+f(a.getUTCMinutes())+":"+f(a.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b===l?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(i,j){var f="null",c,e,d,g,h=gap,b,a=j[i];if(a&&typeof a===m&&typeof a.toJSON===k)a=a.toJSON(i);if(typeof rep===k)a=rep.call(j,i,a);switch(typeof a){case l:return quote(a);case n:return isFinite(a)?String(a):f;case"boolean":case f:return String(a);case m:if(!a)return f;gap+=indent;b=[];if(Object.prototype.toString.apply(a)==="[object Array]"){g=a.length;for(c=0;c<g;c+=1)b[c]=str(c,a)||f;d=b.length===0?"[]":gap?"[\n"+gap+b.join(",\n"+gap)+"\n"+h+"]":"["+b.join(",")+"]";gap=h;return d}if(rep&&typeof rep===m){g=rep.length;for(c=0;c<g;c+=1)if(typeof rep[c]===l){e=rep[c];d=str(e,a);d&&b.push(quote(e)+(gap?": ":":")+d)}}else for(e in a)if(Object.prototype.hasOwnProperty.call(a,e)){d=str(e,a);d&&b.push(quote(e)+(gap?": ":":")+d)}d=b.length===0?"{}":gap?"{\n"+gap+b.join(",\n"+gap)+"\n"+h+"}":"{"+b.join(",")+"}";gap=h;return d}}if(typeof JSON.stringify!==k)JSON.stringify=function(d,a,b){var c;gap="";indent="";if(typeof b===n)for(c=0;c<b;c+=1)indent+=" ";else if(typeof b===l)indent=b;rep=a;if(a&&typeof a!==k&&(typeof a!==m||typeof a.length!==n))throw new Error("JSON.stringify");return str("",{"":d})};if(typeof JSON.parse!==k)JSON.parse=function(text,reviver){var j;function walk(d,e){var b,c,a=d[e];if(a&&typeof a===m)for(b in a)if(Object.prototype.hasOwnProperty.call(a,b)){c=walk(a,b);if(c!==undefined)a[b]=c;else delete a[b]}return reviver.call(d,e,a)}text=String(text);cx.lastIndex=0;if(cx.test(text))text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse");}})();

var dateFormat=function(){var d=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,c=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,b=/[^-+\dA-Z]/g,a=function(a,b){a=String(a);b=b||2;while(a.length<b)a="0"+a;return a};return function(e,f,k){var i=dateFormat;if(arguments.length==1&&(typeof e=="string"||e instanceof String)&&!/\d/.test(e)){f=e;e=undefined}e=e?new Date(e):new Date;if(isNaN(e))throw new SyntaxError("invalid date");f=String(i.masks[f]||f||i.masks["default"]);if(f.slice(0,4)=="UTC:"){f=f.slice(4);k=true}var h=k?"getUTC":"get",j=e[h+"Date"](),p=e[h+"Day"](),m=e[h+"Month"](),s=e[h+"FullYear"](),g=e[h+"Hours"](),q=e[h+"Minutes"](),r=e[h+"Seconds"](),l=e[h+"Milliseconds"](),n=k?0:e.getTimezoneOffset(),o={d:j,dd:a(j),ddd:i.i18n.dayNames[p],dddd:i.i18n.dayNames[p+7],m:m+1,mm:a(m+1),mmm:i.i18n.monthNames[m],mmmm:i.i18n.monthNames[m+12],yy:String(s).slice(2),yyyy:s,h:g%12||12,hh:a(g%12||12),H:g,HH:a(g),M:q,MM:a(q),s:r,ss:a(r),l:a(l,3),L:a(l>99?Math.round(l/10):l),t:g<12?"a":"p",tt:g<12?"am":"pm",T:g<12?"A":"P",TT:g<12?"AM":"PM",Z:k?"UTC":(String(e).match(c)||[""]).pop().replace(b,""),o:(n>0?"-":"+")+a(Math.floor(Math.abs(n)/60)*100+Math.abs(n)%60,4),S:(["th","st","nd","rd"])[j%10>3?0:(j%100-j%10!=10)*j%10]};return f.replace(d,function(a){return a in o?o[a]:a.slice(1,a.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"};dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

roundTo = function(v, n) {
	return Math.round(v*n)/n;
};

