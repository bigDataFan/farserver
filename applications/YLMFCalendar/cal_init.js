var Ctl_Calendar = function(date,contentBox,hasinit){
		var _self = this;
		this.ChangeDateHandler;
		this.MouseOverHandler;
		this.MouseOutHandler;
		this.DisplayHandler;
		this.WeatherData;
		this.ShowLunar = true;
		
		this.Date = date;
		
		var pageYear = date.getFullYear();
		var pageMonth = date.getMonth()+1;
		var pageDay = date.getDate();
		
		var display = function(dateStr,callback){
				Yl.Calendar.ChangeDate(dateStr,function(obj){
				var detail = '<ul class="calendar-week"><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li class="red">六</li><li class="red">日</li></ul><div class="calendar-datail">';
				var todayTime = new Date();
				var tTime = new Date(todayTime.getTime() + 24*60*60*1000);
				var aTime = new Date(todayTime.getTime() + 24*60*60*1000*2);
				for(var i = 0; i < obj.Detail.length; i++){
					var item = obj.Detail[i];
					var classStr = "class=\"";
					var isLastDay = false;
					if(item.IsMonth != 0){
						classStr += " other-day";
					}
					else{
						if(item.Week == "六" || item.Week == "日"){
							classStr += " red";
						}
						if(item.IsToday){
							classStr += " today";
						}
						if(item.Day == pageDay){
							classStr += " selected-day";
						}
						if(item.IsEspecial){
							classStr += " green";
						}
					}
					if(classStr == "class=\""){
						classStr="";
					}
					else{
						classStr += "\"";
					}
					
					var y,m,d;
					y = obj.Year;
					m = obj.Month;
					switch(item.IsMonth){
						case 1:
							m--;
							break;
						case 2:
							m++;
							break;
					}
					if(m < 1){
						y--;
						m = 12;
					}
					if(m > 12){
						y++;
						m = 1;
					}
					d = item.Day;
					detail += "<a href='javascript:\/\/' index='"+i+"' y='"+y+"' m='"+m+"' d='"+d+"' "+classStr + ">" + item.Day;
					if(_self.ShowLunar){
						detail += "<span title='" + item.LunarDay + "'>" + Public.String.Cut(item.LunarDay,4) + "<\/span>"
					}
					if(_self.WeatherData){
						var dateStr =new Date(y,m - 1,d).toDateString();
						var weatherHtml = '';
						var dataItem = false;
						if(todayTime.toDateString() == dateStr){
							dataItem = _self.WeatherData["today"];
						}
						else if(tTime.toDateString() == dateStr){
							dataItem = _self.WeatherData["tomorrow"];
						}
						else if(aTime.toDateString() == dateStr){
							dataItem = _self.WeatherData["after"];
						}
						
						if(dataItem){
							weatherHtml = '<span class="tq">'+dataItem["desc"][0]+'</span>';
							
						}
						
						detail += weatherHtml;
					}
					detail += "<\/a>";
					
				}
				detail += "</div>";
				var result = $(detail);
				result.find("a").each(function(i){
					$(this).click(function(){
						_self.ChangeDate($(this).attr("y"),$(this).attr("m"),$(this).attr("d"));
						return false;
					});
					$(this).mouseover(function(e){
						if(_self.MouseOverHandler){
							_self.MouseOverHandler($(this),obj,Number($(this).attr("index")));
						}
					});
                    $(this).mousemove(function(e){
                        if(_self.MouseMoveHandler){
                            _self.MouseMoveHandler(e);
                        }
                    });
					$(this).mouseout(function(e){
						if(_self.MouseOutHandler){
							_self.MouseOutHandler($(this),obj,Number($(this).attr("index")));
						}
					});
					
				});
				contentBox.empty().append(result);
				if(_self.DisplayHandler){
					_self.DisplayHandler(obj);
				}
			});
		}
		
		
		
		this.ChangeDate = function(y,m,d){
			pageYear = y;
			pageMonth = m;
			pageDay = d;
			_self.Date = new Date(y,m-1,d);
			display(y+"/"+m+"/"+d);
			if(_self.ChangeDateHandler){
				_self.ChangeDateHandler(y,m,d);
			}
		}
		this.GetFeastDate = function(dateStr){
			return Yl.Calendar.GetFeastDate(dateStr);
		}
		this.GetHL = function(y,m,d){
			return Yl.Calendar.GetHL(y,m,d);
		}
		
		if(!hasinit){
			display(pageYear+"/"+pageMonth+"/"+pageDay);
		}
		else{
			this.Init = function(){
				display(pageYear+"/"+pageMonth+"/"+pageDay);
			}
		}
	};


var hideTimer;
var cal;
	$(document).ready(function(){
		  pop=$("#js_hover_datail");
			cal = new Ctl_Calendar(new Date(),$("#js_calendar_box"),true);
			cal.DisplayHandler = function(obj){			
				var detailHtml = '';
				detailHtml += '<p class="day_datail_day">'+obj.Year + "年" +obj.Month + "月" + obj.Day+ "日" + ' 星期' + obj.Week +'</p>';
				detailHtml += '<p class="day_datail_nongli">' + obj.LunarYear + "("+obj.Animal+")年 " + obj.LunarMonth + obj.LunarDay + '</p>';
				var faestHtml = "";
				for(var i = 0,len = obj.FeastDateList.length; i < len; i++){
					if(obj.FeastDateList[i]){
						faestHtml += '<p class="day_datail_jieri">' + obj.FeastDateList[i] + ' [<a href="http://115.com/s?q='+encodeURIComponent(obj.FeastDateList[i])+'" target="_blank">查看节日来源</a>]</p>';
					}
				}
				detailHtml += faestHtml;
				$("#js_today_detail").empty().append(detailHtml);
				
				
				if(obj.HlYi || obj.HlJi){
					var yjHtml = "";
					if(obj.HlYi){
						yjHtml += '<dt class="nl-yi">宜</dt><dd>'+obj.HlYi.replace(/\./g," ")+'</dd>';
					}
					if(obj.HlJi){
						yjHtml += '<dt class="nl-ji">忌</dt><dd>'+obj.HlJi.replace(/\./g," ")+'</dd>';
					}
					$("#xiongji").html(yjHtml).show();
				}
				else{
					$("#xiongji").hide();
				}
				//document.getElementById("js_year").value = cal.Date.getFullYear();
				//document.getElementById("js_Month").value = cal.Date.getMonth() + 1;
				//暂时停止历史上的今天
	            //getHistoryMethod(cal.Date.getMonth() + 1,cal.Date.getDate());
			}
			
			cal.ChangeDateHandler = function(y,m,d){
				hideDetailMethod();
			}
			
			cal.MouseOutHandler = function(ele,obj,index){
				if(hideTimer){
					window.clearTimeout(hideTimer);
				}
	            hideTimer = window.setTimeout(hideDetailMethod,0);
			}
			cal.MouseMoveHandler=function(evt){  
	            pop.css({
	                left:evt.clientX+10,
	                top:evt.clientY+10+$(document).scrollTop()
	            })
	        }
			cal.MouseOverHandler = function(ele,obj,index){
				
	            if(hideTimer){
					window.clearTimeout(hideTimer);
				}
				
				var item = obj.Detail[index];
	            /*
				$("#pop_title").attr("y",ele.attr("y")).attr("m",ele.attr("m")).attr("d",ele.attr("d")).html(item.Day).unbind("click").bind("click",function(){
					var titleBox = $(this);
					cal.ChangeDate(titleBox.attr("y"),titleBox.attr("m"),titleBox.attr("d"));
				});
				*/
				$("#pop_day").html(ele.attr("y")+"年"+ele.attr("m")+"月"+ele.attr("d")+"日 " + "星期" + item.Week);
				$("#pop_nongli").html(obj.LunarYear + "("+item.Animal+")年 " + item.LunarMonth + " " + item.LunarDayII);
				
				$("#pop_jieri").html(cal.GetFeastDate(ele.attr("y") + "/" + ele.attr("m") + "/" + item.Day).join(" "));
				
				var hl = cal.GetHL(ele.attr("y"),ele.attr("m"),item.Day);
				
				if(hl){
					var yjHtml = "";
					if(hl.y){
						yjHtml += '<dt class="nl-yi">宜</dt><dd>'+hl.y.replace(/\./g," ")+'</dd>';
					}
					if(hl.j){
						yjHtml += '<dt class="nl-ji">忌</dt><dd>'+hl.j.replace(/\./g," ")+'</dd>';
					}
					$("#pop_xiongji").html(yjHtml).show();
				}
				else{
					$("#pop_xiongji").hide();
				}
				
				
				var todayTime = new Date();
				var tTime = new Date(todayTime.getTime() + 24*60*60*1000);
				var aTime = new Date(todayTime.getTime() + 24*60*60*1000*2);
				var dateStr =new Date(ele.attr("y"),(ele.attr("m") - 1),ele.attr("d")).toDateString();
				var weatherHtml = '';
				var dataItem;
				
				/*
				if(weatherData){
					if(todayTime.toDateString() == dateStr){
						dataItem = weatherData["today"];
					}
					else if(tTime.toDateString() == dateStr){
						dataItem = weatherData["tomorrow"];
					}
					else if(aTime.toDateString() == dateStr){
						dataItem = weatherData["after"];
					}
					
					if(dataItem){
						weatherHtml = '<a href="/tianqi/">'+dataItem["desc"][0] + " " + dataItem["temp"] +'</a>';
					}
				}
				$("#pop_tq").html(weatherHtml);
				*/
				hideTimer = window.setTimeout(showDetailMethod,0);
				
			}
			
			pop.mouseover(function(e){
				if(hideTimer){
					window.clearTimeout(hideTimer);
				}
			}).mouseout(function(e){
				if(hideTimer){
					window.clearTimeout(hideTimer);
				}
				hideTimer = window.setTimeout(hideDetailMethod,0);
			});
			cal.Init();

	});
	

	
var initSelect = function(){
	var optionObj = {};
	var optgroupObj = {};
	var df = document.createDocumentFragment();
	for(i=1901;i<2050;i++){
		optionObj = document.createElement("option");
		optionObj.value = i;
		optionObj.innerHTML = i+"年";
		df.appendChild(optionObj);
		if(i%10 == 0){
			optgroupObj = document.createElement("optgroup");
			optgroupObj.setAttribute("label","───");
			df.appendChild(optgroupObj);
		}
	}
	document.getElementById("js_year").appendChild(df);
};


	
	
var showDetailMethod = function(){
	pop.show();
}

var hideDetailMethod = function(){
	pop.hide();
}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	