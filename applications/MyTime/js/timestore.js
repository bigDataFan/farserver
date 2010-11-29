var TODAY_COOKIE_KEY = "today_time_list_" + new Date().getMonth() +"_" + new Date().getDate();

var TimeStore = new Object();

TimeStore.isLogon = false;

TimeStore._items = [];

TimeStore.Init = function(content) {
	this._items = [];
	cleanUi();
	if (!this.isLogon) {
		TimeStore._items = content;
		var total = 0;
		for(var i=0;i<TimeStore._items.length; i++) {
              addUiItem(TimeStore._items[i]);
              total += TimeStore._items[i].dura;
              if (TimeStore._items[i].running) {
            	  total += new Date().getTime()-TimeStore._items[i].begins;
              }
		}
		
		updateUiTotal(total);
		
	} else {
		//get items from g-qu.net server
	}
}

TimeStore.getGraphArray = function() {
	
	
	var total = 0;
	for(var i=0;i<TimeStore._items.length; i++) {
          total += TimeStore._items[i].dura;
          if (TimeStore._items[i].running) {
        	  total += new Date().getTime()-TimeStore._items[i].begins;
          }
	}
	
	var data = new Array();
	for(var i=0;i<TimeStore._items.length; i++) {
        var dura = TimeStore._items[i].dura;
        if (TimeStore._items[i].running) {
      	  dura += new Date().getTime() - TimeStore._items[i].begins;
        }
        
        var o = new Array();
        o.push(TimeStore._items[i].desc);
        o.push(formatFloat(100*dura/total,2));
        data.push(o);
	}
	
	return data;
}



TimeStore.saveItemsToCookie = function() {
	var stringified = JSON.stringify(this._items);
	saveItemToStore(stringified);

	/*
	var cookie = new Object();
	cookie.url = "http://www.g-qu.net/";
	cookie.name = TODAY_COOKIE_KEY;
	cookie.value = stringified;
	cookie.domain = "www.g-qu.net";
	cookie.path = "/";
	cookie.expirationDate = 24*60*60*1000 + (new Date() - new Date().setFullYear(1970, 0, 0));
	*/
	//localStorage.timeWork = stringified;
	//localStorage.setItem("timeWork", stringified);
	//chrome.cookies.set(cookie);
}




TimeStore.createItem = function(desc) {
	
	var item = new Object();
	item.start = new Date().getTime();
	item.desc = desc;
	item.running = false;
	item.dura = 0;
	item.begins = 0;
	
	this._items.push(item);
	this.saveItemsToCookie();
	return item;
}

TimeStore.removeItem = function(id) {
	var newArray = new Array();
	
	for(var i=0;i<this._items.length; i++) {
        if (this._items[i].start==id) {
        	//this._items[i].desc = desc;
        } else {
        	newArray.push(this._items[i]);
        }
	}
	this._items = newArray;
	this.saveItemsToCookie();
}


TimeStore.saveItem = function(id,desc) {
	
	for(var i=0;i<this._items.length; i++) {
        if (this._items[i].start==id) {
        	this._items[i].desc = desc;
        }
	}
	this.saveItemsToCookie();
}



TimeStore.stopRunning = function() {
	for(var i=0;i<this._items.length; i++) {
        if (this._items[i].running) {
        	this._items[i].running = false;
        	this._items[i].dura += new Date().getTime() - this._items[i].begins;
        	this._items[i].begins = 0;
        }
	}
	this.saveItemsToCookie();
}



TimeStore.runItem = function (div) {
	for(var i=0;i<this._items.length; i++) {
        if (this._items[i].running) {
        	this._items[i].running = false;
        	this._items[i].dura += new Date().getTime() - this._items[i].begins;
        	this._items[i].begins = 0;
        }
	}
	
	for(var i=0;i<this._items.length; i++) {
        if (this._items[i].start==parseInt($(div).attr("id"))) {
        	this._items[i].running = true;
        	this._items[i].begins = new Date().getTime();
        }
	}
	this.saveItemsToCookie();
}

var DateFormat=function(date){
	 //implementation
	 var format=function(str){
	  str=str.replace(/yyyy/g,date.getFullYear());
	  str=str.replace(/yy/g,date.getFullYear().toString().slice(2));
	  str=str.replace(/mm/g,date.getMonth()+1);
	  str=str.replace(/dd/g,date.getDate());
	  str=str.replace(/wk/g,date.getDay());
	  str=str.replace(/hh/g,date.getHours());
	  str=str.replace(/mi/g,(parseInt(date.getMinutes())<10)?("0"+date.getMinutes()):date.getMinutes());
	  str=str.replace(/ss/g,date.getSeconds());
	  str=str.replace(/ms/g,date.getMilliseconds());
	  return str;}
	 var valueOf=function(){}
	 var toString=function(){
	  return date.toLocaleString();}
	 //constructor
	 date=new Date(date);
	 if(!date||date=="NaN")
	  date=new Date();
	 //inteface
	 this.format=format;
	 this.valueOf=valueOf;
	 this.toString=toString;}


function formatFloat(src, pos)
{
    return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
}
