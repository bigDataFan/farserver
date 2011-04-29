
  
function Bajax()   
{   

    this._eh = Bajax._error;   
}   
  

Bajax.debug_enable = false;   
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
  
// POST ����   
//��URL, POST���, �ص�����[, �ص���������, �Ƿ��첽]��   
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
  
// ���ó��?�?��   
Bajax.prototype.e_handler = function (func)   
{   
    if(func !== undefined) this._eh = func;   
}   
  
// ����һ�����ݵ�XHR����   
// ����һ�£�IE7�����Ȳ���Native XHR   
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
  
//-- ˽�к��� -----------------------------------------------------------------   
  
Bajax._callback = function (req, callback, data, obj)   
{   
    callback(req, data);   
}   
  
// Debug: ��ʾ���õĻص�����   
Bajax._debugger = function (func)   
{   
    alert('running: ' + Bajax._fname(func));   
}   
  
// Ĭ�ϵĳ��?��   
Bajax._error = function (req, callback)   
{   
    alert(req.statusText + '\nShould run: ' + Bajax._fname(callback));   
}   
  
// ��ȡ����������   
Bajax._fname = function (func)   
{   
    var S = func.toString();   
    return S.slice(9, S.indexOf(')', 10)) + ')';   
}   
//-- End.---------------------------------------------------------------------- 