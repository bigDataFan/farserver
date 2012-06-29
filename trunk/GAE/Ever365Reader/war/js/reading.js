var allText;
var currentStart = 0;
var currentEnd = 0;
var maxSize = 1000;

var starts = [];


$(document).ready(function(){

	initLayOut();
	
	onStoreReady();
	
	//initCacheEngine();
	
});


function onStoreReady() {

	/*
	var v = swfstore.setSize(200 * 1024);
	if (v=="pending") {
		showInfo("为避免每次下载，请设置本地存储为“不限制”", 0);
		swfstore.displaySettings();
		return;
	}
	*/

	$('#toBeReplaced').hide();
	
	var url = $.urlParam("key");
	var p = $.urlParam("loc");
	
	if (p==null){
		p = 0;
	} else {
		p = parseInt(p);
	}
	
	if (isNaN(p)) {
		p = 0;
	}
	
	var text = getLocalCache(url);
	
	if (text!=null) {
		openReading({"loc":p}, text);
		showInfo("已经从本地缓存加载",3000);
		return;
	}
	
	$.get("/download",
			{
				key: url
			},
			function(data) {
				showInfo("图书下载完成",3000);
				openReading({"loc":p}, data);
				setLocalCache(url, data);
			});
}


/*

function openSetting() {
	
	$('#toBeReplaced').show();
	showInfo("为避免每次下载，请打开flash的本地缓存。 设置完成后请刷新页面", 0);
	swfstore.displaySettings();
}


function onQuotaExceede(e) {
	openSetting();
	
}


var swfstore;
function initCacheEngine() {
	swfstore = new YAHOO.util.SWFStore( "toBeReplaced" , false, false);
	swfstore.addListener("quotaExceededError", onQuotaExceede);
	
	swfstore.addListener("save", onSave);
	swfstore.addListener("error", onError);
	swfstore.addListener("securityError", onError);
	swfstore.addListener("contentReady", onContentReady);
}

function onSave(event) {
}

function onError(event) {
	openSetting();
}

function onContentReady(event) {
	onStoreReady();
}

function setLocalCache(k, v) {
	try {
		v = swfstore.setItem(k, v);
	} catch (e) {
		alert(e);
	}
}

function getLocalCache(k) {
	try {
		return swfstore.getValueOf(k);
	} catch (e) {
		return null;
	}
} 
*/


function setLocalCache(k, v) {
	if (localStorage) {
		try {
			localStorage.setItem(k,v);
		} catch (e) {
			localStorage.clear();
			localStorage.setItem(k,v);
		}
	} else {
		showInfo("建议您升级到浏览器到IE8或以上版本来缓存图书",5000);
	}
}

function getLocalCache(k) {
	if (localStorage) {
		try {
			return localStorage.getItem(k);
		} catch (e) {
			return null;
		}
		
	}
} 




var twoPage = false;


function initLayOut() {
	var height = $(window).height(); 
	var width = $(window).width();
	
	//$('#contentWrapper').css("width", width);
	//$('#contentWrapper').css("height", height);
	
	if (width>780) {
		twoPage = true;
	}
	
	if (twoPage) {
		$('#dynamicDiv').css("width", width/2-30);
		$('#dynamicDiv').css("height", height-80);
		
		$('#containerDiv1').css("width", width/2-30);
		$('#containerDiv1').css("height", height-80);

		$('#containerDiv2').css("width", width/2-30);
		$('#containerDiv2').css("height", height-80);
		
	} else {
		$('#containerDiv2').hide();
		$('#containerDiv1').css("width", width-30);
		$('#containerDiv1').css("height", height-80);
		$('#dynamicDiv').css("width", width-30);
		$('#dynamicDiv').css("height", height-80);
	}
	
	$('#dynamicDiv').css("top", -height);
	
	$('#sliderContainer').css("top", height-25);
	
	
	$("#sliderDiv").slider({
		range: "min",
		value: 37,
		min: 0,
		max: 1000,
		slide: function( event, ui ) {
			starts = [];
			currentEnd = Math.floor(allText.length * ui.value/1000);
			next();
		}
	});
	
	$('#contentWrapper').click(function(data) {
		if (data.clientX > width/2) {
			next();
		}else {
			if (starts.length>1) {
				starts.pop();
				currentEnd = starts.pop();
				next();
			} else {
				pre();
			}
		}
	});
	
	$('#contentWrapper').mousemove(function(data){
		if (data.clientY <60 || data.clientY>height-60) {
			slideOpen();
		}
	});
	
	
	$(document).keydown(function(evt) {
		switch (evt.keyCode) {
		case 39: //向右
			next();
			break;
		case 32: //空格
			next();
			break;
		case 37:  //向左
			if (starts.length>1) {
				starts.pop();
				currentEnd = starts.pop();
				next();
			} else {
				pre();
			}
			break;
		case 38:
			//向上键： 放大字体
			bigger();
			//slideOpen();
			break;
		case 40:
			//向下键： 缩小字体
			smaller();
			//slideClose();
			break;
		default:
			break;
		}
	});
}

function bigger() {
	var font = parseInt($('.content').css("font-size"));
	font ++;
	
	$('.content').css("font-size", font);
	starts  = [];
	
	checkDivContains();
	
	currentEnd = currentStart;
	next();
}

function smaller() {
	var font = parseInt($('.content').css("font-size"));
	font --;
	
	if (font<6) font=6;
	
	$('.content').css("font-size", font);
	starts  = [];
	
	checkDivContains();
	
	currentEnd = currentStart;
	next();
}

function slideClose() {
	$('#sliderContainer').fadeOut();
	$('#head').fadeOut();
}

function slideOpen() {
	$('#sliderContainer').fadeIn();
	$('#head').fadeIn();
}


function openReading(config, content) {
	
	checkDivContains();
	
	allText = content;
	
	currentStart = config.loc;
	currentEnd = currentStart;
	
	
	next();
}


var maxLine;
var perLine;
function checkDivContains() {
	var c = $('#containerDiv1');
	perLine = Math.floor((parseInt(c.css("width")))/parseInt(c.css("font-size")));
	maxLine = Math.floor((parseInt(c.css("height")))/parseInt(c.css("line-height")));
	maxSize = maxLine * perLine;
	
}


function pre() {
	currentEnd = currentStart;

	if (currentStart - maxSize<0) {
		starts = [];
		currentEnd = 0;
		next();
		return;
	}
	
	if (twoPage) {
		var text2 = goPreWithStart(currentStart);
		if (text2==null) return;
		currentStart -= text2.length;
		$('#containerDiv2').html(text2.replace(/\n/g, "<br>"));
	}
	
	var text1 = goPreWithStart(currentStart);
	if (text1==null) return;
	
	currentStart -= text1.length;
	$('#containerDiv1').html(text1.replace(/\n/g,"<br>"));
	
	showProgressInfo();
}


function next() {
	currentStart = currentEnd;
	starts.push(currentStart);
	
	var text1 = goNextWithStart(currentEnd);
	
	if (text1==null) return;
	
	currentEnd += text1.length;
	$('#containerDiv1').html(text1.replace(/\n/g,"<br>"));
	
	if (twoPage) {
		var text2 = goNextWithStart(currentEnd);
		if (text2==null) return;
		currentEnd += text2.length;
		$('#containerDiv2').html(text2.replace(/\n/g, "<br>"));
	}
	
	showProgressInfo();

}

function showProgressInfo() {
	$('#slideInfo').html(Math.floor(currentStart/allText.length*10000)/100 + "%");
	$("#sliderDiv").slider("value", Math.floor(currentStart/allText.length * 1000));
}

function goPreWithStart(pos) {
	if (pos<=0) {
		return null;
	}
	
	var rangeTo = (pos-maxSize<0)? 0 : (pos-maxSize);
	
	var mostStr = allText.substring(rangeTo, pos);
	
	var result = "";
	
	
	for ( var i = 0; i < maxLine; i++) {
		var v = mostStr.substring(mostStr.length-perLine);
		
		var newLinePos = v.lastIndexOf("\n");
		
		if (newLinePos>-1) {
			v = mostStr.substring(mostStr.length - perLine + newLinePos);
			mostStr = mostStr.substring(0, mostStr.length - perLine + newLinePos);
			result = v + result;
			
		} else {
			mostStr = mostStr.substring(0, mostStr.length-perLine);
			result = v + result;
		}
	}
	
	
	return result;
	
}

function goNextWithStart(pos) {
	if (pos>allText.length) return null;
	
	
	var rangeTo = ((pos + maxSize) < allText.length)? (pos + maxSize) : allText.length;
	
	var mostStr = allText.substring(pos, rangeTo);
	
	var result = "";
	
	for ( var i = 0; i < maxLine; i++) {
		var v = mostStr.substring(0, perLine);
		var newLinePos = v.indexOf("\n");
		if (newLinePos>-1) {
			v = mostStr.substring(0, newLinePos);
			mostStr = mostStr.substring(newLinePos+1);
			result += v + "\n";
		} else {
			mostStr = mostStr.substring(perLine);
			result += v;
		} 
	}
	
	return result;
}


function goHome() {
	var url = $.urlParam("key");
	
	$.getJSON("/service/key/get",
			{
				"kind":"reader",
				"key":"books"
			},
			function(data) {
				
				if (data.user.indexOf("guest.")==0) {
					location.href = "/";
				} else {
					var books = JSON.parse(data.value);
					
					for ( var i = 0; i < books.length; i++) {
						if (books[i].key==url) {
							books[i].pos = currentStart;
							
							$.post("/service/key/update",
									{
								"kind":"reader",
								"key":"books",
								"value" : JSON.stringify(books)
									},
									
									function() {
										location.href="index.html";
									});
							
							break;
						}
					}
				}
				
			});
}



function removeBook() {
	
	if (confirm("是否确认删除？")) {
		var url = $.urlParam("key");
		
		$.get("/delete", 
				{key:url},
		function(data) {
			alert("删除完成");
			location.href = "index.html";
		});
		
	}
} 


function showInfo(info, timeout) {
	
	$('#info').html(info);
	if (timeout!=0) {
		$('#info').delay(timeout).fadeOut(1000);
	}
}

/*

function goWithStart(pos, alltext) {
	
	var i = maxSize;
	var rangeTo = ((pos + i) < alltext.length)? (pos + i) : alltext.length;
	
	var most = alltext.substring(pos,rangeTo);
	
	most = most.replace(/\n/g, "<br>");
	
	
	var textSpan = document.getElementById("dynamicSpan");
    var textDiv = document.getElementById("dynamicDiv");

    
    
    $(textSpan).html(most);
    
    while(textSpan.offsetHeight > textDiv.offsetHeight)
    {
   	 	i-=10;
   	 	$(textSpan).html(most.substring(0,i));
   		if (i<0) {
   			alert("fail");
   			break;
   		}
    }
    
    return most.substring(0, i);
	 
}

*/


$.urlParam = function(name){ var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href); if (!results) { return 0; } return results[1] || 0;}


