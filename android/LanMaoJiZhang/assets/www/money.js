$(document).ready(function(){
	if ($.os.ios || $.os.android || $.os.iphone || $.os.ipad) {
		$('.button').bind("touchstart", onTouchedDown);
		//$('.button').bind("touchend", onTouchedUp);
		bindEvent('touchend');
	} else {
		$('.button').bind("mousedown", onTouchedDown);
		$('.button').bind("mouseup", onTouchedDown);
		bindEvent('click');
	}
});


function onTouchedDown() {
	$(this).addClass("button-down");
}

function onTouchedUp() {
	$(this).removeClass("button-down");
}

function getParam(name) {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href); 
	if (!results) { return 0; } return results[1] || 0;
}

function goToMain() {
	location.href = "index.html";
}

function addOutCome() {
	location.href = "outcome-edit.html";
}

function goOutComeList() {
	location.href = "outcome-list.html";
}

function goInComeList() {
	location.href = "income-list.html";
}

function addInCome() {
	location.href = "income-edit.html";
}

function configCategory() {
	location.href = "categories.html";
}

function goBackUp() {
	location.href = "backup.html";
}

function goAnalyze() {
	location.href = "analyze-list.html";
}

function goMonthInfo() {
	location.href = "month-infos.html";
}

function goYearOutComeBars() {
	location.href = "year-outcome-infos.html";
}

function goYearInComeBars() {
	location.href = "year-income-infos.html";
}

function goYearRemainBars() {
	location.href = "year-remain-infos.html";
}

function goAbout() {
	location.href = "about.html";
}


function fillselect(select, categories) {
	for(var i=0; i<categories.length; i++) {
		select.append('<option>' + categories[i] + "</option>");
	}
}

function loadCategories(db, ary) {
	var categorydb = new TAFFY();
	categorydb.store(db);
	var categories = [];
	
	if (categorydb().get().length==0) {
		categorydb.insert({category: "米面粮油"});
		categorydb.insert({category: "蔬菜水果"});
		categorydb.insert({category: "衣服鞋帽"});
		categorydb.insert({category: "交通通讯"});
		categorydb.insert({category: "家居用品"});
		categorydb.insert({category: "外出就餐"});
		categorydb.insert({category: "运动健身"});
		categorydb.insert({category: "固定支出"});
		categorydb.insert({category: "礼品应酬"});
	}
	
	categorydb().each(
		function(r, i) {
			categories.push(r.category);
		}
	);
	
	for ( var i = 0; i < ary.length; i++) {
		fillselect(ary[i], categories);
	}
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

function roundTo(v, n) {
	return Math.round(v*n)/n;
};

function getMonthStart(d) {
	d.setDate(1);
	d.setHours(0, 0, 0);
	return d;
}

function getNextMonthStart(d) {
	d = getMonthStart(d);
	var m = new Date(d.getTime() + 40*24*60*60*1000);
	return getMonthStart(m);
}

function getPreMonthStart(d) {
	d = getMonthStart(d);
	var m = new Date(d.getTime() - 10*24*60*60*1000);
	return getMonthStart(m);
}

function getFloatFormat(f) {
	return Math.round(f * 10)/10;
}



