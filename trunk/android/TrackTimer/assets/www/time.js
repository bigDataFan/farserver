
var editing = null;


function updateTime() {
	location.href = location.href;
}

function switchTime(created) {
	var all = list("me", new Date());
	
	for ( var i = 0; i < all.length; i++) {
		
		if (all[i].created == created && all[i].laststart==0) {
			all[i].laststart = new Date().getTime();
			continue;
		}
		
		if (all[i].laststart!=0) {
			all[i].dura += new Date().getTime() - all[i].laststart;
			if (all[i].stops==null) all[i].stops = [];
			all[i].stops.push(new Date().getTime());
			all[i].laststart = 0;
		}
	}
	var u = "me";
	var d = new Date();
	var skey = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "-times-" + u;
	window.localStorage.setItem(skey, JSON.stringify(trimArray(all)));
	
	location.href = location.href;
}

function list(u, d) {
	var skey = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "-times-" + u;
	var value = window.localStorage.getItem(skey);
	
	var collections = [];
	if (value!=null) {
		collections = JSON.parse(value);
	}
	return collections;
}


function removeCurrent() {
	if (editing!=null && confirm("确定删除？")) {
		remove("me", new Date(), editing.created);
	}
	location.href = "index.html";
}

function remove(u, d, created) {
	var collections = list(u, d);
	for ( var i = 0; i < collections.length; i++) {
		if (collections[i].created==created) {
			collections[i] = null;
			
			var skey = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "-times-" + u;
			window.localStorage.setItem(skey, JSON.stringify(trimArray(collections)));
			return;
		}
	}
}

function insert(u, d, o) {
	var collections = list(u, d);
	collections.push(o);
	
	var skey = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "-times-" + u;
	window.localStorage.setItem(skey, JSON.stringify(collections));
}

function get(u, d, created) {
	var collections = list(u, d);
	for ( var i = 0; i < collections.length; i++) {
		if (collections[i].created==created) {
			return collections[i];
		}
	}
}

function update(u, d, o) {
	var collections = list(u, d);
	for ( var i = 0; i < collections.length; i++) {
		if (collections[i].created==o.created) {
			collections[i] = o;
			break;
		}
	}
	var skey = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "-times-" + u;
	window.localStorage.setItem(skey, JSON.stringify(collections));
}

function saveTimeConfig() {
	var created = getParam("created");
	var o;
	if (created==0) {
		o = {
			"created": new Date().getTime(),
			"dura": 0,
			"autostop": x$('#autoStop').attr("value")[0],
			"laststart": 0,
			"desc": x$('#editTime').attr("value")[0],
			"notifyInt": x$('#notifyInterval').attr("value")[0],
			"stops" : []
		}
		insert("me", new Date(), o);
	} else {
		o = get("me", new Date(), created);
		o.desc = x$('#editTime').attr("value");
		o.autostop = x$('#autostop').attr("value");
		update("me", new Date(), o);
	}
	location.href = "index.html";
}

function getParam(name) {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href); 
	if (!results) { return 0; } return results[1] || 0;
}

function formatDura(mill) {
	var minutes = Math.floor((mill/(1000*60))%60);
	if (minutes<10) {
		minutes = "0" + minutes;
	}
	return Math.floor(mill/(1000*60*60)) + ":" + minutes; 
	/*
	var d3 = new Date(parseInt(mill));
	return ((d3.getDate()-1)*24 + (d3.getHours()-8)) + ":" 
	+ ((d3.getMinutes()<10)?("0"+d3.getMinutes()):d3.getMinutes());
	*/ 
}

function formatHour(mill) {
	var t = new Date(mill);
	return t.getHours() + ":" +  ((t.getMinutes()<10)?("0"+t.getMinutes()):t.getMinutes());
}

function formatedToMill(formated) {
	var sr = formated.split(":");
	return parseInt(sr[0])*60*60*1000 + parseInt(sr[1].charAt(0)=='0'?sr[1].charAt(1):sr[1])*60*1000;
}

function trimArray(array) {
	var n = [];
	
	for ( var i = 0; i < array.length; i++) {
		if (array[i]!=null) {
			n.push(array[i]);
		}
	}
	return n;
}

var hitKeys = [
               '时间小贴士一.设立明确的目标',
      	     '时间小贴士二.学会列清单',
      	     '时间小贴士三.做好“时间日志”',
      	     '时间小贴士四.制订有效的计划。',
      	     '时间小贴士五.遵循20:80定律',
      	     '时间小贴士六.安排“不被干扰”时间',
      	     '时间小贴士七.确立个人的价值观',
      	     '时间小贴士八.严格规定完成期限',
      	     '时间小贴士九.学会充分授权',
      	     '时间小贴士十.同-类的事情最好一次做完'
	];
	         
var hitInfos = [
                "时间管理的目的是让你在最短时间内实现更多你想要实现的目标。把手头4到10个目标写出来，找出一个核心目标，并依次排列重要性，然后依照你的目标设定详细的计划，并依照计划进行。",
  	          "把自己所要做的每一件事情都写下来，列一张总清单，这样做能让你随时都明确自己手头上的任务。在列好清单的基础上进行目标切割。",
  	          "你花了多少时间在哪些事情，把它详细地，记录下来，每天从刷牙开始，洗澡，早上穿衣花了多少时间，早上搭车的时间，平上出去拜访客户的时间，把每天花的时间一一记录下来，做了哪些事，你会发现浪费了哪些时间。当你找到浪费时间的根源，你才有办法改变。",
  	          "绝大多数难题都是由未经认真思考虑的行动引起的。在制订有效的计划中每花费1小时，在实施计划中就可能节省3-4小时，并会得到更好的结果。如果你没有认真作计划，那么实际上你正计划着失败。",
  	          "用你80%的时间来做20%最重要的事情。生活中肯定会有一些突发困扰和迫不及待要解决的问题，如果你发现自己天天都在处理这些事情，那表示你的时间管理并不理想。一定要了解，对你来说，哪些事情是最重要的，是最有生产力的。",
  	          "假如你每天能有一个小时完全不受任何人干扰地思考一些事情，或是做一些你认为最重要的事情，这一个小时可以抵过你一天的工作效率，甚至可能比三天的工作效率还要好。",
  	          "假如价值观不明确，就很难知道什么对你是最重要的，当你的价值观不明确时，就无法做到合理地分配时间。时间管理的重点不在管理时间，而在于如何分配时间。你永远没有时间做每件事，但永远有时间做对你来说最重要的事。",
  	          "巴金森(C.Noarthcote Parkinson)在其所著的《巴金森法则》中写下这段话“你有多少时间完成工作，工作就会自动变成需要那么多时间。”如果你有一整天的时间可以做某项工作，你就会花一天的时间去做它。而如果你只有一小时的时间可以做这项工作，你就会更迅速有效地在一小时内做完它。",
  	          "列出你目前生活中所有觉得可以授权的事情，把它们写下来，找适当的人来授权。",
  	          "假如你在做纸上作业，那段时间都做纸上作业；假如你是在思考，用一段时间只作思考；打电话的话，最好把电话累积到某一时间一次把它打完。"
	];

var JSON;if(!JSON)JSON={};(function(){var n="number",m="object",l="string",k="function";"use strict";function f(a){return a<10?"0"+a:a}if(typeof Date.prototype.toJSON!==k){Date.prototype.toJSON=function(){var a=this;return isFinite(a.valueOf())?a.getUTCFullYear()+"-"+f(a.getUTCMonth()+1)+"-"+f(a.getUTCDate())+"T"+f(a.getUTCHours())+":"+f(a.getUTCMinutes())+":"+f(a.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b===l?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(i,j){var f="null",c,e,d,g,h=gap,b,a=j[i];if(a&&typeof a===m&&typeof a.toJSON===k)a=a.toJSON(i);if(typeof rep===k)a=rep.call(j,i,a);switch(typeof a){case l:return quote(a);case n:return isFinite(a)?String(a):f;case"boolean":case f:return String(a);case m:if(!a)return f;gap+=indent;b=[];if(Object.prototype.toString.apply(a)==="[object Array]"){g=a.length;for(c=0;c<g;c+=1)b[c]=str(c,a)||f;d=b.length===0?"[]":gap?"[\n"+gap+b.join(",\n"+gap)+"\n"+h+"]":"["+b.join(",")+"]";gap=h;return d}if(rep&&typeof rep===m){g=rep.length;for(c=0;c<g;c+=1)if(typeof rep[c]===l){e=rep[c];d=str(e,a);d&&b.push(quote(e)+(gap?": ":":")+d)}}else for(e in a)if(Object.prototype.hasOwnProperty.call(a,e)){d=str(e,a);d&&b.push(quote(e)+(gap?": ":":")+d)}d=b.length===0?"{}":gap?"{\n"+gap+b.join(",\n"+gap)+"\n"+h+"}":"{"+b.join(",")+"}";gap=h;return d}}if(typeof JSON.stringify!==k)JSON.stringify=function(d,a,b){var c;gap="";indent="";if(typeof b===n)for(c=0;c<b;c+=1)indent+=" ";else if(typeof b===l)indent=b;rep=a;if(a&&typeof a!==k&&(typeof a!==m||typeof a.length!==n))throw new Error("JSON.stringify");return str("",{"":d})};if(typeof JSON.parse!==k)JSON.parse=function(text,reviver){var j;function walk(d,e){var b,c,a=d[e];if(a&&typeof a===m)for(b in a)if(Object.prototype.hasOwnProperty.call(a,b)){c=walk(a,b);if(c!==undefined)a[b]=c;else delete a[b]}return reviver.call(d,e,a)}text=String(text);cx.lastIndex=0;if(cx.test(text))text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse");}})();

