/* 
	* author: Max 
	* date: 09-6-10 
	* dec: 日历控制类
	* use: Yl.Calendar.ChangeDate(pDate,pChangeCallBack);
			参数:
				pDate: {string} 格式2009/10/1
				pChangeCallBack: {Function} 改变日期执行的代码
					obj 属性
						Year	//年
						Month	//月
						Day		//日
						Week	//星期
						LunarYear	//农历年
						LunarMonth	//农历月
						LunarDay	//农历日
						Animal		//生肖
						FeastDateList	//节日
						HlYi	//宜做的事
						HlJi	//忌做的事
						Detail	//{Array}显示的日期
							日期项对象 属性
								Day	//公历日期
								LunarDay	//农历日期
								Color	//显示颜色
								IsToday	//是否是今天
								IsMonth	//是否当月日期 0当月 1上月 2下月
*/
var CalendarControl = function(){
	var _ActiveCld;	//选中日期对应的日历
	var _PreCld;	//上个月日历
	var _NextCld;	//下个月日历
	var _tDate = new Date();
	var g_ty = _tDate.getFullYear(),g_tm = _tDate.getMonth(),g_td = _tDate.getDate();
	var _HlDataSource = {};
	var g_monthName = new Array("正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月");
	
	var changeDate = function(pY,pM,pD,pChangeCallBack){
		var tDate = new Date();
		var aDate = new Date(Number(pY),Number(pM),Number(pD));;
		_ActiveCld = new calendar(pY,pM,g_ty,g_tm,g_td);
		
		if(_ActiveCld.firstWeek != 1){
			if(pM == 0){
				prey = pY-1;
				prem = 11;
			}
			else{
				prey = pY;
				prem = pM - 1;
			}
			_PreCld = new calendar(prey,prem,g_ty,g_tm,g_td);
		}
	
		if(_ActiveCld.lastWeek != 0){
			if(pM == 11){
				nexty = pY + 1;
				nextm = 0;
			}
			else{
				nexty = pY;
				nextm = pM + 1;
			}
			_NextCld = new calendar(nexty,nextm,g_ty,g_tm,g_td);
		}
		if(pChangeCallBack){
			var d = pD - 1;
			var hl = getHl(_ActiveCld[d].sYear,_ActiveCld[d].sMonth,_ActiveCld[d].sDay);
			/*try{
				if(_HlDataSource["y" + _ActiveCld[d].sYear] == undefined){
						_HlDataSource["y" + _ActiveCld[d].sYear] =  eval("HuangLi.y" + _ActiveCld[d].sYear + "()");
				}
				
				hl = eval("_HlDataSource.y"+_ActiveCld[d].sYear+".d"+(_ActiveCld[d].sMonth<10?('0'+_ActiveCld[d].sMonth):_ActiveCld[d].sMonth)+(_ActiveCld[d].sDay<10?('0'+_ActiveCld[d].sDay):_ActiveCld[d].sDay));
			}
			catch(e){
				hl = false;
			}*/
			
			var feastDateCol = getFeastDate(_ActiveCld,pD);
			
			var calendarContentCol = [];
			var cld = _ActiveCld;
			var cld_pre = _PreCld;
			var cld_next = _NextCld;
			for(i=0; i<42; i++) {
				sD = i + 1 - cld.firstWeek;
				if(cld.firstWeek == 0)  sD = i + 1 - 7;   //本月第一天是周日
				if(sD < 0){  //上个月日期
					sDtemp = cld_pre.length + sD;
					calendarContentCol.push(getDetailObject(cld_pre,sDtemp,1));
				}
				else if(sD >= cld.length){//下个月日期
					if(i%7 == 0) break;
					sDtemp = sD - cld.length;
					calendarContentCol.push(getDetailObject(cld_next,sDtemp,2));
				}
				else if(sD>-1 && sD < cld.length) { //日期内
					calendarContentCol.push(getDetailObject(cld,sD,0));
				}
			}
			
			var callBackObj = {
				Year:pY,
				Month:pM + 1,
				Day:pD,
				Week:_ActiveCld[d].week,
				
				LunarYear:_ActiveCld[d].cYear,	//农历年
				LunarMonth: g_monthName[_ActiveCld[d].lMonth-1], //农历月
				LunarDay: cDay(_ActiveCld[d].lDay), //农历日
				
				Animal: Animals[(_ActiveCld[pD-1].lYear-4)%12],		//生肖
				FeastDateList: feastDateCol,	//节日
				HlYi: hl? hl.y : hl,	//宜做的事
				HlJi: hl? hl.j : hl,	//忌做的事
				Detail: calendarContentCol
			};
			pChangeCallBack(callBackObj);
		}
	}
	
	var getHl = function(y,m,d){
		var hl = false;
		try{
			if(_HlDataSource["y" + y] == undefined){
					_HlDataSource["y" + y] =  eval("HuangLi.y" + y + "()");
			}
			hl = eval("_HlDataSource.y" + y + ".d"+(m<10?('0'+m):m)+(d<10?('0'+d):d));
		}
		catch(e){
		}
		return hl;
	}

	var getFeastDate = function(cld,pD){
		var feastDateCol = [];
		if(cld[pD-1].lunarFestival.length > 0){
			var list = cld[pD-1].lliFestival.split(" ");
			for(i=0;i<list.length;i++)
				feastDateCol.push(list[i]);
		}
		if(cld[pD-1].dateFestival.length > 0){
			var list = cld[pD-1].dateFestival.split(" ");
			for(i=0;i<list.length;i++)
				feastDateCol.push(list[i]);
		}
		if(cld[pD-1].weekFestival.length > 0){
			var list = cld[pD-1].weekFestival.split(" ");
			for(i=0;i<list.length;i++)
				feastDateCol.push(list[i]);
		}
		if(cld[pD-1].estDayFestival.length > 0){
			var list = cld[pD-1].estDayFestival.split(" ");
			for(i=0;i<list.length;i++)
				feastDateCol.push(list[i]);
		}
		
		return feastDateCol;
	}
	
	var getDetailObject = function(cld,sDtemp,isThisMonth){		//获取日期项对象
		var detailItem = {};
		detailItem.Day = sDtemp + 1;	//公历日期
		var lunarobj = getLunarDateDetailUse(cld,sDtemp);
		
		detailItem.LunarDay = lunarobj.LunarDay;	//农历日期
		detailItem.IsEspecial = lunarobj.IsEspecial;
		detailItem.Color = cld[sDtemp].color;	//显示颜色
		detailItem.IsToday = cld[sDtemp].isToday;	//是否是今天
		detailItem.IsMonth = isThisMonth;	//是否当月日期 0当月 1上月 2下月
		detailItem.Week = cld[sDtemp].week;
		detailItem.LunarYear = cld[sDtemp].LunarYear;
		detailItem.LunarMonth = g_monthName[cld[sDtemp].lMonth-1];
		detailItem.LunarDayII = lunarobj.LunarDayII;
		
		detailItem.Animal = Animals[(cld[detailItem.Day-1].lYear-4)%12];
		//detailItem.FeastDate = getFeastDate(cld,detailItem.Day);
		return detailItem;
	}
	
	var getLunarDateDetailUse = function(cld,sDtemp){	//获取日历中的农历日
		var result;
		var isEspecial = false;
		if(cld[sDtemp].lDay==1) //显示农历月
			result = (cld[sDtemp].isLeap?'闰':'') + g_monthName[cld[sDtemp].lMonth-1];
    	else //显示农历日
    		result = cDay(cld[sDtemp].lDay);
		
		var LunarDayII = result;
		
		s=cld[sDtemp].lunarFestival;
		if(s.length>0) { //农历节日
			//if(s.length>6) s = s.substr(0, 4)+'...';
		}
		else { //公历节日
			s=cld[sDtemp].solarFestival;
			if(s.length>0) {
				/*size = (s.charCodeAt(0)>0 && s.charCodeAt(0)<128)?8:4;
				if(s.length>size+2) s = s.substr(0, size)+'...';*/
			}
			else { //廿四节气
				s=cld[sDtemp].solarTerms;
				if(s.length <=0){
					s=cld[sDtemp].lliFestival;
					if(s.length <=0){
						s = cld[sDtemp].weekFestival;
						if(s.length <= 0) {
							s = cld[sDtemp].dateFestival;
							if(s.length <= 0){
								s = cld[sDtemp].estDayFestival;
							}
						}
					}
				}
			}
		}
		if(s.length > 0){
			if(s.indexOf(" ") != -1){
				s = s.substring(0,s.indexOf(" "));
			}
			result = s;
			isEspecial = true;
		}
		
		return {LunarDay: result,LunarDayII:LunarDayII,IsEspecial: isEspecial};
	}
	
	
	this.ChangeDate = function(pDate,pChangeCallBack){
		var d = pDate? new Date(pDate): new Date();
		changeDate(d.getFullYear(),d.getMonth(),d.getDate(),pChangeCallBack);
	},
	this.GetHL = function(pY,pM,pD){
		return getHl(pY,pM,pD);
	}
	this.GetFeastDate = function(pY,pM,pD){
		var cld = new calendar(pY,pM,g_ty,g_tm,g_td);
		return getFeastDate(cld,pD);
	}
}

var Yl = {};
Yl.Calendar = {
	GetHL:function(y,m,d){
		if(Yl.Control == undefined){
			Yl.Control = new CalendarControl();
		}
		return Yl.Control.GetHL(y,m,d);
	},
	GetFeastDate: function(pDate){
		if(Yl.Control == undefined){
			Yl.Control = new CalendarControl();
		}
		var d = typeof pDate == "string"? new Date(pDate): pDate;
		return Yl.Control.GetFeastDate(d.getFullYear(),d.getMonth(),d.getDate());
	},
	ChangeDate: function(pDate,pChangeCallBack){
		if(Yl.Control == undefined){
			Yl.Control = new CalendarControl();
		}
		Yl.Control.ChangeDate(pDate,pChangeCallBack);
	}
};