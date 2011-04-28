/** bajax.js  
 *  Base Ajax 简易封装 2007.07.20  
 *  ---------------------------------------------------------------------------  
 *  >>接口：  
 *      get, post   常用普通接口。  
 *      e_handler   出错处理句柄，可选。  
 *      _object     创建浏览器兼容XHR的包装。  
 *  
 *  >>参数：  
 *      @url:       请求的响应页面；  
 *      @sdata:     POST的数据；  
 *      @callback:  处理响应数据的回调函数；  
 *  
 *  以下参数可选  
 *      @fdata:     传递给回调函数的数据，默认null；  
 *      @asyn:      是否异步，默认true。  
 *  
 *  返回值：  
 *      如果是异步，返回异步请求对象；否则不返回。  
 *  
 *  >>回调函数：  
 *  
 *      回调函数有两个参数：(req, data)  
 *      @req:       异步请求对象（XMLHttpRequest 或 ActiveXObject）  
 *      @data:      传入的附加数据。  
 *  
 *  >>注意：  
 *  
 *      1、传递到回调函数的附加数据可以是数值、字串、数组或对象。  
 *      2、可置e_handler的参数为null来取消出错处理。  
 *   
 *  @Copyright: GNU - LGPL.  
 *  ---------------------------------------------------------------------------  
 */  
  
function Bajax()   
{   
    // 默认出错处理   
    this._eh = Bajax._error;   
}   
  
// 调试设置   
Bajax.debug_enable = false;   
  
//-- 用户接口 -----------------------------------------------------------------   
  
// GET 请求   
//（URL, 回调函数[, 回调函数附加数据, 是否异步]）   
Bajax.prototype.get = function (url, callback, fdata, asyn)   
{   
    fdata = (fdata === undefined)? null: fdata;   
    asyn = (asyn === undefined)? true: asyn;   
    var _self = this;   
  
    var X = Bajax._object();   
    if(asyn)   
        X.onreadystatechange = function()   
        { Bajax._callback(X, callback, fdata, _self); };   
    X.open('GET', url, asyn);   
  
    if(Bajax.debug_enable)   
        Bajax._debugger(callback);   
  
    X.send(null);   
  
    if(asyn){   
        return X;   
    }else{   
        Bajax._callback(X, callback, fdata, _self);   
    }   
}   
  
// POST 请求   
//（URL, POST数据, 回调函数[, 回调函数附加数据, 是否异步]）   
Bajax.prototype.post = function (url, sdata, callback, fdata, asyn)   
{   
    fdata = (fdata === undefined)? null: fdata;   
    asyn = (asyn === undefined)? true: asyn;   
    var _self = this;   
  
    var X = Bajax._object();   
    if(asyn)   
        X.onreadystatechange = function()   
        { Bajax._callback(X, callback, fdata, _self); };   
    X.open('POST', url, asyn);   
  
    if(Bajax.debug_enable)   
        Bajax._debugger(callback);   
  
    X.setRequestHeader('Content-length', sdata.length);   
    X.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');   
  
    X.send(sdata);   
  
    if(asyn){   
        return X;   
    }else{   
        Bajax._callback(X, callback, fdata, _self);   
    }   
}   
  
// 设置出错处理函数   
Bajax.prototype.e_handler = function (func)   
{   
    if(func !== undefined) this._eh = func;   
}   
  
// 创建一个兼容的XHR对象。   
// 改了一下：IE7中优先采用Native XHR   
Bajax._object = function()   
{   
    var A;   
    if(typeof XMLHttpRequest != 'undefined') {   
        A = new XMLHttpRequest();   
    }else{   
        var _msxmlhttp = new Array(   
            'Msxml2.XMLHTTP.6.0',   
            'Msxml2.XMLHTTP.3.0',   
            'Msxml2.XMLHTTP',   
            'Microsoft.XMLHTTP');   
        for(var i = 0; i < _msxmlhttp.length; i++) {   
            try {   
                if(A = new ActiveXObject(_msxmlhttp[i])) break;   
            } catch (e) {   
                A = null;   
            }   
        }   
    }   
    if(!A)   
        alert("Could not create connection object.");   
    return A;   
}   
  
//-- 私有函数 -----------------------------------------------------------------   
  
Bajax._callback = function (req, callback, data, obj)   
{   
    callback(req, data);   
}   
  
// Debug: 显示采用的回调函数。   
Bajax._debugger = function (func)   
{   
    alert('running: ' + Bajax._fname(func));   
}   
  
// 默认的出错处理   
Bajax._error = function (req, callback)   
{   
    alert(req.statusText + '\nShould run: ' + Bajax._fname(callback));   
}   
  
// 提取函数名（含参数）   
Bajax._fname = function (func)   
{   
    var S = func.toString();   
    return S.slice(9, S.indexOf(')', 10)) + ')';   
}   
//-- End.---------------------------------------------------------------------- 