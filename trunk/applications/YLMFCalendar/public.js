
var Public = {};


/*
* 
* 验证身份证格式
* return 1 正确; 0日期有误; -1 18位的格式有误; -2 15位的包含有非数字字符; -3 18位包含的字符不正确; -4 字符不够
*/
Public.ValidateIdentityCard = function(pNumber){
    var error = 1;
    pNumber = pNumber.toUpperCase();
    var l = pNumber.length;
    switch(l){
        case 15:
            if(/^\d{15}$/.test(pNumber)){
                var year = '19' + pNumber.substring (6, 8 );
                var month = pNumber.substring (8, 10 );
                var day = pNumber.substring (10, 12 );
                if(!Public.CheckDate(Number(year),Number(month),Number(day))){
                    error = 0;
                }
            }
            else{
                error = -2;
            }
            break;
        case 18:
            if(/^\d{17}(\d|X)$/.test(pNumber)){
                var year = pNumber.substring(6, 10);
                var month = pNumber.substring(10, 12 );
                var day = pNumber.substring(12, 14);
                if(Public.CheckDate(Number(year),Number(month),Number(day))){
                    var sigma = 0;
                    var st = pNumber.substring (0, pNumber.length-1);
                    var wi = new Array (7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 );
                    var ai = new Array ('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2' );
                    var _st,_wi;
                    for(var i = 0; i < 17; i++)
                    {
                        _st =  st.substring(i,i+1);
                        _wi = wi [i];
                        sigma += (Number(_st) * _wi);
                    }
                    if ((pNumber.substring(pNumber.length-1)) != ai [sigma % 11]){
                        error = -1;
                    }
                }
                else{
                    error = 0;
                }
            }
            else{
                error = -3;
            }
            break;
        case 6:
            if(!(/^\d{6}$/.test(pNumber))){
                error = -5;
            }
            break;
        default:
            error = -4;
            break;
    }
    return error;
}

/*
* 
* 验证URL
* return true 正确; false 错误
*/
Public.ValidateUrl = function(pUrl){
    var str_url = pUrl;
    var regular = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
    if(regular.test(str_url)){
        return true;                                                                                                                                                                                                                                    }
    else{
        return false; 
    }
}

/*
* 
* 验证手机号码
* return 1 正确; 0手机号有误;
*/
Public.ValidateMoblie = function(pNumber){
    var l = pNumber.length;
    var error = 1;
    switch(l){
        case 7:
            if(!/^(13[0-9]|15[0-9]|14[0-9]|18[7|8|9|6|5|2])\d{4}$/.test(pNumber)){
                error = 0;
            }
            break;
        case 11:
            if(!/^(13[0-9]|15[0-9]|14[0-9]|18[7|8|9|6|5|2])\d{4,8}$/.test(pNumber)){
                error = 0;
            }
            break;
        default:
            error = -1;
            break;
    }
    return error;
}

Public.ValidateChinaChar = function(pChar){
    if(!/^[\u4e00-\u9fa5\s]+$/.test(pChar)){
        return false;
    }
    return true;
}

/*
* 
* 验证邮编
* return true 正确;false有误;
*/
Public.ValidateZip = function(pNumber){
    if(!/^(\d{3,6})$|^([\u4e00-\u9fa5\s]{2,})$/.test(pNumber)){
        return false;
    }
    return true;
}

/*
* 
* 验证日期格式
* return True 正确； False 错误；
*/
Public.CheckDate = function (year, month, day ) {
    var myDate = new Date();
    myDate.setFullYear( year, (month - 1), day );
    return ((myDate.getMonth()+1) == month && day<32); 
}

/*
* 
* 复制
*/
Public.Copy = function(pStr, msg){
    //IE            
    if (window.clipboardData) {
        window.clipboardData.clearData();
        window.clipboardData.setData("Text", pStr);
    // FireFox
    } else if (navigator.userAgent.indexOf("Firefox") > 0) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } 
        catch (e) {
            alert("您的 Firefox 安全限制限制您进行剪贴板操作，请打开 'about:config' 将 'signed.applets.codebase_principal_support' 设置为 'true' 之后重试");
            return false;
        }
        var clip = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
        if (!clip) 
            return;
        var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
        if (!trans) 
            return;
        trans.addDataFlavor('text/unicode');
        var str = new Object();
        var len = new Object();
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        var copytext = pStr;
        str.data = copytext;
        trans.setTransferData("text/unicode", str, copytext.length * 2);
        var clipid = Components.interfaces.nsIClipboard;
        if (!clip) 
            return false;
        clip.setData(trans, null, clipid.kGlobalClipboard);
    } else {
    	alert('您使用的浏览器不支持此复制功能，请使用 Ctrl + C 或鼠标右键。');
    }
    var showMsg = msg ? msg : "内容已复制到剪切板！";
    alert(showMsg);
}

/*
* 
* 字符串控制
*/
Public.String = {};
Public.String.HtmlSpecialChars = function(string){
    var data = [];
    for(var i = 0 ;i <string.length;i++) {
        data.push( "&#"+string.charCodeAt(i)+";");
    }
    return data.join("");
}
Public.String.Cut = function(str, str_long) {
    str = str.trim();
    if (str.length <= (str_long + 1)) {
        return Public.String.HtmlSpecialChars(str);
    } else {
        return str.substring(0, str_long) + "..";
    }
}

/*
* 
* 历史记录
*/
Public.History = {};
Public.History.length = 10;
Public.History.Set = function(pKey,value){
    value = value.trim();
    //value = value.trim();
    var hisCol = Public.History.Get(pKey);
    if(hisCol.length > 0){
        var index = -1;
        for(var i = 0; i < hisCol.length; i++){
            if(hisCol[i] == value){
                index = i;
            }
        }
        if(index > -1){
            hisCol.splice(index,1);
        }
        else{
            var l = hisCol.length;
            if(l == Public.History.length){
                hisCol.splice(0,1);
            }
        }
        hisCol.push(value);
        Public.Cookie.Set("history_" + pKey,hisCol.toString(),24);
    }
    else{
        Public.Cookie.Set("history_" + pKey,value,24);
    }
}
Public.History.Get = function(pKey){
    var name = "history_" + pKey;
    var c = Public.Cookie.Get(name);
    var hisCol;
    if(c != ""){
        hisCol = c.split(',');
    }
    else{
        hisCol = [];
    }
    return hisCol;
}
Public.History.Clear = function(pKey){
    Public.Cookie.Set("history_" + pKey,'');
}


/*
* 
* Cookie 控制
*/
Public.Cookie = {};
Public.Cookie.Set = function(name, value, hours){
  var expire = new Date((new Date()).getTime() + 3600000*24*365);
  if(hours != null){
    expire = new Date((new Date()).getTime() + hours * 3600000);
  }
  expire = "; expires=" + expire.toGMTString();
  document.cookie = name + "=" + escape(value) + expire + '; path=/';
}

Public.Cookie.Get = function(name){
  var cookieValue = "";
  var search = name + "=";
  if(document.cookie.length > 0){ 
    offset = document.cookie.indexOf(search);
    if (offset != -1){ 
      offset += search.length;
      end = document.cookie.indexOf(";", offset);
      if (end == -1) end = document.cookie.length;
      cookieValue = unescape(document.cookie.substring(offset, end))
    }
  }
  return cookieValue;
}

/*
* 
* 别人正在查，翻页
*/
Public.BoxDisplayControl = function(obj){
    var _obj = obj;
    var _pageCol = [];

    var bindingEvent = function(){
        _obj.PreBox.bind("click",function(){
            if(_obj.ActiveStep > 0 && _cutState){
                endCorss();
                _obj.ActiveStep -= 1;
                display();
                startCorss();
            }
        });
        _obj.NextBox.bind("click",function(){
            if(_obj.ActiveStep < _pageCol.length - 1 && _cutState){
                endCorss();
                _obj.ActiveStep += 1;
                display();
                startCorss();
            }
        });
    }
    
    var _cutState = true;

    var display = function(pFast){
        if(_pageCol.length > 0){
            displayBtn();
            for(var i = 0; i < _pageCol.length; i++){
                _pageCol[i].hide();
            }
            _cutState = false;
            if(pFast){
                _pageCol[_obj.ActiveStep].show();
                _cutState = true;
            }
            else{
                _pageCol[_obj.ActiveStep].show("slow",function(){
                    _cutState = true;
                });
            }
        }
    }
    
    var displayBtn = function(){
        if(_obj.ActiveStep > 0){
            _obj.PreBox.addClass(_obj.PreStyle);
            _obj.PreBox.removeClass(_obj.PreDisableStyle);
        }
        else{
            _obj.PreBox.addClass(_obj.PreDisableStyle);
            _obj.PreBox.removeClass(_obj.PreStyle);
        }
        
        if(_obj.ActiveStep < _pageCol.length - 1){
            _obj.NextBox.addClass(_obj.NextStyle);
            _obj.NextBox.removeClass(_obj.NextDisableStyle);
        }
        else{
            _obj.NextBox.addClass(_obj.NextDisableStyle);
            _obj.NextBox.removeClass(_obj.NextStyle);
        }
    }
    
    var corssPage = function(){
        if(_cutState){
            _obj.ActiveStep++;
            if(_obj.ActiveStep > _pageCol.length - 1){
                _obj.ActiveStep = 0;
            }
            display();
        }
    }
    
    var _timer;
    var startCorss = function(){
        if(_pageCol.length > 1){
            _timer = window.setInterval(corssPage,4000);
        }
    }
    
    var endCorss = function(){
        if(_pageCol.length > 1){
            window.clearInterval(_timer);
        }
    }
    
    this.AddPageBox = function(pBox){
        _pageCol.push(pBox);
    }
    this.init = function(){
        bindingEvent();
        _obj.ActiveStep = 0;
        display(true);
        //起动自动翻页
        startCorss();
    }
}

/**
 * 跳转
 */
Public.GotoUrl = function(url){
    window.location.href = url;
}

/**
 * 表格搜索
 */
Public.TableSearch = function(table, keyword){
    if (keyword) {
        keyword = keyword.replace(/\s+/g, '');
    }
    
    if (!keyword) {
        $('tr', table).each(function(){
            $(this).show();
        });
        return;
    }
    
    var pattern = new RegExp(keyword), is_show = false, is_td = false, str = '';
    $('tr', table).each(function(){
        is_show = false;
        is_td = false;
        
        $('td', this).each(function(){
            is_td = true;
            str = $(this).text().replace(/\s+/g, '');
            if (pattern.test(str)) {
                is_show = true;
            }
        });
        
        if (is_td) {
            if (is_show) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        }
    });
}



Public.Config = {
    //遮罩层背景颜色
    Screen_Background: "#999",
    //遮罩层透明度
    Screen_Opacity: "2",
    //遮罩层内容背景颜色
    Screen_ContentBg: "transparent",
    Screen_PositionTop:"0",
    Screen_PositionLeft:"50%"
}
/*
* 弹出层
*/
Public.ScreenManager = {
    //获取滚动条高度
    GetScrollTop:function(){
        var scrollTop=0;
        if(document.documentElement&&document.documentElement.scrollTop){
            scrollTop=document.documentElement.scrollTop;
        }else if(document.body){
            scrollTop=document.body.scrollTop;
        }
        return scrollTop;
    },
    /*Public 隐藏方法*/
    Hide: function(doFun){
        this.canClose = true;
        this.popCoverDiv(false);
        if(doFun){
            doFun();
        }
    },
    /*Public 显示方法*/
    Show: function(containBox,isClickHide){
        if(isClickHide != undefined){
            Public.ScreenManager.IsClickHide = isClickHide;
        }
        else{
            Public.ScreenManager.IsClickHide = false;
        }
        Public.ScreenManager.setMiddle(containBox);
        this.popCoverDiv(true,containBox);
    },
    //取得页面的高宽
    getBodySize: function (){
        var bodySize = [];
        with(document.documentElement) {
            bodySize[0] = (scrollWidth>clientWidth)?scrollWidth:clientWidth;//如果滚动条的宽度大于页面的宽度，取得滚动条的宽度，否则取页面宽度
            bodySize[1] = (scrollHeight>clientHeight)?scrollHeight:clientHeight;//如果滚动条的高度大于页面的高度，取得滚动条的高度，否则取高度
        }
        return bodySize;
    },
    //弹出框居中显示 add:zen
    setMiddle:function(containBox){
        if(isIE6){
            with (document.documentElement) {
                var tops=Public.ScreenManager.GetScrollTop()+85;
            }
            containBox.style.top=tops+"px";
        }else{
            containBox.style.position="fixed";
        }
        return containBox;
    },
    config:{
        cachebox:"screen_cache_box",/*缓存层*/
        contentbox:"screen_content_box",/*内容层*/
        coverbox:"screen_cover_div",/*透明层*/
        gonebox:"screen_gone_box"	/*移位缓存层*/
    },
    canClose:true,
    ShowSelfControl:function(containBox,showFun){
        Public.ScreenManager.IsClickHide = true;
        this.popCoverDiv(3,containBox,undefined,showFun);
    },
    //创建遮盖层
    popCoverDiv: function (isShow,containBox,setWidth,showFun){
        var screenBox = document.getElementById(Public.ScreenManager.config.coverbox);
        if (!screenBox) {
            //如果存在遮盖层，则让其显示
            //否则创建遮盖层
            var coverDiv = document.createElement('div');
            document.body.appendChild(coverDiv);
            coverDiv.id = Public.ScreenManager.config.coverbox;
            var bodySize;
            with(coverDiv.style) {
                if ($.browser.msie && $.browser.version == 6) {
                    position = 'absolute';
                    background = Public.Config.Screen_Background;
                    left = '0px';
                    top = '0px';
                    bodySize = this.getBodySize();
                    width = '100%';
                    height = bodySize[1] + 'px';
                }
                else{
                    position = 'fixed';
                    background = Public.Config.Screen_Background;
                    left = '0';
                    top = '0';
                    width = '100%'
                    height = '100%';
                }
                zIndex = 99;
                if (document.all) {
                    filter = "Alpha(Opacity=" + Public.Config.Screen_Opacity + "0)";	//IE逆境
                } else {
                    opacity = Number("0."+Public.Config.Screen_Opacity);
                }
            }
            coverDiv.onclick = function(){
                if(Public.ScreenManager.canClose){
                    if(Public.ScreenManager.IsClickHide == undefined || Public.ScreenManager.IsClickHide == false){
                        //coverDiv.style.display = "none";
                        //document.getElementById(Public.ScreenManager.config.contentbox).style.display = "none";
						Public.ScreenManager.Hide();
                    }
                }
            };

            var contentDiv = document.createElement("div");
            contentDiv.id = Public.ScreenManager.config.contentbox;
            with(contentDiv.style){
                position = "absolute";
                backgroundColor = Public.Config.Screen_ContentBg;
                var widthNum = Number(setWidth != undefined?setWidth:500);
                width = widthNum + "px";
                left = Public.Config.Screen_PositionLeft;
                var mfNum = widthNum/2;
                marginLeft = "-" + mfNum + 'px';
                top = Public.Config.Screen_PositionTop;
                zIndex = 100;
            }
            document.body.appendChild(contentDiv);
            contentDiv.onmouseover = function(){
                Public.ScreenManager.canClose = false;
            };

            contentDiv.onmouseout = function(){
                Public.ScreenManager.canClose = true;
            };
            screenBox = contentDiv;
        }
        screenBox.style.display = isShow ? "block" : "none" ;
        if(isShow == 3){
            if(showFun){
                showFun();
            }
        }
        else{
            document.getElementById(Public.ScreenManager.config.contentbox).style.display = isShow ? "block" : "none" ;
            if(isShow && containBox){
                //创建Cache Box
                var cacheBox = document.getElementById(Public.ScreenManager.config.cachebox);
                if(!cacheBox){
                    var cBox = document.createElement("div");
                    document.body.appendChild(cBox);
                    cBox.id = Public.ScreenManager.config.cachebox;
                    cBox.style.display = "none";
                    cacheBox = cBox;
                }

                var goneBox = document.getElementById(Public.ScreenManager.config.gonebox);
                if(!goneBox){
                    var gBox = document.createElement("div");
                    document.body.appendChild(gBox);
                    gBox.id = Public.ScreenManager.config.gonebox;
                    gBox.style.display = "none";
                    goneBox = cBox;
                }

                var cBox = document.getElementById(Public.ScreenManager.config.contentbox);
                var contentNodes = cBox.childNodes;
                for(var i = 0,len = contentNodes.length; i < len; i++){
                    cacheBox.appendChild(contentNodes[i]);
                }
                containBox.style.display = "";
                cBox.appendChild(containBox);
            }
        }
		var hide_tags = ["select","iframe"];
		if(isShow){
			for(var iN = 0,Nlen = hide_tags.length; iN < Nlen; iN++){
				var selList = document.getElementsByTagName(hide_tags[iN]);
				for(var i = 0,len = selList.length; i < len; i++){
					selList[i].style.visibility = "hidden";
				}
				selList = containBox.getElementsByTagName(hide_tags[iN]);
				for(var i = 0,len = selList.length; i < len; i++){
					selList[i].style.visibility = "";
				}
			}
		}
		else{
			for(var iN = 0,Nlen = hide_tags.length; iN < Nlen; iN++){
				var selList = document.getElementsByTagName(hide_tags[iN]);
				for(var i = 0,len = selList.length; i < len; i++){
					selList[i].style.visibility = "";
				}
			}
		}
        this.canClose = true;
    }
}
/*
底部导航
*/
Public.Nav=function(){
    document.write('<div class="box-hd"><h3 class="box-t-l">工具导航</h3><a href="/catalog.html" target="_blank" class="box-t-link" >更多</a></div><dl class="tool_map"><dt>生活指南：</dt><dd class="clearfix"><span><a target="_blank" href="/tianqi/" class="red">天气预报</a></span><span><a target="_blank" href="/live/huoche/" class="green">列车时刻表</a></span><span><a target="_blank" href="/live/speed/">网速测试</a></span><span><a target="_blank" href="/shouji/" class="green">手机号码查询</a></span><span><a target="_blank" href="/youbian/">邮编区号</a></span><span><a target="_blank" href="/live/idcard/">身份证查询</a></span><span><a target="_blank" href="/live/fanyi/">在线翻译</a></span><span><a target="_blank" href="/finance/rate/" class="red">汇率查询</a></span><span><a target="_blank" href="/live/calendar/" class="green">万年历</a></span><span><a target="_blank" href="/live/nongli/">黄道吉日</a></span><span><a target="_blank" href="/live/qqtouxiang/" class="red">QQ头像</a></span><span><a target="_blank" href="/live/nannv/" class="green">生男生女</a></span><span><a target="_blank" href="/live/express/">快递查询</a></span><span><a target="_blank" href="/ip/">IP地址</a></span></dd></dl><dl class="tool_map even"><dt>站长工具：</dt><dd class="clearfix"><span><a target="_blank" href="/siteall/" class="green">综合查询</a></span><span><a target="_blank" href="/record/" class="red">网站收录</a></span><span><a target="_blank" href="/alexa/" class="green">Alexa排名</a></span><span><a target="_blank" href="/pr/">PR值查询</a></span><span><a target="_blank" href="/link/" class="red">友情链接查询</a></span><span><a target="_blank" href="/sitespeed/">网站反应速度</a></span></dd></dl><dl class="tool_map" style="border:none;"><dt>转换工具：</dt><dd class="clearfix"><span><a target="_blank" href="/site/utf8/" class="green">UTF-8转换</a></span><span><a target="_blank" href="/site/html2ubb/" class="green">HTML/UBB互转</a></span><span><a target="_blank" href="/site/html2js/">HTML/JS互转</a></span><span><a target="_blank" href="/site/htmlformat/">JS格式化</a></span><span><a target="_blank" href="/site/regular/">正则表达式</a></span><span><a target="_blank" href="/site/effect/" class="red">多彩字生成</a></span></dd></dl>');
}
//动态加载脚本
Public.GetTextWithScript=function(url,callback){
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src=url;
    script.onload=script.onreadystatechange=function(){
        if(!this.readyState||this.readyState == "loaded" || this.readyState == "complete"){
            if(callback){
                callback();
            }
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    }
    head.appendChild(script);
}

var Handle_Bar_Search_URL;
var HandlerBarCopyHandler;

var ShowDelBtn = function(pToolId){
    var r = Public.MyTools.IsExist(pToolId);
    if(Public.MyTools.IsExist(pToolId) != "-1"){
        $("#js_handle_dele").show();
        $("#js_handle_add").hide();
    }
    else{
        $("#js_handle_dele").hide();
        $("#js_handle_add").show();
    }
}

var HandlerBarAddBtn = function(pText,pStyle,pFun){
    $("#js_handler_bar_list_box").append('<a class="pr5" href="javascript://" onclick="' + pFun + '">'+pText+'</a><a class="'+pStyle+'" href="javascript://" title="'+pText+'"></a>')
}

var HandlerBarCopyLocation = function(){
    if(HandlerBarCopyHandler){
        HandlerBarCopyHandler();
    }
    Public.Copy(Handle_Bar_Search_URL,'地址已复制到剪切板！');
}


