var using = window.using = function (f, o, c) {function t(u) {
            var a = u;
            if (u && u.substring(0, 4) == "url(") {
                a = u.substring(4, u.length - 1)
            }
            var s = using.registered[a];
            return (!s && (!using.__durls || !using.__durls[a]) && u && u.length > 4 && u.substring(0, 4) == "url(")
        }
        var j = -1;
        var l = new Array();
        if (typeof (f) != "string" && f.length) {
            var p = f;
            for (var q = 0; q < p.length; q++) {
                if (using.registered[p[q]] || t(p[q])) {
                    l.push(p[q])
                }
            }
            f = l[0];
            j = 1
        } else {
            while (typeof (arguments[++j]) == "string") {
                if (using.registered[f] || t(f)) {
                    l.push(arguments[j])
                }
            }
        }
        o = arguments[j];
        c = arguments[++j];
        if (l.length > 1) {
            var g = o;
            o = function () {
                using(l, g, c)
            }
        }
        var d = using.registered[f];
        if (!using.__durls) {
            using.__durls = {}
        }
        if (t(f) && f.substring(0, 4) == "url(") {
            f = f.substring(4, f.length - 1);
            if (!using.__durls[f]) {
                l[0] = f;
                using.register(f, true, f);
                d = using.registered[f];
                var h = using.prototype.getCallbackQueue(f);
                var m = new using.prototype.CallbackItem(function () {
                    using.__durls[f] = true
                });
                h.push(m);
                h.push(new using.prototype.CallbackItem(o, c));
                o = undefined;
                c = undefined
            }
        }
        if (d) {
            for (var b = d.requirements.length - 1; b >= 0; b--) {
                if (using.registered[d.requirements[b].name]) {
                    using(d.requirements[b].name, function () {
                        using(f, o, c)
                    }, c);
                    return
                }
            }
            for (var n = 0; n < d.urls.length; n++) {
                if (n == d.urls.length - 1) {
                    if (o) {
                        using.load(d.name, d.urls[n], d.remote, d.asyncWait, new using.prototype.CallbackItem(o, c))
                    } else {
                        using.load(d.name, d.urls[n], d.remote, d.asyncWait)
                    }
                } else {
                    using.load(d.name, d.urls[n], d.remote, d.asyncWait)
                }
            }
        } else {
            var g = o;
            if (g) {
                g.call(c)
            }
        }
    };
using.prototype = {
    CallbackItem: function (a, b) {
        this.callback = a;
        this.context = b;
        this.invoke = function () {
            if (this.context) {
                this.callback.call(this.context)
            } else {
                this.callback()
            }
        }
    },
    Registration: function (j, d, f, m, b) {
        this.name = j;
        var h = 0;
        var n = arguments[++h];
        var l = true;
        if (typeof (n) == "string") {
            for (var g = 0; g < n.length; g++) {
                if ("1234567890.".indexOf(n.substring(g)) == -1) {
                    l = false;
                    break
                }
            }
            if (l) {
                this.version = n;
                n = arguments[++h]
            } else {
                this.version = "1.0.0"
            }
        }
        if (n && typeof (n) == "boolean") {
            this.remote = n;
            n = arguments[++h]
        } else {
            this.remote = false
        }
        if (n && typeof (n) == "number") {
            this.asyncWait = m
        } else {
            this.asyncWait = 0
        }
        this.urls = new Array();
        if (n && n.length && typeof (n) != "string") {
            this.urls = n
        } else {
            for (h = h; h < arguments.length; h++) {
                if (arguments[h] && typeof (arguments[h]) == "string") {
                    this.urls.push(arguments[h])
                }
            }
        }
        this.requirements = new Array();
        this.requires = function (c, a) {
            if (!a) {
                a = "1.0.0"
            }
            this.requirements.push({
                name: c,
                minVersion: a
            });
            return this
        };
        this.register = function (c, a, o, q, p) {
            return using.register(c, a, o, q, p)
        };
        return this
    },
    register: function (b, a, d, g, f) {
        var c;
        if (typeof (b) == "object") {
            c = b;
            c = new using.prototype.Registration(c.name, c.version, c.remote, c.asyncWait, f)
        } else {
            c = new using.prototype.Registration(b, a, d, g, f)
        }
        if (!using.registered) {
            using.registered = {}
        }
        if (using.registered[b] && window.console) {
            window.console.log('Warning: Resource named "' + b + '" was already registered with using.register(); overwritten.')
        }
        using.registered[b] = c;
        return c
    },
    wait: 0,
    defaultAsyncWait: 250,
    getCallbackQueue: function (b) {
        if (!using.__callbackQueue) {
            using.__callbackQueue = {}
        }
        var a = using.__callbackQueue[b];
        if (!a) {
            a = using.__callbackQueue[b] = new Array()
        }
        return a
    },
    load: function (f, j, d, h, a) {
        if (h == undefined) {
            h = using.wait
        }
        if (d && h == 0) {
            h = using.defaultAsyncWait
        }
        if (!using.loadedScripts) {
            using.loadedScripts = {}
        }
        var b = using.prototype.getCallbackQueue(j);
        if (using.loadedScripts[f]) {
            b.push(new using.prototype.CallbackItem(function () {
                using.registered[f] = undefined
            }, null));
            if (a) {
                b.push(a);
                if (b.length > 2) {
                    return
                }
            }
            if (b) {
                for (var c = 0; c < b.length; c++) {
                    b[c].invoke()
                }
            }
            using.__callbackQueue[j] = undefined;
            return
        }
        b.push(new using.prototype.CallbackItem(function () {
            if (using.registered[f]) {
                using.loadedScripts[f] = using.registered[f]
            }
            using.registered[f] = undefined
        }, null));
        if (a) {
            b.push(a);
            if (b.length > 2) {
                return
            }
        }
        if (d) {
            using.srcScript(j, h, b)
        } else {
            var g;
            if (window.XMLHttpRequest) {
                g = new XMLHttpRequest()
            } else {
                if (window.ActiveXObject) {
                    g = new ActiveXObject("Microsoft.XMLHTTP")
                }
            }
            g.onreadystatechange = function () {
                if (g.readyState == 4 && g.status == 200) {
                    using.injectScript(g.responseText, f);
                    if (b) {
                        for (var l = 0; l < b.length; l++) {
                            b[l].invoke()
                        }
                    }
                    using.__callbackQueue[j] = undefined
                }
            };
            if (h > 0 || b.length > 1) {
                g.open("GET", j, true)
            } else {
                g.open("GET", j, false)
            }
            g.send(null)
        }
    },
    genScriptNode: function () {
        var a = document.createElement("script");
        a.setAttribute("type", "text/javascript");
        a.setAttribute("language", "JavaScript");
        return a
    },
    srcScript: function (g, f, d) {
        var a = using.prototype.genScriptNode();
        a.setAttribute("src", g);
        if (d) {
            var b = function () {
                    using.__callbackQueue[g] = undefined;
                    for (var h = 0; h < d.length; h++) {
                        d[h].invoke()
                    }
                    d = new Array()
                };
            a.onload = a.onreadystatechange = function () {
                if ((!a.readyState) || a.readyState == "loaded" || a.readyState == "complete" || a.readyState == 4 && a.status == 200) {
                    if (f > 0) {
                        setTimeout(b, f)
                    } else {
                        b()
                    }
                }
            }
        }
        var c = document.getElementsByTagName("head")[0];
        c.appendChild(a)
    },
    injectScript: function (b, f) {
        var a = using.prototype.genScriptNode();
        try {
            a.setAttribute("name", f)
        } catch (d) {}
        a.text = b;
        var c = document.getElementsByTagName("head")[0];
        c.appendChild(a)
    }
};
using.register = using.prototype.register;
using.load = using.prototype.load;
using.wait = using.prototype.wait;
using.defaultAsyncWait = using.prototype.defaultAsyncWait;
using.srcScript = using.prototype.srcScript;
using.injectScript = using.prototype.injectScript;
if (jQuery) {
    (function (f) {
        var a = [],
            j = 0;
        f.jsonp_org = f.jsonp;
        var h = function (p, o) {
                f.extend(p, {
                    nsp_sid: f.cookie("session"),
                    nsp_ts: j + new Date().getTime()
                });
                if (typeof o == "function") {
                    o(p)
                }
                c(p);
                return p
            };
        var c = function (t) {
                var r = g(t);
                var o;
                var s;
                if (f.cookie("secret")) {
                    s = f.cookie("secret") + r;
                    f.extend(t, {
                        nsp_key: f.md5(s).toLocaleUpperCase()
                    })
                } else {
                    var q = "secretFlash";
                    var p = nsp.netdisk.getConfigInfo(q);
                    o = nsp.netdisk.getcommon(p.sharedobject, q);
                    if (o != null) {
                        s = o + r;
                        f.extend(t, {
                            nsp_key: f.md5(s).toLocaleUpperCase()
                        })
                    } else {
                        f.extend(t, {
                            nsp_key: null
                        })
                    }
                }
            };
        var g = function (q) {
                var o = [];
                var r = [];
                f.each(q, function (s) {
                    if (s !== "nsp_key") {
                        r.push(s)
                    }
                });
                r.sort();
                for (var p = 0; p < r.length; p++) {
                    if (r[p] != "nsp_cb") {
                        o.push(r[p] + q[r[p]])
                    } else {
                        o.push("nsp_cb_jqjsp")
                    }
                }
                return o.join("")
            };
        var l = function (o) {
                this.success = function (q, r) {
                    var p = this;
                    if (q.error && q.NSP_STATUS === 109 && p.retrynum < 1) {
                        p.retrynum++;
                        if (j === 0) {
                            f.nsp({}, function (u, v) {
                                var s = /Date:(.*)/g.exec(v);
                                var t = s[1];
                                j = Date.parse(t) - new Date().getTime();
                                delete o.data.nsp_ts;
                                p.retry()
                            })
                        }
                    } else {
                        o.success(q, r);
                        b()
                    }
                };
                this.send_request = function () {
                    var p = f.extend(true, {}, o, {
                        success: m,
                        my_handler: this
                    });
                    if (f.cookie("secret")) {
                        if (!p.data.nsp_cb || !p.data.nsp_ts || p.data.nsp_ts == "" || p.data.nsp_key == null) {
                            f.extend(p.data, {
                                nsp_fmt: "JS",
                                nsp_cb: "_jqjsp"
                            });
                            h(p.data, o.data_post_process)
                        }
                        f.jsonp_org(p)
                    } else {
                        Rookie(function () {
                            if (!p.data.nsp_cb || !p.data.nsp_ts || p.data.nsp_ts == "" || p.data.nsp_key == null) {
                                f.extend(p.data, {
                                    nsp_fmt: "JS",
                                    nsp_cb: "_jqjsp"
                                });
                                h(p.data, o.data_post_process)
                            }
                            f.jsonp_org(p)
                        }, function () {
                            if (!p.data.nsp_cb || !p.data.nsp_ts || p.data.nsp_ts == "" || p.data.nsp_key == null) {
                                f.extend(p.data, {
                                    nsp_fmt: "JS",
                                    nsp_cb: "_jqjsp"
                                });
                                h(p.data, o.data_post_process)
                            }
                            f.jsonp_org(p)
                        })
                    }
                };
                this.retrynum = 0;
                this.retry = this.send_request
            };
        var n = function (o, q, p) {
                p.success(o, q)
            };
        var m = function (o, p) {
                n.call(this, o, p, this.my_handler)
            };
        var b = function () {
                if (a.length) {
                    var p = a.shift();
                    var o = new l(p);
                    o.send_request()
                }
            };
        var d = function (q, p, o) {
                using.register("io", true, "global/js/dbank.io.js?v=2.5.9");
                using.register("dom", true, "global/js/dbank.dom.js?v=2.5.9");
                using.register("json", true, "global/js/dbank.json.js?v=2.5.9");
                using.register("deferred", true, "js/deferred.js?v=2.5.9");
                using(["io", "dom", "json", "deferred"], function () {
                    var s = "http://api.dbank.com";
                    var t = {};
                    t.url = "http://api.dbank.com/rest.php";
                    t.param = q;
                    var r = function (u) {
                            window.console && console.log("return me from xdr once  only !!!");
                            if (typeof p == "function") {
                                window.console && console.log("call onsuccess only once!");
                                p(dbank.json.parse(u.data), u.header)
                            }
                        };
                    dbank.io.xdr.send(t, r, s)
                })
            };
        f.extend({
            buildData: h,
            nsp: d,
            jsonp: function (o) {
                a.push(o);
                if (a.length === 1) {
                    b()
                }
            },
            iAjaxSetting: function (o) {
                if (typeof (o) === "function") {
                    n = o
                }
                if (typeof (o) === "object" && typeof (o.success) === "function") {
                    n = o.success
                }
            }
        })
    }(jQuery))
}
if (typeof dbank == "undefined" || !dbank) {
    var dbank = {}
}
dbank.namespace = function (c) {
    var a = c.split(".");
    var b = dbank;
    for (i = (a[0] == "dbank") ? 1 : 0; i < a.length; i++) {
        b[a[i]] = b[a[i]] || {};
        b = b[a[i]]
    }
    return b
};
if (!dbank.util) {
    dbank.util = {}
}
dbank.util.Extend = function () {
    var a = arguments;
    if (a.length == 1) {
        a = [this, a[0]]
    }
    for (var b in a[1]) {
        a[0][b] = a[1][b];
        if (a[1][b] instanceof Function) {
            a[0][b]._name = b
        }
    }
    return a[0]
};
dbank.util.Class = function () {};
dbank.util.Class.prototype.construct = function () {};
dbank.util.Class.extend = function (c) {
    var a = function () {
            if (arguments[0] !== dbank.util.Class) {
                return this.construct.apply(this, arguments)
            }
        };
    var b = new this(dbank.util.Class);
    b._juc_parent = new this(dbank.util.Class);
    b.parent = function () {
        var d = this.parent.caller._name,
            f = this._juc_parent[d];
        if (!f) {
            throw new Error('The method "' + d + '" has no parent.')
        }
        return f.apply(this, arguments)
    };
    dbank.util.Extend(b, c);
    a.prototype = b;
    a.extend = this.extend;
    return a
};
if (!nsp) {
    var nsp = {}
}
if (!nsp.netdisk) {
    nsp.netdisk = {}
}(function () {
    nsp.netdisk.url = "http://api.dbank.com/rest.php";
    var path_id_map = {};
    var __Cache__ = {};
    var __RootId__;
    var path_name_regex = /(^.*)\/([^\/]*$)/;
    var cache_get = function (pid, type) {
            var ret = __Cache__[pid];
            if (!pid) {
                ret = __Cache__[__RootId__]
            }
            if (typeof ret != "undefined" && (parseInt(ret.fileCount) == 0 && parseInt(ret.dirCount) == 0 || parseInt(ret.fileCount) + parseInt(ret.dirCount) == ret.childList.length || type == 1 && ret.childList[0].type == "File" || type == 2 && ret.childList[0].type == "Directory")) {
                return ret
            }
        };
    var cache_put = function (tree) {
            if (typeof tree === "array") {
                for (var i = 0; i < tree.length; i++) {
                    cache_put(tree[i])
                }
            } else {
                if (tree && tree.type == "Directory" && (tree.childList || (parseInt(tree.fileCount) == 0 && parseInt(tree.dirCount) == 0))) {
                    __Cache__[tree.id] = tree;
                    if (tree.pid == "d.0" && tree.dbank_systemType == 3) {
                        __RootId__ = tree.id
                    }
                    if (tree.childList) {
                        for (var i = 0; i < tree.childList.length; i++) {
                            cache_put(tree.childList[i])
                        }
                    }
                }
            }
        };
    var nsp_invoke = function (data, onsuccess, onerror) {
            if ($.cookie("session")) {
                if ($.cookie("secret")) {
                    $.buildData(data)
                } else {
                    Rookie(function () {
                        $.buildData(data)
                    }, function () {
                        $.buildData(data)
                    })
                }
                if ($.param(data).length >= 2000) {
                    var params = {
                        url: nsp.netdisk.url,
                        method: "post",
                        params: data
                    };
                    if ($.fn.jquery == "1.3.2") {
                        params = reparam(params)
                    }
                    var parseToJSON = function (data, callback) {
                            if (data && typeof data == "string") {
                                if (data.match(/^_jqjsp/) == "_jqjsp" && data.length > 7) {
                                    data = data.substring(7, data.length - 1);
                                    if ($.fn.jquery == "1.3.2") {
                                        data = reparseJSON($.trim(data))
                                    } else {
                                        data = $.parseJSON($.trim(data))
                                    }
                                    if (typeof data == "object" && callback) {
                                        callback(data)
                                    } else {
                                        if (typeof data == "string" && callback) {
                                            callback(data)
                                        } else {
                                            if (typeof data == "boolean" && callback) {
                                                callback(data)
                                            } else {
                                                callback({
                                                    error: "fail"
                                                })
                                            }
                                        }
                                    }
                                } else {
                                    if ($.fn.jquery == "1.3.2") {
                                        data = reparseJSON($.trim(data))
                                    } else {
                                        data = $.parseJSON($.trim(data))
                                    }
                                    if (typeof data == "object" && callback) {
                                        callback(data)
                                    } else {
                                        if (typeof data == "string" && callback) {
                                            callback(data)
                                        } else {
                                            if (typeof data == "boolean" && callback) {
                                                callback(data)
                                            } else {
                                                callback({
                                                    error: "fail"
                                                })
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (data && typeof data == "object") {
                                    callback(data)
                                } else {
                                    callback({
                                        error: "fail"
                                    })
                                }
                            }
                        };
                    var currentHost = location.host;
                    jQuery.ajax({
                        type: "post",
                        url: "http://" + currentHost + "/app/web/cross_request.php",
                        data: params,
                        dataType: "text",
                        timeout: 30000,
                        success: function (data) {
                            parseToJSON(data, onsuccess)
                        },
                        pageCache: true,
                        error: function (data) {
                            parseToJSON(data, onerror)
                        }
                    })
                } else {
                    var svc = data.nsp_svc;
                    var type = data.type;
                    var cache;
                    var right;
                    cache = checkCacheStatus(svc, type);
                    if (cache) {
                        Rookie(function () {
                            if (type) {
                                var cacheData = getCache(svc, type)
                            } else {
                                var cacheData = getCache(svc)
                            }
                            if (cacheData != null) {
                                onsuccess(cacheData)
                            } else {
                                $.jsonp({
                                    url: nsp.netdisk.url,
                                    data: data,
                                    dataType: "jsonp",
                                    callbackParameter: "nsp_cb",
                                    timeout: 30000,
                                    success: function (data) {
                                        if (data.NSP_STATUS > 0 && data.NSP_STATUS <= 109) {
                                            try {
                                                if (typeof dbank.util.login_timeout_fun == "function") {
                                                    var isstop = dbank.util.login_timeout_fun();
                                                    if (isstop) {
                                                        onerror(data);
                                                        return false
                                                    }
                                                }
                                                dbank.util.login({
                                                    success: function () {}
                                                })
                                            } catch (e) {}
                                        } else {
                                            if (type) {
                                                putCache(data, svc, type)
                                            } else {
                                                putCache(data, svc)
                                            }
                                            onsuccess(data)
                                        }
                                    },
                                    pageCache: true,
                                    error: onerror
                                })
                            }
                        }, function () {
                            $.jsonp({
                                url: nsp.netdisk.url,
                                data: data,
                                dataType: "jsonp",
                                callbackParameter: "nsp_cb",
                                timeout: 30000,
                                success: function (data) {
                                    if (data.NSP_STATUS > 0 && data.NSP_STATUS <= 109) {
                                        try {
                                            if (typeof dbank.util.login_timeout_fun == "function") {
                                                var isstop = dbank.util.login_timeout_fun();
                                                if (isstop) {
                                                    onerror(data);
                                                    return false
                                                }
                                            }
                                            dbank.util.login({
                                                success: function () {}
                                            })
                                        } catch (e) {}
                                    } else {
                                        onsuccess(data)
                                    }
                                },
                                pageCache: true,
                                error: onerror
                            })
                        })
                    } else {
                        $.jsonp({
                            url: nsp.netdisk.url,
                            data: data,
                            dataType: "jsonp",
                            callbackParameter: "nsp_cb",
                            timeout: 30000,
                            success: function (data) {
                                if (data.NSP_STATUS > 0 && data.NSP_STATUS <= 109) {
                                    try {
                                        if (typeof dbank.util.login_timeout_fun == "function") {
                                            var isstop = dbank.util.login_timeout_fun();
                                            if (isstop) {
                                                onerror(data);
                                                return false
                                            }
                                        }
                                        $("#mashead .userguide").show();
                                        $("#hd .hd_nav").show();
                                        dbank.util.login({
                                            success: function () {}
                                        })
                                    } catch (e) {}
                                } else {
                                    onsuccess(data)
                                }
                            },
                            pageCache: true,
                            error: onerror
                        })
                    }
                }
            } else {
                try {
                    if (typeof dbank.util.login_timeout_fun == "function") {
                        var isstop = dbank.util.login_timeout_fun();
                        if (isstop) {
                            onerror(data);
                            return false
                        }
                    }
                    dbank.util.login({
                        success: function () {}
                    })
                } catch (e) {}
            }
        };
    var user_info;
    var disk_info;
    var user_info_requests = [];
    var userinfo = function (o) {
            if (typeof user_info != "undefined" && !o.nocache) {
                o.success(user_info);
                return
            }
            var param = {
                nsp_svc: "nsp.user.getInfo",
                attrs: '["profile.link_access_switch","profile.dlink_white_list","profile.dlink_switch","product.fileuploadsize","user.status","user.username","user.email","user.uid","product.spacecapacity", "profile.spaceextcapacity", "profile.usedspacecapacity","profile.orderenddate", "profile.productid", "profile.extra_apps", "product.productname","profile.dbank_skin","profile.dbank_avatar_type","profile.dbank_avatar","profile.paycapacity","profile.interval","profile.last_login_ip","profile.dbank_outlink","profile.dbank_netdisk","profile.dbank_outlink_file","profile.login_setter_status","product.linkfilesize","product.package","product.medal","profile.card_type","plugin.dl","plugin.netdisk","product.tryvip68","product.tryvip990","profile.pwd_switch","profile.direct_switch"]'
            };
            user_info_requests.push(o);
            if (user_info_requests.length > 0) {
                var success = function (data) {
                        user_info = {
                            totalSpace: parseFloat(data["product.spacecapacity"]) + parseFloat(data["profile.spaceextcapacity"]),
                            useredSpace: data["profile.usedspacecapacity"],
                            productId: data["profile.productid"],
                            productname: data["product.productname"],
                            userName: data["user.username"],
                            orderenddate: data["profile.orderenddate"],
                            email: data["user.email"],
                            extra_apps: data["profile.extra_apps"],
                            dbank_skin: data["profile.dbank_skin"],
                            dbank_avatar_type: data["profile.dbank_avatar_type"],
                            fileuploadsize: data["product.fileuploadsize"],
                            dbank_avatar: data["profile.dbank_avatar"],
                            uid: data["user.uid"],
                            rankSpace: data["product.spacecapacity"],
                            paycapacity: data["profile.paycapacity"],
                            interval: data["profile.interval"],
                            linkfilesize: data["product.linkfilesize"],
                            dlink_switch: data["profile.dlink_switch"],
                            dlink_white_list: data["profile.dlink_white_list"],
                            productpackage: data["product.package"],
                            link_access_switch: data["profile.link_access_switch"],
                            medal: data["product.medal"],
                            card_type: data["profile.card_type"],
                            plugindl: data["plugin.dl"],
                            pluginnetdisk: data["plugin.netdisk"],
                            tryvip68: data["product.tryvip68"],
                            tryvip990: data["product.tryvip990"],
                            pwd_switch: data["profile.pwd_switch"],
                            direct_switch: data["profile.direct_switch"]
                        };
                        o.success(user_info)
                    };
                var error = function (errno, error) {
                        if (typeof o.error === "function") {
                            o.error(errno, error)
                        }
                    };
                return nsp_invoke(param, success, error)
            }
        };
    var diskinfo = function (o) {
            if (typeof o.nocache === "undefined") {
                o.nocache = true
            }
            return userinfo(o)
        };
    var lsdir = function (o) {
            var addId = function (data, parentPath, pid) {
                    if ($.isArray(data)) {
                        for (var i = 0; i < data.length; i++) {
                            first = false;
                            addId(data[i], parentPath, pid)
                        }
                    } else {
                        if (data) {
                            if (pid) {
                                data.pid = pid
                            }
                            if (parentPath) {
                                data.path = parentPath
                            } else {
                                data.path = "/";
                                data.id = "d.0"
                            }
                            if (data.name) {
                                if (data.path == "/") {
                                    data.path += data.name
                                } else {
                                    data.path += "/" + data.name
                                }
                                data.id = $.md5(data.path);
                                if (data.dbank_srcpath) {
                                    data.dbank_srcpath_display = data.dbank_srcpath.replace(/^\/Netdisk/, "/我的网盘").replace(/^\/Syncbox/, "/爱同步")
                                }
                                if (data.pid == "d.0") {
                                    if (data.dbank_systemType == 3) {
                                        data.name = "我的网盘"
                                    } else {
                                        if (data.dbank_systemType == 901) {
                                            data.name = "我的pc文件夹"
                                        } else {
                                            if (data.dbank_systemType == 5) {
                                                data.name = "回收站"
                                            }
                                        }
                                    }
                                }
                                path_id_map[data.id] = {
                                    path: data.path,
                                    pid: data.pid,
                                    name: data.name
                                }
                            }
                            if (data.childList) {
                                addId(data.childList, data.path, data.id)
                            }
                        }
                    }
                };
            var param = {
                nsp_svc: "nsp.vfs.lsdir"
            };
            if (!o.path && (!o.pid || o.pid == "d.0")) {
                $.extend(param, {
                    recursive: 2
                })
            }
            if (o.pid) {
                param.path = path_of(o.pid)
            }
            if (o.path) {
                param.path = o.path
            }
            param.fields = "[";
            if (o.fields && $.isArray(o.fields)) {
                $.each(o.fields, function (i, d) {
                    param.fields += '"' + d + '",'
                })
            }
            param.fields += '"name","size","type","dirCount","fileCount","dbank_systemType","dbank_isShared","modifyTime","dbank_status","dbank_srcpath","dbank_srcname","accessTime","url"]';
            if (o.type) {
                param.type = o.type
            }
            if (o.recursive) {
                param.recursive = o.recursive
            }
            var success = function (data) {
                    if (data.error) {
                        o.error(10055, data.error);
                        return
                    }
                    if (o.pid) {
                        data.id = o.pid
                    }
                    data.type = "Directory";
                    addId(data, param.path);
                    if (path_id_map[o.pid]) {
                        data.pid = path_id_map[o.pid].pid;
                        data.name = path_id_map[o.pid].name
                    }
                    if (!o.path && (!o.pid || o.pid == "d.0")) {
                        o.success(data.childList)
                    } else {
                        var attr_param = {
                            files: '["' + param.path + '"]',
                            fields: '["dirCount","fileCount","dbank_isShared","dbank_systemType"]',
                            success: function (attdata) {
                                if (attdata.successList && attdata.successList.length) {
                                    data.dirCount = attdata.successList[0].dirCount;
                                    data.fileCount = attdata.successList[0].fileCount;
                                    data.dbank_isShared = attdata.successList[0].dbank_isShared;
                                    data.dbank_systemType = attdata.successList[0].dbank_systemType
                                }
                                o.success(data)
                            },
                            error: o.error
                        };
                        nsp.netdisk.getFileInfo(attr_param)
                    }
                };
            return nsp_invoke(param, success, o.error)
        };
    var mbStringLength = function (s) {
            var totalLength = 0;
            var i;
            var charCode;
            for (i = 0; i < s.length; i++) {
                charCode = s.charCodeAt(i);
                if (charCode < 127) {
                    totalLength = totalLength + 1
                } else {
                    totalLength += 2
                }
            }
            return totalLength
        };
    var mkdir = function (o) {
            if ((!o.pid && !o.path) || !o.name) {
                o.error(1001, "parameter invalid");
                return
            }
            var param = {
                nsp_svc: "nsp.vfs.mkfile"
            };
            if (o.path) {
                param.path = o.path
            } else {
                if (o.pid) {
                    param.path = path_of(o.pid)
                }
            }
            if (mbStringLength(param.path) + mbStringLength(o.name) > 199) {
                o.error(10004, "path is too large");
                return
            }
            param.files = '[{"name":"' + o.name + '","type":"Directory"}]';
            var success = function (data) {
                    if (data.successList.length) {
                        o.success(data)
                    } else {
                        if (data.failList.length) {
                            o.error(data.failList[0].errCode, data.failList[0].errMsg)
                        }
                    }
                };
            return nsp_invoke(param, success, o.error)
        };
    var check_name = function (name, files) {
            files = files.toString().toLowerCase().split(",");
            while ($.inArray(name.toLowerCase(), files) != -1) {
                name = addName(name)
            }
            return name
        };
    var mkfile = function (o) {
            if (!o.files || (!o.pid && !o.path)) {
                o.error(1001, "parameter invalid");
                return
            }
            var param = {
                nsp_svc: "nsp.vfs.mkfile"
            };
            if (o.path) {
                param.path = o.path
            } else {
                param.path = path_of(o.pid)
            }
            var files = eval(o.files);
            var files_arry = [];
            var use_able_space = 0;
            var success = function (data) {
                    var filenames = [];
                    $.each(data.childList, function () {
                        filenames.push(this.name)
                    });
                    $.each(files, function () {
                        if (parseInt(this.size) > use_able_space) {
                            o.error(10072, "网盘可用空间不足");
                            return
                        }
                        use_able_space -= parseInt(this.size);
                        this.type = "File";
                        this.name = check_name(this.name, filenames);
                        results = [];
                        object = this;
                        for (var property in object) {
                            var value = object[property];
                            if (value !== undefined) {
                                results.push('"' + property + '":"' + value + '"')
                            }
                        }
                        files_arry.push("{" + results.join(",") + "}")
                    });
                    param.files = "[" + files_arry.join(",") + "]";
                    var mkfile_success = function (data) {
                            user_info = undefined;
                            o.success(data)
                        };
                    return nsp_invoke(param, mkfile_success, o.error)
                };
            var disk_info_param = {
                success: function (data) {
                    use_able_space = parseInt(data.totalSpace) - parseInt(data.useredSpace);
                    var lsdir_param = {
                        path: param.path,
                        type: 3,
                        nsp_svc: "nsp.vfs.lsdir"
                    };
                    return nsp_invoke(lsdir_param, success)
                },
                error: o.error
            };
            return diskinfo(disk_info_param)
        };
    var rename = function (o) {
            if (!o.name) {
                o.error(1001, "parameter invalid");
                return
            }
            var param = {
                nsp_svc: "nsp.vfs.movefile"
            };
            var path;
            if (o.path) {
                path = o.path
            } else {
                path = path_of(o.id)
            }
            var pid = $.md5(path.match(path_name_regex)[1]);
            param.files = '["' + path + '"]';
            path = path.match(path_name_regex)[1] + "/" + o.name;
            param.path = path;
            path_id_map[$.md5(path)] = {
                path: path,
                name: o.name,
                pid: pid
            };
            var success = function (data) {
                    if (data.successList.length) {
                        $.each(data.successList, function () {
                            this.oid = o.id;
                            this.id = $.md5(path)
                        });
                        o.success(data)
                    } else {
                        if (data.failList.length) {
                            o.error(data.failList[0].errCode, data.failList[0].errMsg)
                        }
                    }
                };
            return nsp_invoke(param, success, o.error)
        };
    var isRecycle = function (files_str) {
            var files = eval(files_str);
            var a = false;
            $.each(files, function () {
                if (this.substring(0, 8) == "/Recycle") {
                    a = true
                }
            });
            return a
        };
    var rmfile = function (o) {
            if (!o.files) {
                o.error(1001, "parameter invalid");
                return
            }
            var param = {
                nsp_svc: "nsp.vfs.rmfile",
                reserve: true
            };
            var special_char_files = [];
            var temp = [];
            var rm_files = param.files = str_to_array_files(o.files, temp);
            $.each(eval(rm_files), function () {
                var fname = this.match(path_name_regex)[2];
                if (fname.match(/[<>:"\/\\|\?\*]+/g)) {
                    special_char_files.push(fname)
                }
            });
            if (special_char_files.length > 0) {
                o.error(11111, "您要删除的文件含有特殊字符，请重命名后再作操作");
                return
            }
            var success = function (data) {
                    if (data.successList) {
                        user_info = undefined;
                        $.each(data.successList, function () {
                            this.id = temp[this.name]
                        })
                    }
                    if (data.failList) {
                        $.each(data.failList, function () {
                            this.id = temp[this.name]
                        })
                    }
                    o.success(data)
                };
            if (isRecycle(param.files)) {
                param.reserve = 0
            }
            var error = function (er, no, op) {
                    o.error(er, no, op)
                };
            return nsp_invoke(param, success, error)
        };
    var clear_recycle = function (o) {
            user_info = undefined;
            nsp_invoke({
                nsp_svc: "nsp.vfs.trash"
            }, o.success, o.error)
        };
    var createResTemplate = function (o) {
            var param = o.param || {};
            param.nsp_svc = "nsp.vfs.link.createResTemplate";
            nsp_invoke(param, o.success, o.error)
        };
    var getResTemplate = function (o) {
            var param = o.param || {};
            param.nsp_svc = "nsp.vfs.link.getResTemplate";
            nsp_invoke(param, o.success, o.error)
        };
    var create_link = function (o) {
            if (!o.files || !o.title) {
                o.error(1001, "parameter invalid");
                return
            }
            var param = {
                nsp_svc: "nsp.vfs.link.create",
                title: o.title
            };
            if (o.summary) {
                param.summary = o.summary
            }
            if (o.tags) {
                param.tags = o.tags
            }
            if (o.content) {
                param.content = o.content
            }
            if (o.form) {
                param.form = o.form
            }
            if (o.attrs) {
                param.attrs = o.attrs
            }
            param.files = str_to_array_files(o.files);
            return nsp_invoke(param, o.success, o.error)
        };
    var str_to_array_relative_files = function (files_str, idmap) {
            var ids = [];
            if (!$.isArray(files_str)) {
                files_str = eval(files_str)
            }
            $.each(files_str, function () {
                ids.push('"' + path_of(this.id).match(/[^\/]+$/) + '"');
                if (idmap) {
                    idmap[path_of(this.id) + ""] = this.id
                }
            });
            return "[" + ids.join(",") + "]"
        };
    var str_to_array_files = function (files_str, idmap) {
            var ids = [];
            if (!$.isArray(files_str)) {
                files_str = eval(files_str)
            }
            $.each(files_str, function () {
                ids.push('"' + path_of(this.id) + '"');
                if (idmap) {
                    idmap[path_of(this.id) + ""] = this.id
                }
            });
            return "[" + ids.join(",") + "]"
        };
    var str_to_setattr_files = function (files_str, attr, idmap) {
            var ids = [];
            if (!$.isArray(files_str)) {
                files_str = eval(files_str)
            }
            $.each(files_str, function () {
                ids.push('"' + path_of(this.id) + '":' + attr);
                if (idmap) {
                    idmap[path_of(this.id) + ""] = this.id
                }
            });
            return "{" + ids.join(",") + "}"
        };
    var setattr_files = function (files_str, attr) {
            var attrs = [];
            if (!$.isArray(files_str)) {
                files_str = eval(files_str)
            }
            $.each(files_str, function () {
                attrs.push('"' + this + '":' + attr)
            });
            return "{" + attrs.join(",") + "}"
        };
    var movefile = function (o, restore) {
            return file_operate(o, "nsp.vfs.movefile", restore)
        };
    var copyfile = function (o) {
            return file_operate(o, "nsp.vfs.copyfile")
        };
    var file_operate = function (o, operate, restore) {
            if (!o.files || (!o.pid && !o.path)) {
                o.error(1001, "parameter invalid");
                return
            }
            var param = {
                nsp_svc: operate
            };
            var temp = [];
            var move_files;
            var same_name_files = [];
            var recycle_files = [];
            var restore_files = [];
            param.files = [];
            if (o.path) {
                param.path = o.path;
                move_files = eval(o.files, temp)
            } else {
                move_files = eval(str_to_array_files(o.files, temp));
                param.path = path_of(o.pid)
            }
            var success = function (data) {
                    var filenames = [];
                    var ofilenames = [];
                    var has_special_char = false;
                    $.each(data.childList, function () {
                        filenames.push(this.name);
                        ofilenames.push(this.name.toLowerCase())
                    });
                    $.each(move_files, function () {
                        var fname = this.match(path_name_regex)[2];
                        if (fname.match(/[<>:"\/\\|\?\*]+/g)) {
                            has_special_char = true
                        }
                        if (restore) {
                            restore_files.push(this)
                        } else {
                            if (this.substring(0, 8) == "/Recycle") {
                                recycle_files.push(this)
                            } else {
                                if ($.inArray(fname.toLowerCase(), ofilenames) == -1) {
                                    param.files.push('"' + this + '"');
                                    filenames.push(fname)
                                } else {
                                    same_name_files.push(this)
                                }
                            }
                        }
                    });
                    if (has_special_char) {
                        o.error(11111, "文件名称含有特殊字符！");
                        return
                    }
                    var move_success = function (data) {
                            if (typeof data.NSP_STATUS != "undefined") {
                                o.error(data.NSP_STATUS, data.error);
                                return
                            }
                            if (data.successList) {
                                user_info = undefined;
                                $.each(data.successList, function () {
                                    this.id = temp[this.name];
                                    if (!this.id) {
                                        this.id = $.md5(this.name)
                                    }
                                })
                            }
                            if (data.failList) {
                                $.each(data.failList, function () {
                                    this.id = temp[this.name];
                                    if (!this.id) {
                                        this.id = $.md5(this.name)
                                    }
                                })
                            }
                            o.success(data)
                        };
                    if (param.files.length) {
                        param.files = "[" + param.files.join(",") + "]";
                        nsp_invoke(param, move_success, o.error)
                    }
                    if (same_name_files.length) {
                        var parent_path = param.path;
                        $.each(same_name_files, function () {
                            var fname = check_name(this.match(path_name_regex)[2], filenames);
                            filenames.push(fname);
                            param.path = parent_path + "/" + fname;
                            param.files = '["' + this + '"]';
                            nsp_invoke(param, move_success, o.error)
                        })
                    }
                    if (restore_files.length) {
                        var parent_path = param.path;
                        $.each(restore_files, function () {
                            var fname = check_name(restore, filenames);
                            filenames.push(fname);
                            param.path = parent_path + "/" + fname;
                            param.files = '["' + this + '"]';
                            nsp_invoke(param, move_success, o.error)
                        })
                    }
                    if (recycle_files.length) {
                        var parent_path = param.path;
                        var obj = {
                            files: '["' + recycle_files.join('","') + '"]',
                            fields: '["dbank_srcname"]'
                        };
                        if (o.error) {
                            obj.error = o.error
                        }
                        obj.success = function (attr) {
                            $.each(attr.successList, function () {
                                var fname = check_name(this.dbank_srcname, filenames);
                                filenames.push(fname);
                                param.path = parent_path + "/" + fname;
                                param.files = '["' + this.name + '"]';
                                nsp_invoke(param, move_success, o.error)
                            })
                        };
                        var setattr = {
                            files: setattr_files(recycle_files, '{"dbank_status":"0"}'),
                            success: function (data) {
                                nsp.netdisk.getFileInfo(obj)
                            },
                            error: o.error
                        };
                        nsp.netdisk.getFileInfo(obj)
                    }
                };
            var lsdir_param = {
                path: param.path,
                type: 3,
                nsp_svc: "nsp.vfs.lsdir"
            };
            if (operate == "nsp.vfs.copyfile") {
                var disk_info_param = {
                    success: function (data) {
                        var use_able_space = parseInt(data.totalSpace) - parseInt(data.useredSpace);
                        var getsize = {
                            files: str_to_array_files(o.files),
                            fields: '["size","space"]'
                        };
                        if (o.error) {
                            getsize.error = o.error
                        }
                        getsize.success = function (attr) {
                            $.each(attr.successList, function () {
                                if (this.size) {
                                    use_able_space -= this.size
                                }
                                if (this.space) {
                                    use_able_space -= this.space
                                }
                            });
                            if (use_able_space >= 0) {
                                return nsp_invoke(lsdir_param, success)
                            } else {
                                o.error(10072, "网盘可用空间不足")
                            }
                        };
                        return nsp.netdisk.getFileInfo(getsize)
                    },
                    error: o.error
                };
                return diskinfo(disk_info_param)
            } else {
                return nsp_invoke(lsdir_param, success)
            }
        };
    var addName = function (name) {
            name = name.substring(name.lastIndexOf("/") + 1);
            var extendName = name.match(/\.[^\.]+$/);
            if (extendName) {
                name = name.replace(extendName, "")
            }
            var match = name.match(/\(\d*\)$/);
            if (match) {
                var num = match[0].match(/\d+/g)[0];
                name = name.replace(/\(\d*\)$/, "(" + (++num) + ")")
            } else {
                name = name + "(1)"
            }
            if (extendName) {
                name += extendName
            }
            return name
        };
    var restorefile = function (o) {
            var idtemp = [];
            var obj = {
                files: str_to_array_files(o.files, idtemp),
                fields: '["dbank_srcpath","dbank_srcname"]'
            };
            if (o.error) {
                obj.error = o.error
            }
            obj.success = function (attr) {
                if (attr.successList.length) {
                    var result = {
                        successList: []
                    };
                    var count = 0;
                    var att = attr.successList[count];
                    if (this.dbank_srcpath != "") {
                        var param = {
                            files: '["' + att.name + '"]',
                            path: att.dbank_srcpath,
                            success: function (data) {
                                if (data.failList.length > 0) {
                                    $.warning({
                                        message: "还原文件失败"
                                    });
                                    return
                                }
                                if (data.successList) {
                                    var successFile = data.successList[0];
                                    if (param.rpid) {
                                        successFile.oPid = param.rpid
                                    } else {
                                        successFile.oPid = $.md5(param.path)
                                    }
                                    successFile.pid = $.md5(param.path);
                                    result.successList.push(successFile)
                                }
                                if (++count < attr.successList.length) {
                                    att = attr.successList[count];
                                    param.files = '["' + att.name + '"]';
                                    param.path = att.dbank_srcpath;
                                    create_path(param.path, function (rpid) {
                                        param.rpid = rpid;
                                        movefile(param, att.dbank_srcname)
                                    }, o.error)
                                } else {
                                    o.success(result)
                                }
                            },
                            error: function (errno, errmsg) {
                                o.error(errno, errmsg)
                            }
                        };
                        create_path(param.path, function (rpid) {
                            param.rpid = rpid;
                            movefile(param, att.dbank_srcname)
                        }, o.error)
                    }
                }
            };
            var setattr = {
                files: str_to_setattr_files(o.files, '{"dbank_status":"0"}'),
                success: function (data) {
                    nsp.netdisk.getFileInfo(obj)
                },
                error: function (errno, errmsg) {
                    o.error(errno, errmsg)
                }
            };
            return nsp.netdisk.getFileInfo(obj)
        };
    nsp.netdisk.getFileInfo = function (o) {
        if (!o.files) {
            o.error(1001, "parameter invalid");
            return
        }
        var param = {
            nsp_svc: "nsp.vfs.getattr"
        };
        if (o.fields) {
            param.fields = o.fields
        }
        param.files = o.files;
        return nsp_invoke(param, o.success, o.error)
    };
    nsp.netdisk.setFileInfo = function (o) {
        if (!o.files) {
            o.error(1001, "parameter invalid");
            return
        }
        var param = {
            nsp_svc: "nsp.vfs.setattr"
        };
        param.files = o.files;
        return nsp_invoke(param, o.success, o.error)
    };
    var create_path = function (path, success_callback, error_callback) {
            var rpid = "";
            var path_array = path.split("/");
            path_array = $.grep(path_array, function (n) {
                return n != ""
            });
            path_array[0] = "/" + path_array[0];
            for (var j = 1; j < path_array.length; j++) {
                path_array[j] = path_array[j - 1] + "/" + path_array[j]
            }
            var path_array_param = [];
            var countnum = 0;
            var i = 0;
            for (; i < path_array.length; i++) {
                path_array_param[i] = path_array[i];
                countnum += path_array_param[i].length;
                if (countnum > 1500) {
                    break
                }
            }
            var files = '["' + path_array_param.join('","') + '"]';
            var oattr = {
                files: files,
                success: function (data) {
                    if (data.failList && data.failList.length) {
                        var index = 0;
                        var match = data.failList[index].name.match(path_name_regex);
                        var omkdir = {
                            path: match[1],
                            name: match[2],
                            success: function (jsdata) {
                                index++;
                                if (index < data.failList.length) {
                                    match = data.failList[index].name.match(path_name_regex);
                                    omkdir.path = match[1];
                                    if (rpid == "") {
                                        rpid = $.md5(omkdir.path.match(path_name_regex)[1])
                                    }
                                    omkdir.name = match[2];
                                    nsp.netdisk.mkdir(omkdir)
                                } else {
                                    if (i == path_array.length) {
                                        success_callback(rpid)
                                    } else {
                                        path_array_param = [];
                                        countnum = 0;
                                        for (var k = 0; i < path_array.length; i++) {
                                            path_array_param[k] = path_array[i];
                                            countnum += path_array_param[k++].length;
                                            if (countnum > 1500) {
                                                break
                                            }
                                        }
                                        oattr.files = '["' + path_array_param.join('","') + '"]';
                                        nsp.netdisk.getFileInfo(oattr)
                                    }
                                }
                            }
                        };
                        nsp.netdisk.mkdir(omkdir)
                    } else {
                        if (i == path_array.length) {
                            success_callback(rpid)
                        } else {
                            path_array_param = [];
                            countnum = 0;
                            for (k = 0; i < path_array.length; i++) {
                                path_array_param[k] = path_array[i];
                                countnum += path_array_param[k++].length;
                                if (countnum > 1500) {
                                    break
                                }
                            }
                            oattr.files = '["' + path_array_param.join('","') + '"]';
                            nsp.netdisk.getFileInfo(oattr)
                        }
                    }
                },
                error: error_callback
            };
            nsp.netdisk.getFileInfo(oattr)
        };
    nsp.netdisk.getDownloadUrl = function (o) {
        o.fields = '["url"]';
        if (o.id) {
            o.files = '["' + path_of(o.id) + '"]'
        }
        var success = function (data) {
                if (data.successList) {
                    o.success(data.successList[0].url)
                } else {
                    o.error(1001, "parameter invalid")
                }
            };
        var param = {
            nsp_svc: "nsp.vfs.getattr"
        };
        if (o.fields) {
            param.fields = o.fields
        }
        param.files = o.files;
        return nsp_invoke(param, success, o.error)
    };
    nsp.netdisk.getFileContent = function (o) {
        if (!o.id) {
            o.error(1001, "parameter invalid");
            return
        }
        var param = {
            action: "getFileContent",
            anticache: Math.floor(Math.random() * 1000)
        };
        param.file = '{"id":"' + o.id + '"}';
        if (o.uid) {
            param.uid = o.uid
        }
        return nsp_invoke_old("get", param, o.success, o.error, "text")
    };
    nsp.netdisk.getUploadConfig = function (o) {
        var param = {
            nsp_svc: "nsp.user.getInfo",
            attrs: '["product.fileuploadsize","profile.productid","product.spacecapacity", "profile.spaceextcapacity", "profile.usedspacecapacity"]'
        };
        var success = function (data) {
                data.fileuploadsize = data["product.fileuploadsize"];
                data.productId = data["profile.productid"];
                data.totalSpace = parseFloat(data["product.spacecapacity"]) + parseFloat(data["profile.spaceextcapacity"]);
                data.useredSpace = data["profile.usedspacecapacity"];
                param = {
                    nsp_svc: "nsp.vfs.upauth"
                };
                success = function (upauth_data) {
                    data.nspSecret = upauth_data.secret;
                    data.uploadRandomStr = upauth_data.nsp_tstr;
                    data.nspAppid = upauth_data.nsp_tapp;
                    data.nspVersion = upauth_data.nsp_tver;
                    data.nspReqUrl = upauth_data.nsp_host;
                    o.success(data)
                };
                nsp_invoke(param, success, o.error)
            };
        return nsp_invoke(param, success, o.error)
    };
    nsp.netdisk.mini_image = function (o) {
        if ((!o.id && !o.files) || !o.width || !o.height) {
            if (o.error) {
                o.error(1001, "parameter invalid")
            }
            return
        }
        var success = function (data) {
                if (data) {
                    var ss = [];
                    $.each(data, function (name, url) {
                        ss.push({
                            id: $.md5(name),
                            url: url
                        })
                    });
                    o.success(ss)
                }
            };
        var param = {
            nsp_svc: "nsp.vfs.fpe.image.resize",
            width: o.width,
            height: o.height
        };
        if (o.files) {
            param.files = o.files
        }
        if (o.pid) {
            param.path = path_of(o.pid);
            if (!param.files) {
                param.files = str_to_array_relative_files(o.id)
            }
        } else {
            if (!param.files) {
                param.files = str_to_array_files(o.id)
            }
        }
        return nsp_invoke(param, success, o.error)
    };
    nsp.netdisk.netdisk_setting = function (o) {
        var param = {
            nsp_svc: "nsp.auth.update",
            account: o.account,
            key: o.key,
            attributes: o.attributes
        };
        return $.jsonp({
            url: nsp.netdisk.url,
            data: param,
            dataType: "jsonp",
            callbackParameter: "nsp_cb",
            timeout: 30000,
            success: o.success,
            pageCache: true,
            error: o.error,
            data_post_process: o.data_post_process
        })
    };
    nsp.netdisk.netdisk_setterUserInfo = function (o) {
        return nsp_invoke(o.param, o.success, o.error)
    };
    var path_of = function (id) {
            return path_id_map[id] ? path_id_map[id].path : "/"
        };
    var publishtoweibofuc = function (o) {
            if (!o.param) {
                if (o.error) {
                    o.error(1001, "parameter invalid")
                }
                return
            }
            if (o.param.files || o.param.id) {
                if (o.param.files) {
                    o.param.files = o.param.files
                } else {
                    o.param.files = str_to_array_files(o.param.id)
                }
                delete o.param.id
            }
            return nsp_invoke(o.param, function (data) {
                o.success(data)
            }, o.error)
        };
    var savelinkfiles = function (o) {
            if (!o.param) {
                if (o.error) {
                    o.error(1001, "parameter invalid")
                }
                return
            }
            return nsp_invoke(o.param, function (data) {
                o.success(data)
            }, o.error)
        };
    var getConfigInfo = function (key) {
            try {
                var rt = {};
                var expire = null;
                var cachetype = null;
                var tag = null;
                var soname = null;
                if (key == "www.dbank.com.rec.weibolink") {
                    expire = dbank.config.cache.recWeibolink.expire;
                    cachetype = dbank.config.cache.recWeibolink.type;
                    tag = dbank.config.cache.recWeibolink.tag
                } else {
                    if (key == "www.dbank.com.rec.securelink") {
                        expire = dbank.config.cache.recSecurelink.expire;
                        cachetype = dbank.config.cache.recSecurelink.type;
                        tag = dbank.config.cache.recSecurelink.tag
                    } else {
                        if (key == "nsp.user.product.{" + $.cookie("session") + "}" || key == "nsp.user.user.{" + $.cookie("session") + "}" || key == "nsp.user.profile.{" + $.cookie("session") + "}") {
                            expire = dbank.config.cache.getInfo.expire;
                            cachetype = dbank.config.cache.getInfo.type;
                            tag = dbank.config.cache.getInfo.tag
                        } else {
                            if (key == "nsp.user.account.{" + $.cookie("session") + "}") {
                                expire = dbank.config.cache.getAccounts.expire;
                                cachetype = dbank.config.cache.getAccounts.type;
                                tag = dbank.config.cache.getAccounts.tag
                            } else {
                                if (key == "dbank.business.balance.{" + $.cookie("session") + "}") {
                                    expire = dbank.config.cache.getbalance.expire;
                                    cachetype = dbank.config.cache.getbalance.type;
                                    tag = dbank.config.cache.getbalance.tag
                                } else {
                                    if (key == "app.weibo.bindingStatus.{" + $.cookie("session") + "}.sina") {
                                        expire = dbank.config.cache.getBindingStatusSina.expire;
                                        cachetype = dbank.config.cache.getBindingStatusSina.type;
                                        tag = dbank.config.cache.getBindingStatusSina.tag
                                    } else {
                                        if (key == "app.weibo.bindingStatus.{" + $.cookie("session") + "}.qqspace") {
                                            expire = dbank.config.cache.getBindingStatusQqspace.expire;
                                            cachetype = dbank.config.cache.getBindingStatusQqspace.type;
                                            tag = dbank.config.cache.getBindingStatusQqspace.tag
                                        } else {
                                            if (key == "www.dbank.com.rec.editor") {
                                                expire = dbank.config.cache.recEditor.expire;
                                                cachetype = dbank.config.cache.recEditor.type;
                                                tag = dbank.config.cache.recEditor.tag
                                            } else {
                                                if (key == "com.dbank.signin.issign.{" + $.cookie("session") + "}") {
                                                    expire = dbank.config.cache.getIssign.expire;
                                                    cachetype = dbank.config.cache.getIssign.type;
                                                    tag = dbank.config.cache.getIssign.tag
                                                } else {
                                                    if (key == "com.dbank.message.countunread.{" + $.cookie("session") + "}") {
                                                        expire = dbank.config.cache.getCountunread.expire;
                                                        cachetype = dbank.config.cache.getCountunread.type;
                                                        tag = dbank.config.cache.getCountunread.tag
                                                    } else {
                                                        if (key == "client") {
                                                            expire = dbank.config.cache.client.expire;
                                                            cachetype = dbank.config.cache.client.type;
                                                            soname = dbank.config.cache.client.sharedobject;
                                                            tag = dbank.config.cache.client.tag
                                                        } else {
                                                            if (key == "secretFlash") {
                                                                expire = dbank.config.cache.secretFlash.expire;
                                                                cachetype = dbank.config.cache.secretFlash.type;
                                                                soname = dbank.config.cache.secretFlash.sharedobject;
                                                                tag = dbank.config.cache.secretFlash.tag
                                                            } else {
                                                                if (key == "secretNotflash") {
                                                                    expire = dbank.config.cache.secretNotflash.expire;
                                                                    cachetype = dbank.config.cache.secretNotflash.type;
                                                                    soname = dbank.config.cache.secretNotflash.sharedobject;
                                                                    tag = dbank.config.cache.secretNotflash.tag
                                                                } else {
                                                                    if (key == "banner") {
                                                                        expire = dbank.config.cache.banner.expire;
                                                                        cachetype = dbank.config.cache.banner.type;
                                                                        soname = dbank.config.cache.banner.sharedobject
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (expire == undefined) {
                    if (tag == "dynamic") {
                        expire = dbank.config.cache.expireDynamic
                    }
                    if (tag == "static") {
                        expire = dbank.config.cache.expireStatic
                    }
                }
                if (cachetype == undefined) {
                    if (tag == "dynamic") {
                        cachetype = dbank.config.cache.typeDynamic
                    }
                    if (tag == "static") {
                        cachetype = dbank.config.cache.typeStatic
                    }
                }
                rt.expire = expire;
                rt.cachetype = cachetype;
                rt.sharedobject = soname;
                return rt
            } catch (e) {}
        };
    var put = function (key, value) {
            try {
                var configInfo = getConfigInfo(key);
                if (configInfo.cachetype == "flash") {
                    dbank.cache.flashput(key, value, configInfo.expire)
                } else {
                    if (window.localStorage) {
                        dbank.cache.html5put(key, value, configInfo.expire)
                    } else {
                        dbank.cache.userdataput(key, value, configInfo.expire)
                    }
                }
            } catch (e) {}
        };
    var putcommon = function (objname, key, value) {
            try {
                var configInfo = getConfigInfo(key);
                if (configInfo.cachetype == "flash") {
                    dbank.cache.flashputcommon(key, value, configInfo.expire, objname)
                } else {
                    if (window.localStorage) {
                        dbank.cache.html5put(key, value, configInfo.expire)
                    } else {
                        dbank.cache.userdataput(key, value, configInfo.expire)
                    }
                }
            } catch (e) {}
        };
    var get = function (key) {
            try {
                var rt = null;
                var configInfo = getConfigInfo(key);
                if (configInfo.cachetype == "flash") {
                    rt = dbank.cache.flashget(key)
                } else {
                    if (window.localStorage) {
                        rt = dbank.cache.html5get(key)
                    } else {
                        rt = dbank.cache.userdataget(key)
                    }
                }
                return rt
            } catch (e) {}
        };
    var getcommon = function (objname, key) {
            try {
                var rt = null;
                var configInfo = getConfigInfo(key);
                if (configInfo.cachetype == "flash") {
                    rt = dbank.cache.flashgetcommon(key, objname)
                } else {
                    if (window.localStorage) {
                        rt = dbank.cache.html5get(key)
                    } else {
                        rt = dbank.cache.userdataget(key)
                    }
                }
                return rt
            } catch (e) {}
        };
    var del = function (key) {
            try {
                var configInfo = getConfigInfo(key);
                if (configInfo.cachetype == "flash") {
                    dbank.cache.flashremove(key)
                } else {
                    if (window.localStorage) {
                        dbank.cache.html5remove(key)
                    } else {
                        dbank.cache.userdataremove(key)
                    }
                }
            } catch (e) {}
        };
    var delcommon = function (objname, key) {
            try {
                var configInfo = getConfigInfo(key);
                if (configInfo.cachetype == "flash") {
                    dbank.cache.flashremovecommon(key, objname)
                } else {
                    if (window.localStorage) {
                        dbank.cache.html5remove(key)
                    } else {
                        dbank.cache.userdataremove(key)
                    }
                }
            } catch (e) {}
        };
    var getCache = function (nsp_svc, type) {
            try {
                var rt = null;
                switch (nsp_svc) {
                case "nsp.user.getInfo":
                    var key = "nsp.user.user.{" + $.cookie("session") + "}";
                    var userinfo = get(key);
                    var key = "nsp.user.product.{" + $.cookie("session") + "}";
                    var productinfo = get(key);
                    var key = "nsp.user.profile.{" + $.cookie("session") + "}";
                    var profileinfo = get(key);
                    if (productinfo != null && userinfo != null && profileinfo != null) {
                        var data = {};
                        var productinfoJson = productinfo;
                        var userinfoJson = userinfo;
                        var profileinfoJson = profileinfo;
                        data["product.fileuploadsize"] = productinfoJson.fileuploadsize;
                        data["product.spacecapacity"] = productinfoJson.spacecapacity;
                        data["product.spaceextcapacity"] = productinfoJson.spaceextcapacity;
                        data["product.productname"] = productinfoJson.productname;
                        data["product.linkfilesize"] = productinfoJson.linkfilesize;
                        data["product.package"] = productinfoJson["package"];
                        data["product.tryvip68"] = productinfoJson.tryvip68;
                        data["product.tryvip990"] = productinfoJson.tryvip990;
                        data["product.medal"] = productinfoJson.medal;
                        data["user.status"] = userinfoJson.status;
                        data["user.username"] = userinfoJson.username;
                        data["user.email"] = userinfoJson.email;
                        data["user.uid"] = userinfoJson.uid;
                        data["profile.spaceextcapacity"] = profileinfoJson.spaceextcapacity;
                        data["profile.usedspacecapacity"] = profileinfoJson.usedspacecapacity;
                        data["profile.orderenddate"] = profileinfoJson.orderenddate;
                        data["profile.productid"] = profileinfoJson.productid;
                        data["profile.extra_apps"] = profileinfoJson.extra_apps;
                        data["profile.dbank_skin"] = profileinfoJson.dbank_skin;
                        data["profile.dbank_avatar_type"] = profileinfoJson.dbank_avatar_type;
                        data["profile.dbank_avatar"] = profileinfoJson.dbank_avatar;
                        data["profile.last_login_ip"] = profileinfoJson.last_login_ip;
                        data["profile.dbank_outlink"] = profileinfoJson.dbank_outlink;
                        data["profile.dbank_netdisk"] = profileinfoJson.dbank_netdisk;
                        data["profile.dbank_outlink_file"] = profileinfoJson.dbank_outlink_file;
                        data["profile.login_setter_status"] = profileinfoJson.login_setter_status;
                        data["profile.paycapacity"] = profileinfoJson.paycapacity;
                        data["profile.interval"] = profileinfoJson.interval;
                        data["profile.card_type"] = profileinfoJson.card_type;
                        data["profile.link_access_switch"] = profileinfoJson.link_access_switch;
                        data["profile.dlink_white_list"] = profileinfoJson.dlink_white_list;
                        data["profile.dlink_switch"] = profileinfoJson.dlink_switch;
                        data["profile.pwd_switch"] = profileinfoJson.pwd_switch;
                        data["profile.direct_switch"] = profileinfoJson.direct_switch;
                        var pluginArr = [];
                        if (profileinfoJson.plugindl) {
                            pluginArr = profileinfoJson.plugindl.split(",")
                        }
                        data["plugin.dl"] = pluginArr;
                        pluginArr = [];
                        if (profileinfoJson.pluginnetdisk) {
                            pluginArr = profileinfoJson.pluginnetdisk.split(",")
                        }
                        data["plugin.netdisk"] = pluginArr;
                        rt = data
                    }
                    break;
                case "nsp.user.getAccounts":
                    var key = "nsp.user.account.{" + $.cookie("session") + "}";
                    if (get(key) != null) {
                        rt = [];
                        rt[0] = {
                            account: get(key)
                        }
                    } else {
                        rt = get(key)
                    }
                    break;
                case "com.dbank.business.getbalance":
                    var key = "dbank.business.balance.{" + $.cookie("session") + "}";
                    rt = get(key);
                    break;
                case "app.weibo.getBindingStatus":
                    if (type == "sina") {
                        var key = "app.weibo.bindingStatus.{" + $.cookie("session") + "}.sina";
                        var sinaBinding = get(key);
                        if (sinaBinding) {
                            rt = sinaBinding.sina_bindingStatus
                        }
                    }
                    if (type == "qqspace") {
                        var key = "app.weibo.bindingStatus.{" + $.cookie("session") + "}.qqspace";
                        var qqBinding = get(key);
                        if (qqBinding) {
                            rt = qqBinding.qq_bindingStatus
                        }
                    }
                    break;
                case "com.dbank.signin.issign":
                    var key = "com.dbank.signin.issign.{" + $.cookie("session") + "}";
                    rt = get(key);
                    break;
                case "com.dbank.message.countunread":
                    var key = "com.dbank.message.countunread.{" + $.cookie("session") + "}";
                    rt = get(key);
                    break;
                default:
                    break
                }
                return rt
            } catch (e) {}
        };
    var putCache = function (data, nsp_svc, type) {
            try {
                switch (nsp_svc) {
                case "nsp.user.getInfo":
                    var productinfoJson = {};
                    var userinfoJson = {};
                    var profileinfoJson = {};
                    productinfoJson.fileuploadsize = data["product.fileuploadsize"];
                    productinfoJson.spacecapacity = data["product.spacecapacity"];
                    productinfoJson.spaceextcapacity = data["product.spaceextcapacity"];
                    productinfoJson.productname = data["product.productname"];
                    productinfoJson.linkfilesize = data["product.linkfilesize"];
                    productinfoJson["package"] = data["product.package"];
                    productinfoJson.tryvip68 = data["product.tryvip68"];
                    productinfoJson.tryvip990 = data["product.tryvip990"];
                    productinfoJson.medal = data["product.medal"];
                    var key = "nsp.user.product.{" + $.cookie("session") + "}";
                    put(key, productinfoJson);
                    userinfoJson.status = data["user.status"];
                    userinfoJson.username = data["user.username"];
                    userinfoJson.email = data["user.email"];
                    userinfoJson.uid = data["user.uid"];
                    var key = "nsp.user.user.{" + $.cookie("session") + "}";
                    put(key, userinfoJson);
                    profileinfoJson.spaceextcapacity = data["profile.spaceextcapacity"];
                    profileinfoJson.usedspacecapacity = data["profile.usedspacecapacity"];
                    profileinfoJson.orderenddate = data["profile.orderenddate"];
                    profileinfoJson.productid = data["profile.productid"];
                    profileinfoJson.extra_apps = data["profile.extra_apps"];
                    profileinfoJson.dbank_skin = data["profile.dbank_skin"];
                    profileinfoJson.dbank_avatar_type = data["profile.dbank_avatar_type"];
                    profileinfoJson.dbank_avatar = data["profile.dbank_avatar"];
                    profileinfoJson.last_login_ip = data["profile.last_login_ip"];
                    profileinfoJson.dbank_outlink = data["profile.dbank_outlink"];
                    profileinfoJson.dbank_netdisk = data["profile.dbank_netdisk"];
                    profileinfoJson.dbank_outlink_file = data["profile.dbank_outlink_file"];
                    profileinfoJson.login_setter_status = data["profile.login_setter_status"];
                    profileinfoJson.paycapacity = data["profile.paycapacity"];
                    profileinfoJson.interval = data["profile.interval"];
                    profileinfoJson.card_type = data["profile.card_type"];
                    profileinfoJson.link_access_switch = data["profile.link_access_switch"];
                    profileinfoJson.dlink_white_list = data["profile.dlink_white_list"];
                    profileinfoJson.dlink_switch = data["profile.dlink_switch"];
                    profileinfoJson.pwd_switch = data["profile.pwd_switch"];
                    profileinfoJson.direct_switch = data["profile.direct_switch"];
                    var pluginStr = "";
                    if (data["plugin.dl"] != null) {
                        for (var i = 0; i < data["plugin.dl"].length; i++) {
                            pluginStr = pluginStr + data["plugin.dl"][i] + ","
                        }
                        pluginStr = pluginStr.substring(0, pluginStr.length - 1)
                    } else {
                        pluginStr = null
                    }
                    profileinfoJson.plugindl = pluginStr;
                    pluginStr = "";
                    if (data["plugin.netdisk"] != null) {
                        for (var i = 0; i < data["plugin.netdisk"].length; i++) {
                            pluginStr = pluginStr + data["plugin.netdisk"][i] + ","
                        }
                        pluginStr = pluginStr.substring(0, pluginStr.length - 1)
                    } else {
                        pluginStr = null
                    }
                    profileinfoJson.pluginnetdisk = pluginStr;
                    var key = "nsp.user.profile.{" + $.cookie("session") + "}";
                    put(key, profileinfoJson);
                    break;
                case "nsp.user.getAccounts":
                    var key = "nsp.user.account.{" + $.cookie("session") + "}";
                    put(key, data[0].account);
                    break;
                case "com.dbank.business.getbalance":
                    var key = "dbank.business.balance.{" + $.cookie("session") + "}";
                    put(key, data);
                    break;
                case "app.weibo.getBindingStatus":
                    if (type == "sina") {
                        var key = "app.weibo.bindingStatus.{" + $.cookie("session") + "}.sina";
                        var sinaBindingJson = {};
                        sinaBindingJson.sina_bindingStatus = data;
                        put(key, sinaBindingJson)
                    }
                    if (type == "qqspace") {
                        var key = "app.weibo.bindingStatus.{" + $.cookie("session") + "}.qqspace";
                        var qqBindingJson = {};
                        qqBindingJson.qq_bindingStatus = data;
                        put(key, qqBindingJson)
                    }
                    break;
                case "com.dbank.signin.issign":
                    var key = "com.dbank.signin.issign.{" + $.cookie("session") + "}";
                    put(key, data);
                    break;
                case "com.dbank.message.countunread":
                    var key = "com.dbank.message.countunread.{" + $.cookie("session") + "}";
                    put(key, data);
                    break;
                default:
                    break
                }
            } catch (e) {}
        };
    var updateCache = function (key, data) {
            try {
                switch (key) {
                case "nsp.user.product.{" + $.cookie("session") + "}":
                    var productinfoJson = get(key);
                    for (var k in data) {
                        if (productinfoJson[k] != undefined) {
                            productinfoJson[k] = data[k]
                        }
                    }
                    put(key, productinfoJson);
                    break;
                case "nsp.user.user.{" + $.cookie("session") + "}":
                    var userinfoJson = get(key);
                    for (var k in data) {
                        if (userinfoJson[k] != undefined) {
                            userinfoJson[k] = data[k]
                        }
                    }
                    put(key, userinfoJson);
                    break;
                case "nsp.user.profile.{" + $.cookie("session") + "}":
                    var profileinfoJson = get(key);
                    for (var k in data) {
                        if (profileinfoJson[k] != undefined) {
                            profileinfoJson[k] = data[k]
                        }
                    }
                    put(key, profileinfoJson);
                    break;
                case "nsp.user.account.{" + $.cookie("session") + "}":
                    var accountJson = {};
                    accountJson.account = data;
                    put(key, data);
                    break;
                case "dbank.business.balance.{" + $.cookie("session") + "}":
                    var balanceJson = {};
                    balanceJson.balance = data;
                    put(key, balanceJson);
                    break;
                case "app.weibo.bindingStatus.{" + $.cookie("session") + "}.sina":
                    var sinaBindingJson = {};
                    sinaBindingJson.sina_bindingStatus = data;
                    put(key, sinaBindingJson);
                    break;
                case "app.weibo.bindingStatus.{" + $.cookie("session") + "}.qqspace":
                    var qqBindingJson = {};
                    qqBindingJson.qq_bindingStatus = data;
                    put(key, qqBindingJson);
                    break;
                case "com.dbank.signin.issign.{" + $.cookie("session") + "}":
                    var issignJson = {};
                    issignJson.retcode = data;
                    if (data == "0001") {
                        issignJson.retdesc = "用户已签到 "
                    }
                    put(key, issignJson);
                    break;
                case "com.dbank.message.countunread.{" + $.cookie("session") + "}":
                    var countunread = {};
                    countunread.count = data;
                    put(key, countunread);
                    break;
                case "client":
                    var config = getConfigInfo(key);
                    var client = getcommon(config.sharedobject, key);
                    if (client == null) {
                        putcommon(config.sharedobject, key, $.cookie("client"))
                    }
                    break;
                case "secretFlash":
                    var config = getConfigInfo(key);
                    var secretFlash = getcommon(config.sharedobject, key);
                    if (secretFlash == null && $.cookie("secret")) {
                        putcommon(config.sharedobject, key, $.cookie("secret"))
                    }
                    break;
                case "secretNotflash":
                    var config = getConfigInfo(key);
                    var secretNotflash = get(key);
                    if (secretNotflash == null && $.cookie("secret")) {
                        put(key, $.cookie("secret"))
                    }
                    break;
                default:
                    break
                }
            } catch (e) {}
        };
    var removeCache = function (key) {
            try {
                for (var i = 0; i < key.length; i++) {
                    del(key[i])
                }
            } catch (e) {}
        };
    var clearCache = function (type) {
            try {
                if (type == "flash") {
                    dbank.cache.flashclear()
                } else {
                    del("www.dbank.com.rec.editor");
                    var cacheKey = "www.dbank.com.rec.extlink,www.dbank.com.rec.weibolink";
                    dbank.cache.xdrRemove(cacheKey, "http://dl.dbank.com");
                    setTimeout("dbank.cache.xdrRemove('www.dbank.com.rec.securelink','http://s.dbank.com')", 5000)
                }
            } catch (e) {}
        };
    var checkCacheStatus = function (svc, type) {
            try {
                var cacheUser;
                var cache = false;
                var tag = null;
                switch (svc) {
                case "nsp.user.getInfo":
                    cache = dbank.config.cache.getInfo.cache;
                    tag = dbank.config.cache.getInfo.tag;
                    break;
                case "nsp.user.getAccounts":
                    cache = dbank.config.cache.getAccounts.cache;
                    tag = dbank.config.cache.getAccounts.tag;
                    break;
                case "com.dbank.business.getbalance":
                    cache = dbank.config.cache.getbalance.cache;
                    tag = dbank.config.cache.getbalance.tag;
                    break;
                case "app.weibo.getBindingStatus":
                    if (type == "sina") {
                        cache = dbank.config.cache.getBindingStatusSina.cache;
                        tag = dbank.config.cache.getBindingStatusSina.tag
                    }
                    if (type == "qqspace") {
                        cache = dbank.config.cache.getBindingStatusQqspace.cache;
                        tag = dbank.config.cache.getBindingStatusQqspace.tag
                    }
                    break;
                case "www.dbank.com.rec.editor":
                    cache = dbank.config.cache.recEditor.cache;
                    tag = dbank.config.cache.recEditor.tag;
                    break;
                case "www.dbank.com.rec.weibolink":
                    cache = dbank.config.cache.recWeibolink.cache;
                    tag = dbank.config.cache.recWeibolink.tag;
                    break;
                case "www.dbank.com.rec.securelink":
                    cache = dbank.config.cache.recSecurelink.cache;
                    tag = dbank.config.cache.recSecurelink.tag;
                    break;
                case "com.dbank.signin.issign":
                    cache = dbank.config.cache.getIssign.cache;
                    tag = dbank.config.cache.getIssign.tag;
                    break;
                case "com.dbank.message.countunread":
                    cache = dbank.config.cache.getCountunread.cache;
                    tag = dbank.config.cache.getCountunread.tag;
                    break;
                case "client":
                    cache = dbank.config.cache.client.cache;
                    tag = dbank.config.cache.client.tag;
                    break;
                case "secretFlash":
                    cache = dbank.config.cache.secretFlash.cache;
                    tag = dbank.config.cache.secretFlash.tag;
                    break;
                case "secretNotflash":
                    cache = dbank.config.cache.secretNotflash.cache;
                    tag = dbank.config.cache.secretNotflash.tag;
                    break;
                default:
                    break
                }
                if ($.cookie("db_cache") == "true") {
                    cacheUser = true
                } else {
                    cacheUser = false
                }
                if (cacheUser) {
                    if (cache == undefined) {
                        if (tag == "dynamic") {
                            cache = dbank.config.cache.cacheDynamic
                        }
                        if (tag == "static") {
                            cache = dbank.config.cache.cacheStatic
                        }
                    }
                } else {
                    cache = false
                }
                return cache
            } catch (e) {}
        };
    var loginCacheOper = function () {
            Rookie(function () {
                if ($.cookie("db_cache") == "true") {
                    dbank.cache.flashclear()
                }
                if (dbank.config.cache.secretFlash.cache) {
                    nsp.netdisk.updateCache("secretFlash")
                }
                var config = nsp.netdisk.getConfigInfo("client");
                var client = nsp.netdisk.getcommon(config.sharedobject, "client");
                config = nsp.netdisk.getConfigInfo("secretFlash");
                var secret = nsp.netdisk.getcommon(config.sharedobject, "secretFlash");
                if (client == null || secret == null) {
                    dbank.cache.flashclearcommon("common")
                }
                $.cookie("SID_CACHE", $.cookie("session"), {
                    path: "/",
                    domain: ".dbank.com"
                })
            }, function () {})
        };
    nsp.netdisk.str_to_array_files = str_to_array_files;
    nsp.netdisk.savelinkfiles = savelinkfiles;
    nsp.netdisk.nsp_invoke = nsp_invoke;
    nsp.netdisk.publishtoweibofuc = publishtoweibofuc;
    nsp.netdisk.userinfo = userinfo;
    nsp.netdisk.diskinfo = diskinfo;
    nsp.netdisk.lsdir = lsdir;
    nsp.netdisk.mkdir = mkdir;
    nsp.netdisk.mkfile = mkfile;
    nsp.netdisk.rename = rename;
    nsp.netdisk.rmfile = rmfile;
    nsp.netdisk.movefile = movefile;
    nsp.netdisk.copyfile = copyfile;
    nsp.netdisk.restorefile = restorefile;
    nsp.netdisk.cache_put = cache_put;
    nsp.netdisk.path_of = path_of;
    nsp.netdisk.create_link = create_link;
    nsp.netdisk.clear_recycle = clear_recycle;
    nsp.netdisk.createResTemplate = createResTemplate;
    nsp.netdisk.getResTemplate = getResTemplate;
    nsp.netdisk.getCache = getCache;
    nsp.netdisk.putCache = putCache;
    nsp.netdisk.updateCache = updateCache;
    nsp.netdisk.removeCache = removeCache;
    nsp.netdisk.clearCache = clearCache;
    nsp.netdisk.checkCacheStatus = checkCacheStatus;
    nsp.netdisk.getConfigInfo = getConfigInfo;
    nsp.netdisk.get = get;
    nsp.netdisk.put = put;
    nsp.netdisk.del = del;
    nsp.netdisk.getcommon = getcommon;
    nsp.netdisk.putcommon = putcommon;
    nsp.netdisk.delcommon = delcommon;
    nsp.netdisk.loginCacheOper = loginCacheOper
})();
if ($.cookie("session") && ($.cookie("SID_CACHE") != $.cookie("session"))) {
    if (window.location.host.indexOf("www.dbank.com") == -1) {
        $.ajax({
            url: "http://www.dbank.com/netdisk/skin.php",
            data: {
                from: "extlink"
            },
            dataType: "jsonp",
            jsonp: "nsp_cb",
            timeout: 30000,
            success: function (a) {
                nsp.netdisk.loginCacheOper()
            },
            pageCache: true,
            error: function () {}
        })
    } else {
        if (typeof XMLHttpRequest != "undefined") {
            xmlHttp = new XMLHttpRequest()
        } else {
            if (window.ActiveXObject) {
                var aVersions = ["Msxml2.XMLHttp.5.0", "Msxml2.XMLHttp.4.0", "Msxml2.XMLHttp.3.0", "Msxml2.XMLHttp", "Microsoft.XMLHttp"];
                for (var i = 0; i < aVersions.length; i++) {
                    try {
                        xmlHttp = new ActiveXObject(aVersions[i]);
                        break
                    } catch (e) {}
                }
            }
        }
        xmlHttp.open("GET", "http://www.dbank.com/netdisk/skin.php", true);
        xmlHttp.send(null);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                nsp.netdisk.loginCacheOper()
            }
        }
    }
}
if (!dbank) {
    var dbank = {}
}
if (!dbank.ui) {
    dbank.ui = {}
}
dbank.ui.filetree2 = function (w, r) {
    if (!r) {
        var r = {}
    }
    if (r.multiFolder == undefined) {
        r.multiFolder = true
    }
    if (r.loadMessage == undefined) {
        r.loadMessage = "Loading..."
    }
    var b = $($(w)[0]);
    var d = null;
    var m = {};
    var q = null;
    var n = "爱同步";
    var s = function (E) {
            var A = "";
            if ($.isArray(E)) {
                for (var z = 0; z < E.length; z++) {
                    if (201 == E[z].dbank_systemType || 202 == E[z].dbank_systemType) {
                        A = s(E[z]) + A
                    } else {
                        A += s(E[z])
                    }
                }
            } else {
                if (E && E.type == "Directory") {
                    var C = p(E.id);
                    var F = (q == C.id) ? "fopened" : "fclosed";
                    var B = C.dirCount == 0 ? "" : C.opened ? "opened" : "closed";
                    var D = (q == C.id) ? " on" : "";
                    if (201 == C.dbank_systemType) {
                        F = "recive"
                    }
                    if (202 == C.dbank_systemType) {
                        F = "mine"
                    }
                    if (3 == C.dbank_systemType && "d.0" == C.pid) {
                        F = "mydisk"
                    }
                    if (901 == C.dbank_systemType) {
                        F = "mypcdbank"
                    }
                    if (5 == C.dbank_systemType && "d.0" == C.pid) {
                        F = "recyle";
                        if (C.fileCount == 0 && C.dirCount == 0) {
                            F += " recylenull"
                        }
                    }
                    A += '<div class="item' + (("d.0" == C.pid) ? " item-root" : "") + (((C.opened || C.id == q) && "d.0" == C.pid) ? " current-root" : "") + (/recyle/.test(F) ? " last-item" : "") + (/mydisk/.test(F) ? " first-item" : "") + '" id="' + C.id + '"><div class="tree-node' + (("d.0" == C.pid) ? " tree-root" : "") + (/mydisk/.test(F) ? " first-tree-root" : "") + ((q == C.id) ? " selected-node" : "") + '"><span class="ico ' + B + '"/><span class="ico ' + F + '"/><span class="txt' + D + '" title="' + C.name + '">' + C.name + "</span></div>";
                    if (C.childList && C.opened && "d.0" != C.pid) {
                        var o = '<div class="subitem" style="display: block;">' + s(C.childList) + "</div>";
                        A += o
                    } else {
                        if ("d.0" == C.pid) {
                            var o = '<div class="subitem' + (("d.0" == C.pid) ? " sub-root" : "") + '" style="display: ' + ((C.opened || C.id == q) ? "block" : "none") + ';">' + ((5 == C.dbank_systemType) ? "" : s(C.childList)) + "</div>";
                            A += o
                        }
                    }
                    A += "</div>"
                }
            }
            return A
        };
    var h = function (o) {
            $(o).find("SPAN.closed, SPAN.opened").bind("click", function () {
                if ($(this).hasClass("closed")) {
                    $(this).parent().parent().find("DIV.subitem").remove();
                    var A = $(this).parent().parent().attr("id");
                    g({
                        id: A,
                        opened: true
                    })
                } else {
                    p($(this).parent().parent().attr("id")).opened = false;
                    $(this).parent().parent().find("DIV.subitem").hide();
                    $(this).removeClass("opened").addClass("closed");
                    $(this).parent().parent().find("SPAN.fopened").removeClass("fopened").addClass("fclosed")
                }
                return false
            });
            $(o).find(".tree-node").bind("click", function () {
                f($(this).parent().attr("id"));
                if (typeof r.click == "function") {
                    r.click(q)
                }
                b.trigger("dir_selected", [q])
            });
            $(o).find(".tree-node").hover(function () {
                $(this).addClass("hover-node")
            }, function () {
                $(this).removeClass("hover-node")
            });
            if ($(o).hasClass("item")) {
                var z = $(o).find(".item").andSelf()
            } else {
                var z = $(o).find(".item")
            }
            y(z)
        };
    var c = function (o) {
            if ($.isArray(o)) {
                for (var B = 0; B < o.length; B++) {
                    c(o[B])
                }
            } else {
                if (o) {
                    var z = m[o.id] && m[o.id].childList ? m[o.id].childList.length : 0;
                    var A = o.childList ? o.childList.length : 0;
                    if (A >= z) {
                        if (m[o.id]) {
                            o.opened = m[o.id].opened
                        }
                        m[o.id] = o
                    }
                    if (parseInt(m[o.id].dirCount) + parseInt(m[o.id].fileCount) < parseInt(o.dirCount) + parseInt(o.fileCount)) {
                        for (var B = 0; B < o.childList.length; B++) {
                            if (!p(o.childList[B].id)) {
                                m[o.id].childList.push(o.childList[B])
                            }
                        }
                    }
                    if (o.childList) {
                        c(o.childList)
                    }
                }
            }
        };
    var p = function (o) {
            return m[o]
        };
    var t = function (z) {
            if ($.isArray(z)) {
                for (var o = 0; o < z.length; o++) {
                    t(z[o])
                }
                return
            } else {
                if (typeof z == "string") {
                    t(p(z));
                    return
                }
            }
            if (z) {
                var A = p(z.pid);
                if (A) {
                    if ("Directory" == z.type) {
                        A.dirCount--
                    } else {
                        A.fileCount--
                    }
                    if (A.childList) {
                        for (var o = 0; o < A.childList.length; o++) {
                            if (z.id == A.childList[o].id) {
                                A.childList = A.childList.slice(0, o).concat(A.childList.slice(o + 1));
                                break
                            }
                        }
                    }
                }
                m[z.id] = undefined;
                if (z.childList) {
                    t(z.childList)
                }
            }
        };
    var f = function (A) {
            if (typeof A == "string") {
                var z = $("#" + A.replace(/\./g, "\\."))
            } else {
                var z = $($(A)[0]);
                A = z.attr("id")
            }
            if (q != A) {
                var o = q;
                q = A;
                if (z[0]) {
                    $("span.on").removeClass("on");
                    $(".selected-node").removeClass("selected-node");
                    $("SPAN.fopened").removeClass("fopened").addClass("fclosed");
                    z.children("div").children("span.txt").addClass("on");
                    z.children(".tree-node").addClass("selected-node");
                    z.children("div").children("span.fclosed").removeClass("fclosed").addClass("fopened");
                    if ("d.0" == p(A).pid) {
                        z.siblings().removeClass("current-root");
                        z.addClass("current-root");
                        z.siblings().children(".sub-root").hide();
                        z.siblings().children(".tree-root").children(".opened").each(function () {
                            $(this).removeClass("opened").addClass("closed");
                            $(this).siblings("fopened").removeClass("fopened").addClass("fclosed")
                        });
                        $.each(p("d.0").childList, function () {
                            var B = p(this.id);
                            if (B) {
                                B.opened = false
                            }
                        });
                        p(A).opened = true;
                        g(A)
                    }
                }
                b.trigger("pwd_change", [q, o])
            }
        };
    var l = function (o, z) {
            if (!z) {
                if ($("#dbkdisklist tbody")) {
                    $("#dbkdisklist tbody").empty()
                }
            }
            nsp.netdisk.lsdir({
                success: function (C) {
                    if (z && C) {
                        if (z.childList && C.childList && z.childList.length == C.childList.length) {
                            if ($("#filelist_waiting_img")) {
                                $("#filelist_waiting_img").hide()
                            }
                            return
                        }
                    }
                    if (!o.id || o.id == "d.0") {
                        var B = null;
                        if (!($.isArray(C))) {
                            C = [C]
                        }
                        $.each(C, function () {
                            if (this.dbank_systemType == 3 && this.childList) {
                                var D = this;
                                for (var E = 0; E < D.childList.length; E++) {
                                    if (901 == D.childList[E].dbank_systemType) {
                                        B = D.childList[E];
                                        B.name = n;
                                        B.pid = "d.0";
                                        D.childList = D.childList.slice(0, E).concat(D.childList.slice(E + 1));
                                        D.dirCount -= 1
                                    }
                                }
                            }
                            if (901 == this.dbank_systemType) {
                                this.name = n;
                                this.pid = "d.0"
                            }
                        });
                        if (B) {
                            C = C.slice(0, 1).concat([B]).concat(C.slice(1))
                        }
                        C = {
                            id: "d.0",
                            childList: C
                        }
                    } else {
                        if (901 == C.dbank_systemType) {
                            C.name = n;
                            C.pid = "d.0"
                        }
                    }
                    c(C);
                    if (C.pid == "d.0" && C.childList && 3 == C.dbank_systemType) {
                        for (var A = 0; A < C.childList.length; A++) {
                            if (901 == C.childList[A].dbank_systemType) {
                                p(C.childList[A].id).name = n;
                                C.childList = C.childList.slice(0, A).concat(C.childList.slice(A + 1));
                                C.dirCount -= 1
                            }
                        }
                    }
                    if ($("#filelist_waiting_img")) {
                        $("#filelist_waiting_img").hide()
                    }
                    o.success(C)
                },
                error: o.error,
                pid: o.id == "d.0" ? undefined : o.id,
                type: o.type ? o.type : 2
            })
        };
    var g = function (o) {
            if (typeof o === "string") {
                o = {
                    id: o
                }
            }
            var z = p(o.id);
            if (!o.force_refresh && z && (z.childList || z.dirCount == 0)) {
                if (o.opened) {
                    p(o.id).opened = true
                }
                if (o.id === "d.0") {
                    b.html(s(p(o.id).childList));
                    h(b)
                } else {
                    if (typeof o.oid == "undefined") {
                        var A = $("#" + o.id.replace(/\./g, "\\."))
                    } else {
                        var A = $("#" + o.oid.replace(/\./g, "\\."));
                        A.attr("id", o.id)
                    }
                    A.replaceWith(s(p(o.id)));
                    A = $("#" + o.id.replace(/\./g, "\\."));
                    h(A)
                }
                if (o.success) {
                    o.success()
                }
                if (o.complete) {
                    o.complete()
                }
                return true
            } else {
                l({
                    id: o.id,
                    success: function () {
                        o.force_refresh = false;
                        g(o)
                    },
                    error: function (C, B) {
                        var D = $("#" + o.id.replace(/\./g, "\\."));
                        if (C == 1000) {
                            $(D).html('<div style="color:red;">链接超时！请稍后重试！</div>')
                        } else {
                            if (typeof B != "undefined") {
                                $(D).html('<div style="color:red;">' + B + "！请稍后重试！</div>")
                            } else {
                                $(D).html('<div style="color:red;">网络繁忙！请稍后重试！</div>')
                            }
                        }
                        if (typeof o.error == "function") {
                            o.error(C, B)
                        }
                        if (o.complete) {
                            o.complete()
                        }
                    },
                    type: o.type ? o.type : 2
                });
                return false
            }
        };
    var a = function (B, C) {
            var B = B.split("/");
            B = $.grep(B, function (D) {
                return D != ""
            });
            var o = 0;
            var A = [];
            var z = function (D) {
                    if (o < B.length) {
                        var E = undefined;
                        $.each(D, function () {
                            if (this.name == B[o]) {
                                E = this;
                                return false
                            }
                        });
                        if (E != undefined) {
                            E = p(E.id);
                            A.push(E.id);
                            if (o == B.length - 1) {
                                C(B, A)
                            } else {
                                if (E.childList != undefined) {
                                    o++;
                                    z(E.childList)
                                } else {
                                    if (E.dirCount > 0 && E.type == "Directory") {
                                        l({
                                            id: E.id,
                                            success: function (F) {
                                                o++;
                                                z(F.childList)
                                            },
                                            error: function (G, F) {
                                                C(B, A)
                                            },
                                            type: 2
                                        })
                                    } else {
                                        C(B, A)
                                    }
                                }
                            }
                        } else {
                            C(B, A)
                        }
                    } else {
                        C(B, A)
                    }
                };
            if (p("d.0")) {
                z(p("d.0").childList)
            } else {
                l({
                    success: function (D) {
                        z(p("d.0").childList)
                    },
                    error: function (E, D) {
                        C([], [])
                    },
                    type: 3
                })
            }
        };
    this.cd = function (z) {
        if (typeof console != "undefined") {
            console.log("cd:" + (z.id ? z.id : (z.path ? z.path : "parameter invalid!")))
        }
        if (z.id) {
            var A = p(z.id);
            if (A && A.pid == q) {
                g({
                    id: q,
                    success: function () {
                        f(z.id);
                        if (typeof z.success === "function") {
                            z.success(q)
                        }
                    },
                    error: function (C, B) {
                        if (typeof z.error === "function") {
                            z.error(C, B)
                        }
                    },
                    type: 3,
                    opened: true
                })
            } else {
                z.error && z.error(5001, "invalid id:" + z.id)
            }
        } else {
            var o = q;
            if (typeof z.path == "undefined") {
                z.error(5000, "invalid path")
            } else {
                if (z.path.indexOf("回收站") != -1) {
                    z.path = "/回收站"
                }
                a(z.path, function (F, D) {
                    if (typeof console != "undefined") {
                        console.log("path:" + F + ", ids:" + D)
                    }
                    if (D.length > 0 && q == D[D.length - 1]) {
                        z.success(q);
                        return
                    }
                    q = null;
                    if (p("d.0") && p("d.0").childList) {
                        var B = p("d.0").childList;
                        for (var C = 0; C < B.length; C++) {
                            B[C].opened = false
                        }
                    }
                    if (D.length > 0) {
                        for (var C = 0; C < D.length - 1; C++) {
                            var G = p(D[C]);
                            if (G.type == "Directory") {
                                q = G.id
                            }
                            if (G.dirCount > 0) {
                                G.opened = true
                            }
                        }
                    }
                    if (p(D[D.length - 1])) {
                        q = D[D.length - 1]
                    }
                    if (!q) {
                        q = p("d.0").childList[0].id
                    }
                    var E = p(q);
                    if (F.length > D.length) {
                        g("d.0");
                        z.error && z.error(5000, "invalid path", F.slice(D.length));
                        if (q != o) {
                            b.trigger("pwd_change", [q, o])
                        }
                    } else {
                        if (E.type == "Directory") {
                            if (E.dirCount > 0 && !E.childList) {
                                l({
                                    id: q,
                                    success: function (H) {
                                        p(q).opened = true;
                                        g("d.0");
                                        z.success(q);
                                        if (q != o) {
                                            b.trigger("pwd_change", [q, o])
                                        }
                                    },
                                    error: function (I, H) {
                                        g("d.0");
                                        z.success(q);
                                        if (q != o) {
                                            b.trigger("pwd_change", [q, o])
                                        }
                                    },
                                    type: 3
                                })
                            } else {
                                if (E.dirCount > 0) {
                                    E.opened = true
                                }
                                g("d.0");
                                z.success(q);
                                if (q != o) {
                                    b.trigger("pwd_change", [q, o])
                                }
                            }
                        } else {
                            g("d.0");
                            z.error && z.error(5000, "invalid path", F.slice(D.length - 1));
                            if (q != o) {
                                b.trigger("pwd_change", [q, o])
                            }
                        }
                    }
                })
            }
        }
    };
    this.get_selected = function () {
        return q
    };
    var v = function (o) {
            if (m[o]) {
                if (m[o].pid == "d.0" || 901 == m[o].dbank_systemType) {
                    return "/" + m[o].name
                } else {
                    return v(m[o].pid) + "/" + m[o].name
                }
            } else {
                return ""
            }
        };
    this.path_of = v;
    this.check_parent_relation = function (z, o) {
        var A = p(o);
        while (A) {
            if (A.type != "Directory") {
                break
            }
            if (A.pid == z) {
                return true
            }
            if (!A.pid) {
                break
            }
            A = p(A.pid)
        }
        return false
    };
    this.lsdir = function (o) {
        if (typeof o.type === "undefined") {
            o.type = 3
        }
        var A = p(o.id);
        var z = $("#filelist_waiting_img");
        if (typeof A != "undefined" && (parseInt(A.fileCount) == 0 && parseInt(A.dirCount) == 0 || A.childList && (parseInt(A.fileCount) + parseInt(A.dirCount) == A.childList.length) || o.type == 1 && A.childList[0].type == "File" || o.type == 2 && A.childList[0].type == "Directory")) {
            var B = function () {
                    if (z) {
                        z.show()
                    }
                    l(o, A)
                };
            o.success(A, B);
            return A
        } else {
            if (z) {
                z.show()
            }
            l(o)
        }
    };
    var j = function (o) {
            if ("Directory" == p(o).type) {
                l({
                    id: o,
                    success: function (z) {
                        g(o);
                        b.trigger("items_change", [
                            [p(o)]
                        ])
                    },
                    type: 3
                })
            }
        };
    this.mkdir = function (z) {
        var o = q;
        nsp.netdisk.mkdir({
            pid: o,
            name: z.name,
            success: function (A) {
                p(o).opened = true;
                j(o);
                z.success()
            },
            error: function (B, A) {
                z.error(B, A)
            }
        })
    };
    this.mkfile = function (z) {
        var o = z.pid ? z.pid : q;
        nsp.netdisk.mkfile({
            pid: o,
            files: z.files,
            success: function (B) {
                var A = nsp.netdisk.checkCacheStatus("nsp.user.getInfo");
                if (A) {
                    var C = new Array();
                    C[0] = "nsp.user.profile.{" + $.cookie("session") + "}";
                    C[1] = "nsp.user.product.{" + $.cookie("session") + "}";
                    C[2] = "nsp.user.user.{" + $.cookie("session") + "}";
                    nsp.netdisk.removeCache(C)
                }
                j(o);
                b.trigger("ds_change");
                z.success(B)
            },
            error: function (B, A) {
                z.error(B, A)
            }
        })
    };
    this.rename = function (o) {
        nsp.netdisk.rename({
            id: o.id,
            name: o.name,
            success: function (D) {
                if (D.successList.length == 1) {
                    p(o.id).name = o.name;
                    var B = p(p(o.id).pid);
                    var A = D.successList[0].id;
                    if (B) {
                        $.each(B.childList, function () {
                            if (this.id == o.id) {
                                this.name = o.name;
                                this.id = D.successList[0].id
                            }
                        })
                    }
                    var C = p(this.id);
                    if (C) {
                        m[this.id] = undefined;
                        C.name = o.name;
                        C.id = D.successList[0].id;
                        c(C)
                    }
                    if (p(A).type == "Directory") {
                        p(A).opened = false;
                        var z = p(A).childList;
                        if (z) {
                            p(A).childList = undefined;
                            t(z)
                        }
                        g({
                            id: A,
                            oid: o.id
                        })
                    }
                    b.trigger("items_change", [
                        [p(A)]
                    ]);
                    o.success()
                } else {
                    o.error(D.failList[0].errCode, D.failList[0].errMsg)
                }
            },
            error: function (A, z) {
                o.error(A, z)
            }
        })
    };
    var x = function (z) {
            var o = [];
            $.each(z, function () {
                o.push('{"id":"' + this.id + '"}')
            });
            return "[" + o.join(",") + "]"
        };
    this.rmfile = function (z) {
        if (!z.files || z.files.length == 0) {
            z.error(1001, "invalid parameter!");
            return
        }
        var o = x(z.files);
        nsp.netdisk.rmfile({
            files: o,
            success: function (B) {
                var A = [];
                var E = [];
                var D = false;
                $.each(B.successList, function () {
                    A.push(p(this.id));
                    E.push(p(this.id).pid);
                    if (p(this.id).type === "File") {
                        D = true
                    }
                    t(this.id)
                });
                E = $.unique(E);
                $.each(E, function (G, F) {
                    A.push(p(F));
                    g(F)
                });
                var C;
                $.each(p("d.0").childList, function () {
                    if (5 == this.dbank_systemType) {
                        p(this.id).childList = undefined;
                        A.push(p(this.id));
                        C = this.id
                    }
                });
                if (typeof C != "undefined") {
                    g({
                        id: C,
                        force_refresh: true,
                        type: 3,
                        complete: function () {
                            b.trigger("items_change", [A]);
                            z.success()
                        }
                    })
                } else {
                    b.trigger("items_change", [A]);
                    z.success()
                }
                if (D) {
                    b.trigger("ds_change")
                }
            },
            error: function (B, A) {
                z.error(B, A)
            }
        })
    };
    this.clr_recycle = function (o) {
        nsp.netdisk.clear_recycle({
            success: function (A) {
                var z = [];
                var D = [];
                var C = false;
                var B;
                $.each(p("d.0").childList, function () {
                    if (5 == this.dbank_systemType) {
                        p(this.id).childList = undefined;
                        B = this.id
                    }
                });
                if (typeof B != "undefined") {
                    z = z.concat(p(B).childList);
                    p(B).childList = undefined;
                    p(B).fileCount = 0;
                    p(B).dirCount = 0;
                    z.push(p(B));
                    g({
                        id: B,
                        force_refresh: true,
                        type: 3,
                        complete: function () {
                            b.trigger("items_change", [z]);
                            o.success()
                        }
                    })
                }
                if (C) {
                    b.trigger("ds_change")
                }
            },
            error: function (A, z) {
                o.error(A, z)
            }
        })
    };
    this.movefile = function (z) {
        if (!z.files || z.files.length == 0 || !z.pid) {
            z.error(1001, "invalid parameter!");
            return
        }
        var o = x(z.files);
        nsp.netdisk.movefile({
            files: o,
            pid: z.pid,
            success: function (C) {
                var A = [];
                var D = [z.pid];
                $.each(C.successList, function () {
                    A.push(p(this.id));
                    D.push(p(this.id).pid);
                    t(this.id)
                });
                D = $.unique(D);
                var B = 0;
                $.each(D, function (F, E) {
                    A.push(p(E));
                    p(E).childList = undefined;
                    g({
                        id: E,
                        force_refresh: true,
                        type: 3,
                        complete: function () {
                            B++;
                            if (B == D.length) {
                                b.trigger("items_change", [A]);
                                z.success()
                            }
                        }
                    })
                })
            },
            error: z.error
        })
    };
    this.copyfile = function (z) {
        if (!z.files || z.files.length == 0 || !z.pid) {
            z.error(1001, "invalid parameter!");
            return
        }
        var o = x(z.files);
        nsp.netdisk.copyfile({
            files: o,
            pid: z.pid,
            success: function (A) {
                p(z.pid).childList = undefined;
                g({
                    id: z.pid,
                    force_refresh: true,
                    type: 3,
                    complete: function () {
                        b.trigger("items_change", [
                            [p(z.pid)]
                        ]);
                        z.success()
                    }
                })
            },
            error: z.error
        })
    };
    this.restorefile = function (z) {
        if (!z.files || z.files.length == 0) {
            z.error(1001, "invalid parameter!");
            return
        }
        var o = x(z.files);
        nsp.netdisk.restorefile({
            files: o,
            success: function (B) {
                var A = [];
                var E = [];
                var D = [];
                $.each(B.successList, function () {
                    E.push(this.oPid);
                    t(this.id)
                });
                E = $.unique(E);
                $.each(E, function (G, F) {
                    if (p(F)) {
                        A.push(p(F));
                        p(F).childList = undefined;
                        if (p(F).opened) {
                            g({
                                id: F,
                                force_refresh: true
                            })
                        } else {
                            if (parseInt(p(F).fileCount) == 0 && parseInt(p(F).dirCount) == 0) {
                                g({
                                    id: F,
                                    force_refresh: true,
                                    type: 3
                                })
                            }
                        }
                    }
                });
                var C;
                $.each(p("d.0").childList, function () {
                    if (5 == this.dbank_systemType) {
                        p(this.id).childList = undefined;
                        A.push(p(this.id));
                        C = this.id
                    }
                });
                if (C) {
                    g({
                        id: C,
                        force_refresh: true,
                        type: 3,
                        complete: function () {
                            b.trigger("items_change", [A]);
                            z.success()
                        }
                    })
                } else {
                    b.trigger("items_change", [A]);
                    z.success()
                }
            },
            error: z.error
        })
    };
    this.get_selected_path = function () {
        return v(q)
    };
    this.pwd_change = function (z) {
        var o = this;
        if (typeof z === "function") {
            b.bind("pwd_change", function (B, C, A) {
                z.call(o, C, A)
            })
        }
    };
    this.items_change = function (z) {
        var o = this;
        if (typeof z === "function") {
            b.bind("items_change", function (B, A) {
                z.call(o, A)
            })
        }
    };
    this.ds_change = function (z) {
        var o = this;
        if (typeof z === "function") {
            b.bind("ds_change", function (A) {
                z.call(o)
            })
        }
    };
    this.dir_selected = function (z) {
        var o = this;
        if (typeof z === "function") {
            b.bind("dir_selected", function (B, A) {
                z.call(o, A)
            })
        }
    };
    var u;
    this.set_drag_n_drop = function (o) {
        u = o;
        y($(".item"))
    };
    var y = function (o) {
            u.drop(o.children(".tree-node"), function (A) {
                var B = $(A).parent().attr("id");
                var z = p(B);
                if (z) {
                    return {
                        item: z
                    }
                }
            })
        }
};
dbank.ui.default_filelist_view = dbank.util.Class.extend({
    name: "列表",
    scores: function (a) {
        if (5 != a.dbank_systemType) {
            return 50
        } else {
            return 0
        }
    },
    type_mapping: {
        image: ["jpg", "jpeg", "bmp", "gif", "tif", "png", "raw", "ai"],
        audio: ["ogg", "wma", "wav", "ape", "acc", "mid", "ra", "mp3", "flac", "cue"],
        video: ["mpeg", "mpg", "dat", "avi", "rm", "rmvb", "mov", "wmv", "asf", "3gp", "mp4", "swf", "flv", "mfv", "fla"],
        document: ["doc", "ppt", "xls", "wps", "rtf", "txt", "pdf", "hlp", "chm", "dat", "utf", "psd"],
        compress: ["tar", "zip", "rar", "tgz", "rpm", "gz", "cab", "lha", "ace", "iso", "bin", "arj"],
        application: ["exe", "com", "msi", "bat", "reg", "scr", "sys"],
        web: ["htm", "html", "asp", "aspx", "php", "jsp", "cgi", "css", "xml", "mht"]
    },
    image_server: "http://st2.dbank.com",
    type_info: {
        image: {
            name: "图片"
        },
        audio: {
            name: "音频"
        },
        video: {
            name: "视频"
        },
        document: {
            name: "文档"
        },
        compress: {
            name: "压缩文档"
        },
        application: {
            name: "应用"
        },
        web: {
            name: "网页"
        },
        Directory: {
            name: "文件夹"
        },
        mine: {
            name: "文件夹"
        },
        recive: {
            name: "文件夹"
        },
        directory_share: {
            name: "文件夹"
        },
        "default": {
            name: "文件"
        }
    },
    formatbytes: function (a) {
        if (a >= 1024 && a < 1024 * 1024) {
            return parseInt(a / 1024 * 100) / 100 + "K"
        } else {
            if (a >= 1024 * 1024 && a < 1024 * 1024 * 1024) {
                return parseInt(a / 1024 / 1024 * 100) / 100 + "M"
            } else {
                if (a >= 0 && a < 1024) {
                    return a + "B"
                } else {
                    if (a >= 1024 * 1024 * 1024) {
                        return parseInt(a / 1024 / 1024 / 1024 * 100) / 100 + "G"
                    }
                }
            }
        }
    },
    typeinfo: function (d) {
        if (d.type == "Directory") {
            if (d.dbank_systemType == 202) {
                return this.type_info.mine
            } else {
                if (d.dbank_systemType == 201) {
                    return this.type_info.recive
                }
            }
            return this.type_info.Directory
        }
        var b = this.type_info["default"];
        if (d.name.lastIndexOf(".") != -1) {
            var c = d.name.substr(d.name.lastIndexOf(".") + 1).toLowerCase();
            var a = this;
            $.each(this.type_mapping, function (g, f) {
                if (-1 != $.inArray(c, f)) {
                    b = a.type_info[g]
                }
            })
        }
        return b
    },
    refresh: function (d, g) {
        if (typeof d == "undefined") {
            d = this._current_
        }
        if (typeof d == "function") {
            g = d;
            d = this._current_
        }
        this._current_ = d;
        this._item_map_ = {};
        this.tbody.empty();
        var j = 0;
        var f = 0;
        var h = 0;
        var b = this;
        if (d.childList) {
            var c = -1;
            $.each(d.childList, function (l) {
                b._item_map_[this.id] = this;
                if (!this.typename) {
                    var m = b.typeinfo(this);
                    this.type_name = m.name;
                    this.ico = m.ico;
                    this.cls = m.cls;
                    this.format_size = b.formatbytes(this.size)
                }
                if (901 == this.dbank_systemType) {
                    c = l
                }
                if (this.type == "Directory") {
                    f++
                } else {
                    if (this.type == "File") {
                        h++;
                        if (this.size) {
                            j += parseInt(this.size)
                        }
                    }
                }
            });
            if (-1 == c) {
                var a = d.childList.concat()
            } else {
                var a = d.childList.slice(0, c).concat(d.childList.slice(c + 1))
            }
            if (g) {
                a = a.sort(g)
            } else {
                a = a.sort(b.sort_function("fileuptime", "desc"));
                b.table.find(".mhead th em").removeClass();
                b.table.find(".mhead th a").removeClass("selected");
                b.table.find("#fileuptime em").addClass("desc");
                b.table.find("#fileuptime a").addClass("selected")
            }
            this.render(a, {
                all_size: j,
                all_folder: f,
                all_file: h
            });
            this.bindlist()
        } else {
            this.render([], {
                all_size: 0,
                all_folder: 0,
                all_file: 0
            })
        }
    },
    render: function (a, b) {
        if (a.length > 0) {
            $.tmpl(this.template, a, {
                showname: function (c, d) {
                    if (parseInt(d)) {
                        c = dbank.util.str_trim(c, d)
                    }
                    return c.toString().replace(/\s/g, "&nbsp;")
                },
                showtime: function (c) {
                    var f = new Date(c.replace(/-/ig, "/"));
                    f.setHours(f.getHours() + 8);
                    var h = f.getMonth() > 8 ? f.getMonth() + 1 : "0" + (f.getMonth() + 1);
                    var g = f.getDate() > 8 ? f.getDate() : "0" + f.getDate();
                    return f.getFullYear() + "-" + h + "-" + g + " " + f.toLocaleTimeString()
                }
            }).appendTo(this.tbody);
            this.height(this.m_height)
        }
        this.explorer.statusbar.right("共有文件夹" + b.all_folder + "个，文件" + b.all_file + "个")
    },
    trigger_item_dblclick: function (a) {
        this.table.trigger("item_dblclick", [a])
    },
    bindlist: function () {
        var b = this.table;
        var a = this;
        var c;
        this.tbody.find("tr.selectable").dblclick(function () {
            var f = $(this).attr("id").substr(2);
            var d = a._item_map_[f];
            if (d) {
                a.trigger_item_dblclick(d)
            }
        }).click(function (f) {
            $(".search :input").blur();
            if (!f.shiftKey) {
                if (!f.ctrlKey) {
                    $(this).parent().find("tr.selected").removeClass("selected")
                }
                c = f.currentTarget;
                $(this).toggleClass("selected")
            } else {
                if ($(this).parent().find("tr.selected").length != 1) {
                    $(this).parent().find("tr.selected").removeClass("selected");
                    $(this).addClass("selected");
                    if (c && c != f.currentTarget) {
                        $(c).addClass("selected");
                        var d = 0;
                        $(this).parent().find("tr.selectable").filter(function () {
                            if (0 == d) {
                                if ($(this).hasClass("selected")) {
                                    d = 1;
                                    return true
                                } else {
                                    return false
                                }
                            } else {
                                if (1 == d) {
                                    if ($(this).hasClass("selected")) {
                                        d = 0
                                    } else {
                                        return true
                                    }
                                }
                            }
                        }).addClass("selected")
                    }
                } else {
                    $(this).addClass("selected");
                    var d = 0;
                    $(this).parent().find("tr.selectable").filter(function () {
                        if (0 == d) {
                            if ($(this).hasClass("selected")) {
                                d = 1;
                                return true
                            } else {
                                return false
                            }
                        } else {
                            if (1 == d) {
                                if ($(this).hasClass("selected")) {
                                    d = 0
                                }
                                return true
                            }
                        }
                    }).addClass("selected")
                }
            }
            a.trigger_items_selected();
            $("tr.selectable input.renameinput").blur();
            this.focus();
            return false
        }).hover(function () {
            $(this).addClass("hover")
        }, function () {
            $(this).removeClass("hover")
        }).mousedown(function (d) {
            if (d.which == 3) {
                if (!$(this).hasClass("selected")) {
                    a.tbody.find(".selected").removeClass("selected");
                    $(this).addClass("selected");
                    a.trigger_items_selected()
                }
                a.explorer.contextmenu.show(d.pageX, d.pageY);
                return false
            } else {
                a.explorer.contextmenu.hide()
            }
        });
        $(".selectable").drop("start", function () {
            $(this).addClass("active")
        }).drop(function (f, d) {
            if ($(d.proxy).is("div.selection")) {
                if (f.ctrlKey) {
                    $(this).toggleClass("selected")
                } else {
                    $(this).addClass("selected")
                }
            }
        }).drop("end", function () {
            $(this).removeClass("active")
        });
        this.explorer.drag_n_drop.drag($(".selectable"), function (f) {
            var g = $(f).attr("id").substr(2);
            var d = a._item_map_[g];
            if (d) {
                return {
                    item: d,
                    ico: d.ico,
                    name: d.name
                }
            }
        });
        $.drop({
            mode: "intersect"
        })
    },
    trigger_items_selected: function () {
        var c = this.tbody.find("tr.selected");
        var b = this;
        var a = [];
        c.each(function () {
            var d = $(this).attr("id").substr(2);
            a.push(b._item_map_[d])
        });
        this.table.trigger("items_selected", [a, this._current_])
    },
    skeleton: '<div id="displaytable" class="mhead"><table><colgroup><col><col width="106"><col width="106"><col width="140" class="recol colresized"></colgroup><thead><tr><th class="filetitle" id="filetitle"><a>文件名<em>&nbsp;</em></a></th><th class="filesize bg" id="filesize"><a>大小<em >&nbsp;</em></a></th><th class="bg" id="filetype"><a>类型<em>&nbsp;</em></a></th><th class="bg" id="fileuptime"><a>修改时间<em>&nbsp;</em></a></th></tr></thead></table><div id="dbkfolderandfilescurrent" class="currentline" style="left: 677px; width: 106px; display: none;"></div></div><div id="dbkdisklist" class="mbody" style="display: block;"><table style=""><colgroup><col><col width="106"><col width="106"><col width="140" class="iecol"></colgroup><tbody></tbody></table></div>',
    init: function (c, b) {
        this.table = $(c);
        var a = this;
        this.explorer = b.explorer;
        $.each(this.type_info, function (f, d) {
            d.ico = a.image_server + "/images/ico_xiao_file_" + f + ".png?v=2.5.9";
            d.cls = "ico " + f + "-icon"
        });
        return this
    },
    sort_fields: {
        filetitle: ["name", "text"],
        filesize: ["size", "numeric"],
        fileuptime: ["modifyTime", "text"],
        filetype: ["type_name", "text"]
    },
    setup: function () {
        this.table.html(this.skeleton);
        this.tbody = this.table.find("div.mbody tbody");
        var a = this;
        this.tbody.parent().parent().drag("init", function (c, b) {
            if ($("#dbkdisklist").height() < a.tbody.height()) {
                var d = $(this).offset();
                if (c.clientX > (d.left + $(this).width() - 19)) {
                    return false
                }
            }
        }).drag("start", function (c, b) {
            if ($("#dbkdisklist").height() < a.tbody.height()) {
                var d = $(this).offset();
                if (c.clientX > (d.left + $(this).width() - 19)) {
                    return false
                }
            }
            $.drop({
                multi: true
            });
            if (!c.shiftKey && !c.ctrlKey) {
                a.tbody.find("tr.selected").removeClass("selected")
            }
            return $('<div class="selection" />').css("opacity", 0.65).appendTo(document.body)
        }).drag(function (c, b) {
            $(b.proxy).css({
                top: Math.min(c.pageY, b.startY),
                left: Math.min(c.pageX, b.startX),
                height: Math.abs(c.pageY - b.startY),
                width: Math.abs(c.pageX - b.startX)
            })
        }, {
            drop: ".selectable"
        }).drag("end", function (c, b) {
            $(b.proxy).remove();
            a.trigger_items_selected()
        });
        this.table.click(function (b) {
            if (!b.ctrlKey) {
                a.tbody.find("tr.selected").removeClass("selected");
                a.trigger_items_selected()
            }
        }).mousedown(function (b) {
            if (b.which == 3) {
                a.tbody.find("tr.selected").removeClass("selected");
                a.trigger_items_selected();
                a.explorer.contextmenu.show(b.pageX, b.pageY);
                return false
            } else {
                a.explorer.contextmenu.hide()
            }
        });
        $(window).resize(function () {
            if ($("#dbkdisklist").height() < a.tbody.height()) {
                $("col.colresized").width(159)
            } else {
                $("col.colresized").width(140)
            }
        });
        this.table.find(".mhead th").click(function () {
            a.table.find(".mhead th a").removeClass("selected");
            $(this).find("a").addClass("selected");
            var f = "asc";
            if ($(this).find("em").hasClass("asc")) {
                f = "desc"
            }
            var c = $(this).attr("id");
            var d = a.sort_fields[c];
            if (typeof d == "undefined") {
                return false
            }
            var b = [];
            a.tbody.find("tr.selected").each(function () {
                b.push($(this).attr("id"))
            });
            a.refresh(a.sort_function(c, f));
            $.each(b, function () {
                var g = "#" + this.replace(/\./ig, "\\.");
                $(g).addClass("selected")
            });
            a.table.find(".mhead th em").removeClass();
            $(this).find("em").addClass(f);
            return false
        });
        $("#dbkdisklist").bind("scroll", function () {
            a.explorer.contextmenu.hide()
        })
    },
    sort_function: function (a, c) {
        var b = this.sort_fields[a];
        if (typeof b == "undefined") {
            return
        }
        return function (f, d) {
            if (f.type != d.type) {
                if ("Directory" == f.type && c == "asc" || "Directory" == d.type && c == "desc") {
                    return Number.POSITIVE_INFINITY
                } else {
                    return Number.NEGATIVE_INFINITY
                }
            }
            if (b[1] == "text" && c == "asc") {
                return f[b[0]].localeCompare(d[b[0]])
            } else {
                if (b[1] == "text" && c == "desc") {
                    return d[b[0]].localeCompare(f[b[0]])
                } else {
                    if (b[1] == "numeric" && c == "asc") {
                        return (typeof f[b[0]] === "undefined" && typeof (d[b[0]]) === "undefined") ? 0 : (typeof f[b[0]] === "undefined" ? Number.POSITIVE_INFINITY : (typeof d[b[0]] === "undefined" ? Number.NEGATIVE_INFINITY : parseInt(f[b[0]]) - parseInt(d[b[0]])))
                    } else {
                        if (b[1] == "numeric" && c == "desc") {
                            return (typeof f[b[0]] === "undefined" && typeof (d[b[0]]) === "undefined") ? 0 : (typeof f[b[0]] === "undefined" ? Number.POSITIVE_INFINITY : (typeof d[b[0]] === "undefined" ? Number.NEGATIVE_INFINITY : parseInt(d[b[0]]) - parseInt(f[b[0]])))
                        }
                    }
                }
            }
        }
    },
    filter: function (a) {
        this.tbody.find("tr").each(function () {
            if (-1 != $(this).find("td.dtfilename a.dtfile strong.filetxt").html().indexOf(a)) {
                $(this).show()
            } else {
                $(this).hide()
            }
        })
    },
    select: function (a) {
        if (typeof a == "undefined") {
            var a = [];
            this.tbody.find(".selected").each(function () {
                a.push($(this).attr("id").substr(2))
            });
            return a
        } else {
            $.each(a, function () {
                var b = "#l\\." + this.replace(/\./ig, "\\.");
                $(b).addClass("selected")
            })
        }
    },
    template: $.template(null, '<tr class="selectable" id="l.${id}"><td class="dtfilename first"><div><span class="${cls}" ></span><a title="${name}"  class="dtfile" hidefocus="true"><strong class="filetxt">${$item.showname(name)}</strong></a></div></td><td class="filesize">${format_size}</td><td class=""><div>${type_name}</div></td><td class="last"><div>${$item.showtime(modifyTime)}</div></td></tr>'),
    height: function (a) {
        if (a) {
            this.setHeight(a)
        }
        if (this.table.find(".mhead")[0]) {
            if (a) {
                this.table.find("#dbkdisklist").height(a - 27)
            }
            if (this.table.find("#dbkdisklist").height() < this.tbody.height()) {
                this.table.find("col.colresized").width(159)
            } else {
                this.table.find("col.colresized").width(140)
            }
        } else {
            if (a) {
                this.table.find("#dbkdisklist").height(a)
            }
        }
    },
    setHeight: function (a) {
        this.m_height = a
    }
});
dbank.ui.trash_filelist_view = dbank.ui.default_filelist_view.extend({
    name: "回收站",
    scores: function (a) {
        if (5 == a.dbank_systemType) {
            return 1000
        } else {
            return 0
        }
    },
    skeleton: '<div id="displaytable" class="mhead"><table><colgroup><col><col width="180"><col width="80"><col width="80"><col width="140" class="recol colresized"></colgroup><thead><tr><th class="filetitle" id="filetitle"><a>文件名<em>&nbsp;</em></a></th><th class="bg" id="flieinsitu"><a>原位置<em>&nbsp;</em></a></th><th class="filesize bg" id="filesize"><a>大小<em>&nbsp;</em></a></th><th class="bg" id="filetype"><a>类型<em>&nbsp;</em></a></th><th class="bg" id="fliedeltime"><a>删除时间<em>&nbsp;</em></a></th></tr></thead></table><div class="currentline" id="dbkfolderandfilescurrent" style="left: 677px; width: 106px; display: none;"></div></div><div id="dbkdisklist" class="mbody" style="display: block;"><table style=""><colgroup><col><col width="180"><col width="80"><col width="80"><col width="140" class="recol"></colgroup><tbody></tbody></table></div>',
    trigger_item_dblclick: function (a) {},
    sort_fields: {
        filetitle: ["name", "text"],
        filesize: ["size", "numeric"],
        fileuptime: ["modifyTime", "text"],
        fliedeltime: ["accessTime", "text"],
        flieinsitu: ["dbank_srcpath_display", "text"],
        filetype: ["type_name", "text"]
    },
    template: $.template(null, '<tr class="selectable" id="l.${id}"><td class="dtfilename first "><div><span class="${cls}" ></span><a title="{{if dbank_srcname}}${dbank_srcname}{{else}}${name}{{/if}}" href="javascript:;" class="dtfile" hidefocus="true"><strong class="filetxt">{{if dbank_srcname}}${$item.showname(dbank_srcname)}{{else}}${$item.showname(name)}{{/if}}</strong></a></div></td><td class="insitu"><div title="${dbank_srcpath_display}" class="in">{{if dbank_srcpath_display}}${$item.showname(dbank_srcpath_display)}{{/if}}</div></td><td class="filesize">${format_size}</td><td>${type_name}</td><td class="last"><div>${$item.showtime(accessTime)}</div></td></tr>')
});
if (!dbank) {
    var dbank = {}
}
if (!dbank.ui) {
    dbank.ui = {}
}
dbank.ui.filelist = function (j, g) {
    this.table = $(j);
    var b = [];
    var h = g.explorer;
    b.push(new dbank.ui.default_filelist_view().init(j, g));
    var d = -1;
    var f = -1;
    if (g.views_switch_button && g.views_switch_menu) {
        var c = g.views_switch_button;
        $(g.views_switch_button).click(function () {
            $(g.views_switch_menu).toggle();
            return false
        });
        var a = $(g.views_switch_menu).find("p");
        $(window).click(function () {
            $(g.views_switch_menu).hide()
        })
    }
    $(document).mousedown(function (l) {
        if ($(l.target).parents(".dbtable").length == 0 && $(l.target).parents(".dbmenu").length == 0) {
            h.contextmenu.hide()
        }
    });
    j.bind("scroll", function () {
        h.contextmenu.hide()
    });
    this.refresh = function (r) {
        var n = 0;
        var l = -1;
        if (a) {
            $(a).empty();
            $(g.views_switch_menu).hide()
        }
        var s;
        var q = 0;
        for (var p = 0; p < b.length; p++) {
            var o = b[p].scores(r);
            if (a && o > 0) {
                var m = $('<a href="#' + p + '">' + b[p].name + "</a>").appendTo(a).click(function () {
                    var u = $(this).attr("href");
                    u = u.substr(u.indexOf("#") + 1);
                    if (u != d) {
                        if (typeof b[d].select == "function") {
                            var t = b[d].select()
                        }
                        d = u;
                        f = u;
                        b[d].setup();
                        b[d].refresh(r);
                        if (typeof b[d].select == "function" && typeof t != "undefined") {
                            b[d].select(t)
                        }
                        $(this).siblings().removeClass("selected");
                        $(this).addClass("selected")
                    }
                    $(g.views_switch_menu).hide();
                    if (dbank && typeof dbank.stat === "function") {
                        dbank.stat(26)
                    }
                    return false
                });
                ++q
            }
            if ((o > n && (f == -1 || b[f].scores(r) <= 0)) || o > 0 && f == p) {
                n = o;
                l = p;
                s = m
            }
        }
        if (q > 1) {
            if (c) {
                $(c).show()
            }
        } else {
            if (c) {
                $(c).hide()
            }
        }
        s.addClass("selected");
        if (l != d) {
            d = l;
            b[d].setup()
        }
        b[d].refresh(r)
    };
    this.item_dblclick = function (m) {
        var l = this;
        this.table.bind("item_dblclick", function (o, n) {
            m.call(l, n)
        })
    };
    this.items_selected = function (m) {
        var l = this;
        this.table.bind("items_selected", function (p, n, o) {
            m.call(l, n, o)
        })
    };
    this.filter = function (l) {
        if (typeof b[d].filter === "function") {
            b[d].filter(l)
        }
    };
    this.install_view = function (l) {
        l.init(j, g);
        b.push(l)
    };
    this.view_height = function (m) {
        j.height(m);
        for (var l = 0; l < b.length; l++) {
            if (d == l) {
                b[l].height(m)
            } else {
                b[l].setHeight(m)
            }
        }
    }
};
if (!dbank) {
    var dbank = {}
}
if (!dbank.ui) {
    dbank.ui = {}
}
dbank.ui.thumb_filelist_view = dbank.ui.default_filelist_view.extend({
    name: "缩略图",
    scores: function (a) {
        if (5 != a.dbank_systemType) {
            return 2
        } else {
            return 0
        }
    },
    skeleton: '<div id="dbkdisklist" class="mbody gimglist"><ul class="clearfix"></ul></div>',
    init: function (c, b) {
        this.table = $(c);
        var a = this;
        this.explorer = b.explorer;
        $.each(this.type_info, function (f, d) {
            d.thumb = a.image_server + "/images/ico48/ico48_" + f + ".gif?v=2.5.9"
        });
        return this
    },
    setup: function () {
        this.table.html(this.skeleton);
        this.tbody = this.table.find("ul.clearfix");
        var a = this;
        this.tbody.parent().parent().drag("init", function (c, b) {
            if ($("#dbkdisklist").height() < a.tbody.height()) {
                var d = $(this).offset();
                if (c.clientX > (d.left + $(this).width() - 19)) {
                    return false
                }
            }
        }).drag("start", function (c, b) {
            if ($("#dbkdisklist").height() < a.tbody.height()) {
                var d = $(this).offset();
                if (c.clientX > (d.left + $(this).width() - 19)) {
                    return false
                }
            }
            $.drop({
                multi: true
            });
            if (!c.shiftKey && !c.ctrlKey) {
                a.tbody.find("li.selected").removeClass("selected")
            }
            return $('<div class="selection" />').css("opacity", 0.65).appendTo(document.body)
        }).drag(function (c, b) {
            $(b.proxy).css({
                top: Math.min(c.pageY, b.startY),
                left: Math.min(c.pageX, b.startX),
                height: Math.abs(c.pageY - b.startY),
                width: Math.abs(c.pageX - b.startX)
            })
        }, {
            drop: ".selectable"
        }).drag("end", function (c, b) {
            $(b.proxy).remove();
            a.trigger_items_selected()
        });
        this.table.click(function (b) {
            if (!b.ctrlKey) {
                a.tbody.find("li.selected").removeClass("selected");
                a.trigger_items_selected()
            }
        }).mousedown(function (b) {
            if (b.which == 3) {
                a.tbody.find(".selected").removeClass("selected");
                a.trigger_items_selected();
                a.explorer.contextmenu.show(b.pageX, b.pageY);
                return false
            } else {
                a.explorer.contextmenu.hide()
            }
        });
        $("#dbkdisklist").bind("scroll", function () {
            a.explorer.contextmenu.hide()
        })
    },
    filter: function (a) {
        this.tbody.find("li").each(function () {
            if (-1 != $(this).find("li.selectable div strong.filetxt").html().indexOf(a)) {
                $(this).show()
            } else {
                $(this).hide()
            }
        })
    },
    refresh: function (d, g) {
        if (typeof d == "undefined") {
            d = this._current_
        }
        if (typeof d == "function") {
            g = d;
            d = this._current_
        }
        this._current_ = d;
        this._item_map_ = {};
        this.tbody.empty();
        var j = 0;
        var h = 0;
        var b = 0;
        var l = this;
        var a = [];
        if (d.childList) {
            var c = -1;
            $.each(d.childList, function (m) {
                l._item_map_[this.id] = this;
                if (!this.typename) {
                    var n = l.typeinfo(this);
                    this.type_name = n.name;
                    if (typeof this.thumb == "undefined") {
                        this.thumb = n.thumb
                    }
                    this.format_size = l.formatbytes(this.size)
                }
                if (this.type_name == "图片") {
                    a.push('{"id":"' + this.id + '"}')
                }
                if (901 == this.dbank_systemType) {
                    c = m
                }
                if (this.type == "Directory") {
                    h++
                } else {
                    if (this.type == "File") {
                        b++;
                        if (this.size) {
                            j += parseInt(this.size)
                        }
                    }
                }
            });
            if (-1 == c) {
                var f = d.childList.concat()
            } else {
                var f = d.childList.slice(0, c).concat(d.childList.slice(c + 1))
            }
            if (g) {
                f = f.sort(g)
            }
            this.render(f, {
                all_size: j,
                all_folder: h,
                all_file: b
            });
            this.bindlist()
        } else {
            this.render([], {
                all_size: 0,
                all_folder: 0,
                all_file: 0
            })
        }
        if (a.length) {
            nsp.netdisk.mini_image({
                id: "[" + a.join(",") + "]",
                width: 76,
                height: 76,
                pid: d.id,
                success: function (n) {
                    var m;
                    $.each(n, function () {
                        $.each(this, function (p, o) {
                            if (p == "id") {
                                m = $("#img" + o)
                            } else {
                                if (p == "url" && m) {
                                    m.attr("data-thumb", o)
                                }
                            }
                        })
                    });
                    $("div#dbkdisklist img").scrollingLoad()
                },
                error: function (m) {
                    if (window.console) {
                        console.log(m)
                    }
                }
            })
        }
    },
    bindlist: function () {
        var b = this.table;
        var a = this;
        var c;
        this.tbody.find("li.selectable").dblclick(function () {
            var f = $(this).attr("id").substr(2);
            var d = a._item_map_[f];
            if (d) {
                a.trigger_item_dblclick(d)
            }
        }).click(function (f) {
            if (!f.shiftKey) {
                if (!f.ctrlKey) {
                    $(this).parent().find("li.selected").removeClass("selected")
                }
                c = f.currentTarget;
                $(this).toggleClass("selected")
            } else {
                if ($(this).parent().find("li.selected").length != 1) {
                    $(this).parent().find("li.selected").removeClass("selected");
                    $(this).addClass("selected");
                    if (c && c != f.currentTarget) {
                        $(c).addClass("selected");
                        var d = 0;
                        $(this).parent().find("li.selectable").filter(function () {
                            if (0 == d) {
                                if ($(this).hasClass("selected")) {
                                    d = 1;
                                    return true
                                } else {
                                    return false
                                }
                            } else {
                                if (1 == d) {
                                    if ($(this).hasClass("selected")) {
                                        d = 0
                                    } else {
                                        return true
                                    }
                                }
                            }
                        }).addClass("selected")
                    }
                } else {
                    $(this).addClass("selected");
                    var d = 0;
                    $(this).parent().find("li.selectable").filter(function () {
                        if (0 == d) {
                            if ($(this).hasClass("selected")) {
                                d = 1;
                                return true
                            } else {
                                return false
                            }
                        } else {
                            if (1 == d) {
                                if ($(this).hasClass("selected")) {
                                    d = 0
                                }
                                return true
                            }
                        }
                    }).addClass("selected")
                }
            }
            a.trigger_items_selected();
            this.focus();
            return false
        }).mousedown(function (d) {
            if (d.which == 3) {
                if (!$(this).hasClass("selected")) {
                    a.tbody.find(".selected").removeClass("selected");
                    $(this).addClass("selected");
                    a.trigger_items_selected()
                }
                a.explorer.contextmenu.show(d.pageX, d.pageY);
                return false
            } else {
                a.explorer.contextmenu.hide()
            }
        });
        $(".selectable").drop("start", function () {
            $(this).addClass("active")
        }).drop(function (f, d) {
            if ($(d.proxy).is("div.selection")) {
                if (f.ctrlKey) {
                    $(this).toggleClass("selected")
                } else {
                    $(this).addClass("selected")
                }
            }
        }).drop("end", function () {
            $(this).removeClass("active")
        });
        this.explorer.drag_n_drop.drag($(".selectable"), function (g) {
            var h = $(g).attr("id").substr(2);
            var f = a._item_map_[h];
            if (f) {
                var d = $(g).find("img");
                return {
                    item: f,
                    ico: d.attr("src"),
                    name: f.name
                }
            }
        });
        $.drop({
            mode: "intersect"
        })
    },
    trigger_items_selected: function () {
        var c = this.tbody.find("li.selected");
        var b = this;
        var a = [];
        c.each(function () {
            var d = $(this).attr("id").substr(2);
            a.push(b._item_map_[d])
        });
        this.table.trigger("items_selected", [a, this._current_])
    },
    template: $.template(null, '<li title="${name}" class="selectable" id="l.${id}">            <div><span><em><img id="img${id}" alt="${name}"                 src="${thumb}" onerror="javascirpt:this.src=\'${thumb}\';"/></em></span>                <div class="txtname"><strong class="filetxt">${$item.showname(name,31)}</strong></div></div>        </li>')
});
/* 
 * jquery.event.drag - v 2.0.0 
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */ (function (d) {
    d.fn.drag = function (c, f, l) {
        var j = typeof c == "string" ? c : "",
            h = d.isFunction(c) ? c : d.isFunction(f) ? f : null;
        if (j.indexOf("drag") !== 0) {
            j = "drag" + j
        }
        l = (c == h ? f : l) || {};
        return h ? this.bind(j, l, h) : this.trigger(j)
    };
    var a = d.event,
        b = a.special,
        g = b.drag = {
            defaults: {
                which: 1,
                distance: 0,
                not: ":input",
                handle: null,
                relative: false,
                drop: true,
                click: false
            },
            datakey: "dragdata",
            livekey: "livedrag",
            add: function (c) {
                var f = d.data(this, g.datakey),
                    h = c.data || {};
                f.related += 1;
                if (!f.live && c.selector) {
                    f.live = true;
                    a.add(this, "draginit." + g.livekey, g.delegate)
                }
                d.each(g.defaults, function (j) {
                    if (h[j] !== undefined) {
                        f[j] = h[j]
                    }
                })
            },
            remove: function () {
                d.data(this, g.datakey).related -= 1
            },
            setup: function () {
                if (!d.data(this, g.datakey)) {
                    var c = d.extend({
                        related: 0
                    }, g.defaults);
                    d.data(this, g.datakey, c);
                    a.add(this, "mousedown", g.init, c);
                    this.attachEvent && this.attachEvent("ondragstart", g.dontstart)
                }
            },
            teardown: function () {
                if (!d.data(this, g.datakey).related) {
                    d.removeData(this, g.datakey);
                    a.remove(this, "mousedown", g.init);
                    a.remove(this, "draginit", g.delegate);
                    g.textselect(true);
                    this.detachEvent && this.detachEvent("ondragstart", g.dontstart)
                }
            },
            init: function (c) {
                var f = c.data,
                    h;
                if (!(f.which > 0 && c.which != f.which)) {
                    if (!d(c.target).is(f.not)) {
                        if (!(f.handle && !d(c.target).closest(f.handle, c.currentTarget).length)) {
                            f.propagates = 1;
                            f.interactions = [g.interaction(this, f)];
                            f.target = c.target;
                            f.pageX = c.pageX;
                            f.pageY = c.pageY;
                            f.dragging = null;
                            h = g.hijack(c, "draginit", f);
                            if (f.propagates) {
                                if ((h = g.flatten(h)) && h.length) {
                                    f.interactions = [];
                                    d.each(h, function () {
                                        f.interactions.push(g.interaction(this, f))
                                    })
                                }
                                f.propagates = f.interactions.length;
                                f.drop !== false && b.drop && b.drop.handler(c, f);
                                g.textselect(false);
                                a.add(document, "mousemove mouseup", g.handler, f);
                                return false
                            }
                        }
                    }
                }
            },
            interaction: function (c, f) {
                return {
                    drag: c,
                    callback: new g.callback,
                    droppable: [],
                    offset: d(c)[f.relative ? "position" : "offset"]() || {
                        top: 0,
                        left: 0
                    }
                }
            },
            handler: function (c) {
                var f = c.data;
                switch (c.type) {
                case !f.dragging && "mousemove":
                    if (Math.pow(c.pageX - f.pageX, 2) + Math.pow(c.pageY - f.pageY, 2) < Math.pow(f.distance, 2)) {
                        break
                    }
                    c.target = f.target;
                    g.hijack(c, "dragstart", f);
                    if (f.propagates) {
                        f.dragging = true
                    }
                case "mousemove":
                    if (f.dragging) {
                        g.hijack(c, "drag", f);
                        if (f.propagates) {
                            f.drop !== false && b.drop && b.drop.handler(c, f);
                            break
                        }
                        c.type = "mouseup"
                    }
                case "mouseup":
                    a.remove(document, "mousemove mouseup", g.handler);
                    if (f.dragging) {
                        f.drop !== false && b.drop && b.drop.handler(c, f);
                        g.hijack(c, "dragend", f)
                    }
                    g.textselect(true);
                    if (f.click === false && f.dragging) {
                        jQuery.event.triggered = true;
                        setTimeout(function () {
                            jQuery.event.triggered = false
                        }, 20);
                        f.dragging = false
                    }
                    break
                }
            },
            delegate: function (c) {
                var f = [],
                    j, h = d.data(this, "events") || {};
                d.each(h.live || [], function (l, m) {
                    if (m.preType.indexOf("drag") === 0) {
                        if (j = d(c.target).closest(m.selector, c.currentTarget)[0]) {
                            a.add(j, m.origType + "." + g.livekey, m.origHandler, m.data);
                            d.inArray(j, f) < 0 && f.push(j)
                        }
                    }
                });
                if (!f.length) {
                    return false
                }
                return d(f).bind("dragend." + g.livekey, function () {
                    a.remove(this, "." + g.livekey)
                })
            },
            hijack: function (v, w, u, t, q) {
                if (u) {
                    var r = {
                        event: v.originalEvent,
                        type: v.type
                    },
                        f = w.indexOf("drop") ? "drag" : "drop",
                        p, c = t || 0,
                        s, h;
                    t = !isNaN(t) ? t : u.interactions.length;
                    v.type = w;
                    v.originalEvent = null;
                    u.results = [];
                    do {
                        if (s = u.interactions[c]) {
                            if (!(w !== "dragend" && s.cancelled)) {
                                h = g.properties(v, u, s);
                                s.results = [];
                                d(q || s[f] || u.droppable).each(function (j, l) {
                                    p = (h.target = l) ? a.handle.call(l, v, h) : null;
                                    if (p === false) {
                                        if (f == "drag") {
                                            s.cancelled = true;
                                            u.propagates -= 1
                                        }
                                        if (w == "drop") {
                                            s[f][j] = null
                                        }
                                    } else {
                                        if (w == "dropinit") {
                                            s.droppable.push(g.element(p) || l)
                                        }
                                    }
                                    if (w == "dragstart") {
                                        s.proxy = d(g.element(p) || s.drag)[0]
                                    }
                                    s.results.push(p);
                                    delete v.result;
                                    if (w !== "dropinit") {
                                        return p
                                    }
                                });
                                u.results[c] = g.flatten(s.results);
                                if (w == "dropinit") {
                                    s.droppable = g.flatten(s.droppable)
                                }
                                w == "dragstart" && !s.cancelled && h.update()
                            }
                        }
                    } while (++c < t);
                    v.type = r.type;
                    v.originalEvent = r.event;
                    return g.flatten(u.results)
                }
            },
            properties: function (c, f, j) {
                var h = j.callback;
                h.drag = j.drag;
                h.proxy = j.proxy || j.drag;
                h.startX = f.pageX;
                h.startY = f.pageY;
                h.deltaX = c.pageX - f.pageX;
                h.deltaY = c.pageY - f.pageY;
                h.originalX = j.offset.left;
                h.originalY = j.offset.top;
                h.offsetX = c.pageX - (f.pageX - h.originalX);
                h.offsetY = c.pageY - (f.pageY - h.originalY);
                h.drop = g.flatten((j.drop || []).slice());
                h.available = g.flatten((j.droppable || []).slice());
                return h
            },
            element: function (c) {
                if (c && (c.jquery || c.nodeType == 1)) {
                    return c
                }
            },
            flatten: function (c) {
                return d.map(c, function (f) {
                    return f && f.jquery ? d.makeArray(f) : f && f.length ? g.flatten(f) : f
                })
            },
            textselect: function (c) {
                d(document)[c ? "unbind" : "bind"]("selectstart", g.dontstart).attr("unselectable", c ? "off" : "on").css("MozUserSelect", c ? "" : "none")
            },
            dontstart: function () {
                return false
            },
            callback: function () {}
        };
    g.callback.prototype = {
        update: function () {
            b.drop && this.available.length && d.each(this.available, function (c) {
                b.drop.locate(this, c)
            })
        }
    };
    b.draginit = b.dragstart = b.dragend = g
})(jQuery);
/* 
 * jquery.event.drop - v 2.0.0 
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */ (function (g) {
    g.fn.drop = function (l, b, j) {
        var f = typeof l == "string" ? l : "",
            h = g.isFunction(l) ? l : g.isFunction(b) ? b : null;
        if (f.indexOf("drop") !== 0) {
            f = "drop" + f
        }
        j = (l == h ? b : j) || {};
        return h ? this.bind(f, j, h) : this.trigger(f)
    };
    g.drop = function (b) {
        b = b || {};
        a.multi = b.multi === true ? Infinity : b.multi === false ? 1 : !isNaN(b.multi) ? b.multi : a.multi;
        a.delay = b.delay || a.delay;
        a.tolerance = g.isFunction(b.tolerance) ? b.tolerance : b.tolerance === null ? null : a.tolerance;
        a.mode = b.mode || a.mode || "intersect"
    };
    var c = g.event,
        d = c.special,
        a = g.event.special.drop = {
            multi: 1,
            delay: 20,
            mode: "overlap",
            targets: [],
            datakey: "dropdata",
            livekey: "livedrop",
            add: function (f) {
                var b = g.data(this, a.datakey);
                b.related += 1;
                if (!b.live && f.selector) {
                    b.live = true;
                    c.add(this, "dropinit." + a.livekey, a.delegate)
                }
            },
            remove: function () {
                g.data(this, a.datakey).related -= 1
            },
            setup: function () {
                if (!g.data(this, a.datakey)) {
                    g.data(this, a.datakey, {
                        related: 0,
                        active: [],
                        anyactive: 0,
                        winner: 0,
                        location: {}
                    });
                    a.targets.push(this)
                }
            },
            teardown: function () {
                if (!g.data(this, a.datakey).related) {
                    g.removeData(this, a.datakey);
                    c.remove(this, "dropinit", a.delegate);
                    var b = this;
                    a.targets = g.grep(a.targets, function (f) {
                        return f !== b
                    })
                }
            },
            handler: function (h, b) {
                var f;
                if (b) {
                    switch (h.type) {
                    case "mousedown":
                        f = g(a.targets);
                        if (typeof b.drop == "string") {
                            f = f.filter(b.drop)
                        }
                        f.each(function () {
                            var j = g.data(this, a.datakey);
                            j.active = [];
                            j.anyactive = 0;
                            j.winner = 0
                        });
                        b.droppable = f;
                        a.delegates = [];
                        d.drag.hijack(h, "dropinit", b);
                        a.delegates = g.unique(d.drag.flatten(a.delegates));
                        break;
                    case "mousemove":
                        a.event = h;
                        a.timer || a.tolerate(b);
                        break;
                    case "mouseup":
                        a.timer = clearTimeout(a.timer);
                        if (b.propagates) {
                            d.drag.hijack(h, "drop", b);
                            d.drag.hijack(h, "dropend", b);
                            g.each(a.delegates || [], function () {
                                c.remove(this, "." + a.livekey)
                            })
                        }
                        break
                    }
                }
            },
            delegate: function (j) {
                var b = [],
                    h, f = g.data(this, "events") || {};
                g.each(f.live || [], function (m, l) {
                    if (l.preType.indexOf("drop") === 0) {
                        h = g(j.currentTarget).find(l.selector);
                        h.length && h.each(function () {
                            c.add(this, l.origType + "." + a.livekey, l.origHandler, l.data);
                            g.inArray(this, b) < 0 && b.push(this)
                        })
                    }
                });
                a.delegates.push(b);
                return b.length ? g(b) : false
            },
            locate: function (n, b) {
                var m = g.data(n, a.datakey),
                    j = g(n),
                    l = j.offset() || {},
                    f = j.outerHeight();
                j = j.outerWidth();
                l = {
                    elem: n,
                    width: j,
                    height: f,
                    top: l.top,
                    left: l.left,
                    right: l.left + j,
                    bottom: l.top + f
                };
                if (m) {
                    m.location = l;
                    m.index = b;
                    m.elem = n
                }
                return l
            },
            contains: function (f, b) {
                return (b[0] || b.left) >= f.left && (b[0] || b.right) <= f.right && (b[1] || b.top) >= f.top && (b[1] || b.bottom) <= f.bottom
            },
            modes: {
                intersect: function (h, b, f) {
                    return this.contains(f, [h.pageX, h.pageY]) ? 1000000000 : this.modes.overlap.apply(this, arguments)
                },
                overlap: function (h, b, f) {
                    return Math.max(0, Math.min(f.bottom, b.bottom) - Math.max(f.top, b.top)) * Math.max(0, Math.min(f.right, b.right) - Math.max(f.left, b.left))
                },
                fit: function (h, b, f) {
                    return this.contains(f, b) ? 1 : 0
                },
                middle: function (h, b, f) {
                    return this.contains(f, [b.left + b.width * 0.5, b.top + b.height * 0.5]) ? 1 : 0
                }
            },
            sort: function (f, b) {
                return b.winner - f.winner || f.index - b.index
            },
            tolerate: function (x) {
                var y, w, u, v, t, q, s = 0,
                    r, b = x.interactions.length,
                    l = [a.event.pageX, a.event.pageY],
                    f = a.tolerance || a.modes[a.mode];
                do {
                    if (r = x.interactions[s]) {
                        if (!r) {
                            return
                        }
                        r.drop = [];
                        t = [];
                        q = r.droppable.length;
                        if (f) {
                            u = a.locate(r.proxy)
                        }
                        y = 0;
                        do {
                            if (w = r.droppable[y]) {
                                v = g.data(w, a.datakey);
                                if (w = v.location) {
                                    v.winner = f ? f.call(a, a.event, u, w) : a.contains(w, l) ? 1 : 0;
                                    t.push(v)
                                }
                            }
                        } while (++y < q);
                        t.sort(a.sort);
                        y = 0;
                        do {
                            if (v = t[y]) {
                                if (v.winner && r.drop.length < a.multi) {
                                    if (!v.active[s] && !v.anyactive) {
                                        if (d.drag.hijack(a.event, "dropstart", x, s, v.elem)[0] !== false) {
                                            v.active[s] = 1;
                                            v.anyactive += 1
                                        } else {
                                            v.winner = 0
                                        }
                                    }
                                    v.winner && r.drop.push(v.elem)
                                } else {
                                    if (v.active[s] && v.anyactive == 1) {
                                        d.drag.hijack(a.event, "dropend", x, s, v.elem);
                                        v.active[s] = 0;
                                        v.anyactive -= 1
                                    }
                                }
                            }
                        } while (++y < q)
                    }
                } while (++s < b);
                if (a.last && l[0] == a.last.pageX && l[1] == a.last.pageY) {
                    delete a.timer
                } else {
                    a.timer = setTimeout(function () {
                        a.tolerate(x)
                    }, a.delay)
                }
                a.last = a.event
            }
        };
    d.dropinit = d.dropstart = d.dropend = a
})(jQuery);
(function (c) {
    var b = [];

    function a(d, f) {
        return this instanceof a ? this._create(d, f) : new a(d, f)
    }
    c.extend(a.prototype, {
        _create: function (d, g) {
            var f = {
                title: "华为网盘",
                width: 410,
                message: "",
                value: "",
                icon: "delico",
                url: "",
                html: "",
                key: "",
                buttons: [],
                donotClose: false,
                hide: function () {},
                show: function () {},
                opacity: 0.8,
                className: "",
                submit: "确定",
                cancel: "取消",
                pop: [],
                effect: 0,
                timeout: 5000
            };
            this.options = c.extend(true, {}, f, d);
            this.call = g;
            this.createMarker();
            this._init()
        },
        _init: function () {
            var d = this,
                f = this.options;
            this.wrapper = this.bulid(f.type);
            if (this[f.type]) {
                this[f.type]()
            }
            c(window).resize(function () {
                d.postion(f.type)
            });
            return this
        },
        alert: function () {
            var d = this,
                f = this.options;
            this.wrapper.find(".dialogContainer").find(".dialogNormal").addClass(f.className).end().append('<div class="dialogFooter"><input type="submit" class="submit btn-focus" value="' + f.submit + '" /></div>').find("input.submit").addClass(f.btnClass).click(function () {
                d.submit(true)
            }).end().end().appendTo("body").show();
            d.postion();
            f.show();
            this.focus()
        },
        confirm: function () {
            var d = this,
                f = this.options;
            var h = c('<div class="dialogFooter"></div>').append('<input type="button" class="submit btn-focus" value="' + f.submit + '" />').append('<input type="button" class="reset" value="' + f.cancel + '" />').find(".submit").click(function () {
                d.submit(true)
            }).end().find(".reset").click(function () {
                d.submit(false)
            }).end();
            var g = d.buttons() ? d.buttons() : h;
            if (f.key) {
                this.wrapper.attr("id", f.key)
            }
            this.wrapper.find(".dialogContainer").find(".dialogNormal").addClass(f.className).end().append(g).end().appendTo("body").show();
            d.postion();
            f.show();
            this.focus()
        },
        prompt: function () {
            var d = this,
                f = this.options;
            this.wrapper.find(".dialogContainer").wrap('<form onsubmit = "return false"></form>').end().find(".dialogNormal").addClass("prompt").empty().append("<p>" + f.message + '： <input type="text" name="prompt" id="prompt" value="' + f.value + '" /><p>').parents("form").append('<div class="dialogFooter"><input type="submit" class="submit btn-focus" value="' + f.submit + '" /><input type="button" class="reset" value="' + f.cancel + '" /></div>').submit(function () {
                var g = c("#prompt").val() || "";
                d.submit(g);
                return false
            }).end().parents("form").find("input.reset").click(function () {
                d.close()
            }).end().end().end().appendTo("body").show();
            c("#prompt")[0].select();
            d.postion();
            f.show()
        },
        pop: function () {
            var q = this,
                g = this.options;
            var s = g.pop.length;
            var n = r(),
                h;
            this.wrapper.find(".dialog-msg-Container").html('<div class="msgcon">' + n.content + '</div><div class="dialog-msg-Footer clearfix">' + n.footer + "</div>").find("a.ico-l").click(function () {
                var o = f();
                if (o > 1) {
                    l(o - 1)
                }
            }).end().find("a.ico-r").click(function () {
                var o = f();
                if (o < s) {
                    l(o + 1)
                }
            }).end().end().appendTo("body");
            var d = this.wrapper.find("em.nums");
            var p = this.wrapper.find("div.msgcon").children();
            var j = this.wrapper.find("span.popbutton").children();
            q.postion("pop");
            g.show();
            if (g.effect !== 0) {
                this.wrapper.hover(function () {
                    if (h) {
                        clearTimeout(h);
                        q.wrapper.stop().animate({
                            opacity: 1
                        }, 500)
                    }
                }, function () {
                    h = setTimeout(m, g.timeout)
                }).fadeIn("slow", function () {
                    h = setTimeout(m, g.timeout)
                })
            } else {
                this.wrapper.show()
            }function l(o) {
                p.eq(o - 1).show().siblings().hide();
                j.eq(o - 1).show().siblings().hide();
                d.html(o + "/" + s)
            }function f() {
                return parseInt(d.html().replace(/(\d)+\/\w*/, "$1"))
            }function m() {
                q.wrapper.animate({
                    opacity: 0
                }, 2000, null, function () {
                    q.wrapper.remove();
                    g.hide()
                })
            }function r() {
                var y = {
                    content: "",
                    footer: s > 1 ? '<i class="opt"><a class="ico-l" href="javascript:;"></a><em class="nums">1/' + s + '</em><a class="ico-r" href="javascript:;"></a></i>' : ""
                };
                y.footer += '<span class="popbutton">';
                for (var u = 0; u < s; u++) {
                    var x = u === 0 ? "block" : "none";
                    var v = "";
                    var o = g.pop[u];
                    if (o.webimgurl) {
                        if (o.webimgurl === true) {
                            v = '<span class="msg-ico"></span>'
                        } else {
                            if (o.webimgurl.indexOf("http://") != -1) {
                                v = '<span class="msg-img"><img src="' + o.webimgurl + '" /></span>'
                            } else {
                                v = '<span class="msg-img"><img src="http://www.dbank.com/uploadimages/' + o.webimgurl + '" /></span>'
                            }
                        }
                    }
                    y.content += '<div style="display:' + x + '">' + v + "<h5>" + o.subject + "</h5><p>" + o.content + "</p></div>";
                    if (o.footerurl) {
                        var w = o.target ? o.target : "_blank";
                        y.footer += '<a  style="display:inline-' + x + '" href="' + o.footerurl + '" target="' + w + '">' + o.footer + "</a>"
                    } else {
                        y.footer += '<a href="javascript:;"></a>'
                    }
                }
                y.footer += "</span>";
                return y
            }
        },
        dialog: function () {
            var d = this,
                g = this.options;
            var f = c("#" + g.key + "_win");
            if (f.length != 0) {
                this.wrapper = f;
                d.wrapper.css("zIndex", d.zIndex());
                d.postion();
                d.show();
                g.show()
            } else {
                if (g.url) {
                    this.wrapper.attr("id", g.key + "_win");
                    g.url += (g.url.indexOf("?") != -1 ? "&" : "?") + "v=" + Math.random();
                    d.wrapper.appendTo("body").find(".dialogContainer").load(g.url, function () {
                        c(this).append(d.buttons());
                        if (d.call) {
                            d.call()
                        }
                        d.postion();
                        d.wrapper.show();
                        g.show()
                    });
                    a.rememberTitle = document.title
                } else {
                    if (g.html) {
                        if (g.url) {
                            return
                        }
                        this.wrapper.attr("id", g.key + "_win");
                        g.url += (g.url.indexOf("?") != -1 ? "&" : "?") + "v=" + Math.random();
                        d.wrapper.appendTo("body").find(".dialogContainer").html(g.html).append(d.buttons());
                        if (d.call) {
                            d.call()
                        }
                        d.postion();
                        d.wrapper.show();
                        g.show();
                        a.rememberTitle = document.title
                    }
                }
            }
        },
        notify: function () {
            var f = this,
                j = this.options;
            var h = j.warning ? "warning" : "succ";
            c("#notify_info").remove();
            var d = c(window).scrollTop();
            var g = c('<div id="notify_info" class="notify_info" style="margin-top:' + d + "px;z-index:" + f.zIndex() + '"><span class="' + h + '">' + j.message + "</span></div>").appendTo("body");
            if (f.call) {
                f.call()
            }
            setTimeout(function () {
                c("#notify_info").remove()
            }, j.remain ? j.remain : 3000)
        },
        bulid: function (g) {
            var d = this,
                l = this.options;
            var j = g == "pop" ? "dialog-msg-" : "dialog";
            var f = l.effect === 0 ? d.zIndex() : d.zIndex() + 10000;
            var h = c('<span class="d-close">Close</span>').hover(function () {
                c(this).addClass("d-close-hover")
            }, function () {
                c(this).removeClass("d-close-hover")
            }).mousedown(function () {
                c(this).addClass("d-close-down")
            }).mouseup(function () {
                c(this).removeClass("d-close-down")
            }).click(function () {
                d.close()
            });
            var m = c('<div class="' + j + 'Wrap" style="display:none">').css({
                zIndex: f,
                width: l.width
            }).append(h).append('<b class="dialogtop"><b class="dt1"></b><b class="dt2 dtbg"></b><b class="dt3 dtbg"></b></b>').append('<div class="dialog-mc contentbg"><div class="dialogHeader"><h4>' + l.title + "</h4></div></div>").find("div.contentbg").append('<div class="' + j + 'Container"><div class="dialogNormal"><span class="tipico ' + l.icon + '"></span><span class="tipinfor"></span></div></div>').find("span.tipinfor").html(l.message).end().end().append('<b class="dialogbottom"><b class="dt3"></b><b class="dt2"></b><b class="dt1"></b></b>');
            return m
        },
        buttons: function (j) {
            var d = this,
                l = this.options;
            var h = "";
            var g = (typeof j === "undefined") ? l.buttons : j;
            if (g.length > 0) {
                h = c("#" + l.key + "_win .dialogFooter").get(0) ? c("#" + l.key + "_win .dialogFooter").empty() : c('<div class="dialogFooter"></div>');
                for (var f in g) {
                    (function (o) {
                        var r = g[o].value || "",
                            m = g[o].attr || {},
                            q = (o == 0) ? "btn-focus " : "reset ",
                            s = g[o].callback || function () {},
                            p = g[o].pm || 0;
                        if (g[o].cls && typeof g[o].cls === "string") {
                            q += g[o].cls
                        }
                        if (g[o].type == "anchor") {
                            c('<a href="javascript:;"></a>').html(r).attr(m).bind("click", n).appendTo(h)
                        } else {
                            c('<input type="button">').val(r).addClass(q).attr(m).bind("click", n).appendTo(h)
                        }function n() {
                            var t = s(p);
                            if (t === true) {
                                d.close()
                            } else {
                                if (t === false) {} else {
                                    if (l.donotClose === false) {
                                        d.close()
                                    }
                                }
                            }
                            return false
                        }
                    })(f)
                }
            }
            return (typeof j === "undefined") ? h : d
        },
        createMarker: function () {
            var g = this.options,
                f = c("#marker");
            if (g.type != "notify" && g.type != "pop") {
                b.push(this.options.title);
                var d = this.zIndex();
                if (f.length > 0) {
                    this.marker = f.show().css("zIndex", d)
                } else {
                    this.marker = c('<div id="marker" class="marker"><iframe frameborder="0" scrolling="no" style="width:100%;height:100%;opacity:0;filter:alpha(opacity=0);" /></div>').css({
                        opacity: 0.8,
                        width: "100%",
                        zIndex: d,
                        display: "block"
                    }).appendTo("body")
                }
                this.enter();
                if (typeof c.dialog_show_callback === "function") {
                    c.dialog_show_callback()
                }
            }
        },
        enter: function (f) {
            var d = this,
                g = this.options;
            c(document).click(function (h) {
                if (!c(h.target).is("input:text,textarea")) {
                    d.focus()
                }
            });
            this.focus()
        },
        focus: function () {
            if (b.length > 0) {
                c("input.submit,input.btn-focus").trigger("focus")
            }
        },
        submit: function (d) {
            if (this.call) {
                this.call(d)
            }
            this.close()
        },
        close: function () {
            var d = this,
                g = this.options;
            if (g.type == "pop") {
                if (g.effect != 0) {
                    this.wrapper.unbind();
                    this.wrapper.animate({
                        opacity: 0
                    }, 1000, null, function () {
                        d.wrapper.remove();
                        g.hide()
                    })
                } else {
                    d.wrapper.remove();
                    g.hide()
                }
            } else {
                if (c.browser.msie && g.type == "dialog") {
                    document.title = a.rememberTitle
                }
                if (!g.hide()) {
                    g.type == "dialog" ? this.hide() : this.remove();
                    if (b.length) {
                        b.length = b.length - 1
                    }
                    this.focus();
                    if (b.length > 0) {
                        var f = this.zIndex();
                        this.marker.css("zIndex", f)
                    } else {
                        if (this.marker) {
                            this.marker.hide()
                        }
                        if (typeof c.dialog_hide_callback === "function") {
                            c.dialog_hide_callback()
                        }
                    }
                }
            }
        },
        show: function () {
            var d = this,
                f = this.options;
            a.rememberTitle = document.title;
            this.wrapper.show();
            if (d.marker) {
                this.marker.show()
            }
        },
        hide: function () {
            var d = this.options;
            this.wrapper.hide()
        },
        remove: function () {
            this.wrapper.remove()
        },
        disable: function () {
            this.wrapper.find("span.d-close").hide();
            this.wrapper.find("input.btn-focus").addClass("disabled").attr("disabled", "disabled")
        },
        enable: function () {
            this.wrapper.find("span.d-close").show();
            this.wrapper.find("input.btn-focus").removeClass("disabled").removeAttr("disabled")
        },
        zIndex: function () {
            var f = b.length,
                d = 10000;
            return d + f
        },
        postion: function (j) {
            var f = this,
                l = this.options,
                g = {};
            var h = Math.max(c(window).width(), c(document).width());
            var d = Math.max(c(document).height(), c(window).height());
            if (j == "pop") {
                if (c.browser.msie && c.browser.version == "6.0") {
                    g.right = 2;
                    g.top = c(document).height() - f.wrapper.height() - 2
                } else {
                    g.right = 2;
                    g.position = "fixed";
                    g.bottom = 2
                }
            } else {
                g.left = parseInt((c(window).width() - this.wrapper.width()) / 2);
                g.top = (c(window).height() - this.wrapper.height()) > 0 ? (c(window).height() - this.wrapper.height()) / 2 : (c(document).height() - this.wrapper.height()) / 2;
                g.top += c(window).scrollTop();
                if (this.marker) {
                    this.marker.css({
                        width: h,
                        height: d
                    })
                }
            }
            this.wrapper.css(g)
        }
    });
    c.tip = function (p) {
        var g = {
            title: "",
            message: "",
            state: "left",
            axis: 15,
            css: {},
            buttons: [],
            parent: "body"
        };
        var l = {};
        c.extend(g, p);
        var o = g.state;
        var n = g.title ? '<div class="tipsHeader"><a href="javascript:;" class="tipclose" title="关闭">close</a>' + g.title + "</div>" : "";
        if (o == "left" || o == "right") {
            l.top = g.axis
        } else {
            if (o == "top" || o == "bottom") {
                l.left = g.axis
            }
        }
        var f = c('<div class="tipsWrapper">').css(g.css).append('<div class="tipsContainer"></div>').append('<span class="tipsIconWrap t-' + o + '"></span>').find(".tipsIconWrap").css(l).end().find(".tipsContainer").append('<div class="tipsLayout">' + n + g.message + "</div>").find("a.tipclose").click(function () {
            h();
            return false
        }).end().end().appendTo(g.parent);

        function h() {
            f.remove()
        }
        if (g.buttons.length !== 0) {
            var m = g.buttons;
            var d = c('<div class="tipfooter">');
            for (var j in m) {
                (function (r) {
                    var s = m[r].value || "",
                        q = m[r].attr || {},
                        t = m[r].callback || function () {};
                    c("<a>").attr("href", "javascript:;").attr(q).html(s).click(function () {
                        h();
                        t()
                    }).appendTo(d)
                })(j)
            }
            f.find(".tipsLayout").append(d)
        }
        return {
            close: function () {
                h()
            },
            hide: function () {
                f.hide()
            },
            show: function () {
                f.show()
            }
        }
    };
    c.alert = function (d, f) {
        d.type = "alert";
        return (new a(d, f))
    };
    c.confirm = function (d, f) {
        d.type = "confirm";
        return (new a(d, f))
    };
    c.prompt = function (d, f) {
        d.type = "prompt";
        return (new a(d, f))
    };
    c.pop = function (d, f) {
        d.type = "pop";
        if (d.width == undefined) {
            d.width = 342
        }
        return (new a(d, f))
    };
    c.window = function (d, f) {
        d.type = "dialog";
        return (new a(d, f))
    };
    c.notify = function (d, f) {
        if (typeof d === "string") {
            d = {
                message: d,
                type: "notify"
            }
        } else {
            d.type = "notify"
        }
        return (new a(d, f))
    };
    c.warning = function (d, f) {
        if (typeof d === "string") {
            d = {
                message: d,
                type: "notify",
                warning: true
            }
        } else {
            d.type = "notify";
            d.warning = true
        }
        return (new a(d, f))
    };
    c.dialogshow = function (d) {
        c.dialog_show_callback = d
    };
    c.dialoghide = function (d) {
        c.dialog_hide_callback = d
    };
    c.loading = function () {
        var d = c('<div class="loading"></div>').appendTo("body");
        return {
            close: function () {
                d.remove()
            }
        }
    }
})(jQuery);
(function (a) {
    a.fn.scrollingLoad = function (b) {
        var d = {
            attr: "data-thumb"
        };
        var f = a.extend({}, d, b || {});
        f.cache = [];
        a(this).each(function () {
            var j = this.nodeName.toLowerCase();
            var h = a(this).attr(f.attr);
            if (h) {
                var l = {
                    obj: a(this),
                    tag: j,
                    url: h
                };
                f.cache.push(l)
            }
        });
        var c = a("#dbkdisklist");
        var g = function () {
                var m = c.scrollTop();
                var j = m + c.height();
                var l, h;
                a.each(f.cache, function (n, o) {
                    if (o.obj) {
                        l = o.obj.position().top;
                        h = l + o.obj.height();
                        if ((l > m && l < j) || (h > m && h < j)) {
                            if (o.tag === "img") {
                                o.obj.attr("src", o.url)
                            } else {
                                o.obj.load(o.url)
                            }
                            o.obj.removeAttr(f.attr);
                            o.obj = null
                        }
                    }
                });
                return false
            };
        g();
        c.bind("scroll", g)
    }
})(jQuery);
if (typeof (Dbank) == "undefined") {
    var Dbank = {}
}
Dbank.DbankFrames = {};
Dbank.FrameCount = 0;
Dbank.FramePrefix = "__DBankFrameUU";
Dbank.browser = {
    msie: !! (window.attachEvent && navigator.userAgent.indexOf("Opera") === -1)
};
Dbank.DbankFrame = function (c, f, b, d) {
    if (d == null || typeof (d) !== "boolean") {
        this.encode = false
    } else {
        this.encode = d
    }
    this.$events = {};
    this.parent = c;
    this.src = f;
    this.proxy = b;
    this.params = [];
    if (arguments.length > 3) {
        for (var a = 3; a < arguments.length; a++) {
            if (typeof (arguments[a]) === "string" && arguments[a].indexOf("=") != -1) {
                this.params.push(arguments[a])
            }
        }
    }++Dbank.FrameCount;
    this.id = Dbank.FramePrefix + Dbank.FrameCount;
    this.addEvent("resize", function (j) {
        if (!this.ifr_dbank) {
            return
        }
        var h = parseInt(j.split("|")[0]);
        var g = parseInt(j.split("|")[1]);
        if (h != this.ifr_width || g != this.ifr_height) {
            this.ifr_width = h;
            this.ifr_dbank.style.width = h + "px";
            this.ifr_height = g;
            this.ifr_dbank.style.height = g + "px"
        }
    });
    Dbank.DbankFrames[this.id] = this;
    this.initIframe()
};
Dbank.DbankFrame.prototype.initIframe = function () {
    this.ifr_dbank = document.createElement("iframe");
    this.ifr_dbank.setAttribute("border", 0);
    this.ifr_dbank.setAttribute("marginwidth", "0px");
    this.ifr_dbank.setAttribute("marginheight", "0px");
    this.ifr_dbank.setAttribute("scrolling", "no");
    this.ifr_dbank.setAttribute("allowtransparency", "true");
    this.ifr_dbank.setAttribute("frameBorder", 0);
    this.ifr_dbank.style.width = "100px";
    this.ifr_width = 100;
    this.ifr_dbank.style.height = "100px";
    this.ifr_height = 100;
    this.parent.appendChild(this.ifr_dbank);
    var c = document.location.href;
    var a = "?frame=" + this.id + "&proxy=" + this.proxy + "&preurl=" + c + "&pre=1";
    for (var b = 0; b < this.params.length; b++) {
        a += "&" + this.params[b]
    }
    this.ifr_dbank.src = this.ifr_src = this.src + (this.encode ? encodeURIComponent(a) : a)
};
Dbank.DbankFrame.prototype.refresh = function (a) {
    this.ifr_dbank.src = this.ifr_src + (a ? (this.encode ? encodeURIComponent("&" + a) : "&" + a) : "")
};
Dbank.DbankFrame.prototype.addEvent = function (c, b) {
    if (b && b != {}) {
        this.$events[c] = this.$events[c] || [];
        for (var a = 0; a < this.$events[c].length; ++a) {
            if (this.$events[c][a] == b) {
                return this
            }
        }
        this.$events[c].push(b)
    }
    return this
};
Dbank.DbankFrame.prototype.fireEvent = function (c, a) {
    if (!this.$events || !this.$events[c] || arguments.length < 2) {
        return this
    }
    for (var b = 0; b < this.$events[c].length; ++b) {
        this.$events[c][b].call(this, a)
    }
    return this
};
Dbank.FrameParent = function () {
    var b = document.location.search.match(/proxy=([^&]+)/);
    if (b) {
        this.proxyUrl = decodeURIComponent(b[1])
    }
    var a = document.location.search.match(/frame=([^&]+)/);
    if (a) {
        this.frameID = a[1]
    }
};
Dbank.FrameParent.prototype.fireEvent = function (c, a) {
    if (!this.proxyUrl || !this.frameID) {
        return
    }
    var b = document.createElement("iframe");
    b.src = this.proxyUrl + "?frame=" + this.frameID + "&event=" + c + "#" + a;
    b.style.display = "none";
    document.body.appendChild(b);
    var d = 0;
    b.onload = function () {
        if (d === 1) {
            b.contentWindow.document.write("");
            b.contentWindow.close();
            document.body.removeChild(b)
        } else {
            if (d === 0) {
                d = 1;
                b.contentWindow.location = ""
            }
        }
    }
};
Dbank.FrameParent.prototype.notifyResize = function (b, a) {
    var c = b + "|" + a;
    this.fireEvent("resize", c)
};
Dbank.FrameProxy = function () {
    window.onload = function () {
        if (!/event=([^&]+)/.test(document.location.search) || !/frame=([^&]+)/.test(document.location.search)) {
            return
        }
        var b = document.location.search.match(/event=([^&]+)/)[1];
        var a = document.location.search.match(/frame=([^&]+)/)[1];
        var c = window.location.hash.substr(1);
        window.parent.parent.Dbank.DbankFrames[a].fireEvent(b, c)
    }
};
if (!dbank) {
    var dbank = {}
}
if (!dbank.util) {
    dbank.util = {}
}
dbank.util.login_user_sid = $.cookie("session");
dbank.util.login_success = [];
dbank.util.login_timeout_fun = null;
dbank.util.login_closewin_href = "http://login.dbank.com/accounts/user/login.jsp";
dbank.util.login_hd = {};
dbank.util.login = function (a) {
    if (!dbank.util.login_win) {
        $("body").append('<div id="marker" class="marker"></div><div style="position:absolute;width: 409px; height: 311px;display:none;z-index:10000;" id="dbank_login_win"></div>');
        if (a.cross_domain == "vip" || a.cross_domain == "open") {
            dbank.util.login_win = new Dbank.DbankFrame(document.getElementById("dbank_login_win"), "http://login.dbank.com/login_pop.html", "http://" + a.cross_domain + ".dbank.com/proxy.html")
        } else {
            dbank.util.login_win = new Dbank.DbankFrame(document.getElementById("dbank_login_win"), "http://login.dbank.com/login_pop.html", "http://www.dbank.com/netdisk/proxy.html")
        }
        dbank.util.login_win.addEvent("success", function () {
            dbank.util.login_user_sid = $.cookie("session");
            var c = dbank.util.login_success.shift();
            while (typeof c === "function") {
                c();
                c = dbank.util.login_success.shift()
            }
        });
        dbank.util.login_win.addEvent("close", function () {
            if (typeof dbank.util.login_closewin === "function") {
                dbank.util.login_closewin()
            }
        })
    } else {
        if (dbank.util.login_user_sid && dbank.util.login_user_sid != "") {
            dbank.util.login_win.refresh("sid=" + dbank.util.login_user_sid)
        } else {
            dbank.util.login_win.refresh()
        }
        dbank.util.login_win.refresh("isupload=" + $("body").data("dbank_isuploading"))
    }
    var b = $.window({
        key: "dbank_login"
    });
    dbank.util.login_success.push(function () {
        b.close();
        a.success();
        if (!$("body").data("dbank_isuploading")) {
            window.location.reload()
        }
    });
    dbank.util.login_closewin = function () {
        b.close();
        if (dbank.util.login_closewin_href) {
            window.location = dbank.util.login_closewin_href
        }
    }
};
$.iAjaxSetting(function (a, d, c) {
    dbank.util.login_hd = c;
    if ((a.NSP_STATUS && (104 == a.NSP_STATUS || 102 == a.NSP_STATUS || 6 == a.NSP_STATUS)) || (a.errno && 4000 == a.errno)) {
        if (a.NSP_STATUS == 104) {
            Rookie(function () {
                dbank.cache.flashclearcommon("common")
            }, function () {})
        }
        if (dbank.util.login_timeout_fun && typeof dbank.util.login_timeout_fun == "function") {
            var b = dbank.util.login_timeout_fun();
            if (b) {
                c.success(a, d);
                return false
            }
        }
        dbank.util.login({
            success: function () {
                c.retry()
            },
            cross_domain: window.location.hostname.split(".")[0]
        })
    } else {
        c.success(a, d)
    }
    return true
});

function parentReload() {
    window.location.reload()
}
if (!nsp) {
    var nsp = {}
}
if (!nsp.main_index) {
    nsp.main_index = {}
}
if (!nsp.netdisk) {
    nsp.netdisk = {}
}(function () {
    nsp.main_index.url = "http://api.dbank.com/rest.php";
    nsp.main_index.api_url = "api.php";
    var r = function (w, v, u) {
            $.jsonp({
                url: nsp.main_index.api_url,
                data: w,
                dataType: "jsonp",
                callbackParameter: "callback",
                timeout: 30000,
                success: function (x) {
                    if (x) {
                        if (!x.errno) {
                            v(x)
                        } else {
                            u(x.errno, x.error)
                        }
                    }
                },
                error: function (x, z, y) {
                    if (z == "timeout") {
                        u(1000, "timeout")
                    } else {
                        u(9999, y)
                    }
                }
            })
        };
    var o = function (v) {
            var u = {
                nsp_svc: "com.dbank.business.getbalance",
                anticache: Math.floor(Math.random() * 1000)
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var q = function (v) {
            var u = {
                nsp_svc: "com.dbank.signin.signin",
                anticache: Math.floor(Math.random() * 1000)
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var g = function (v) {
            var u = {
                nsp_svc: "com.dbank.signin.issign",
                anticache: Math.floor(Math.random() * 1000)
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var b = function (v) {
            var u = {
                nsp_svc: "com.dbank.signin.forwordsign",
                anticache: Math.floor(Math.random() * 1000),
                signtype: v.signtype
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var s = function (v) {
            var u = {
                nsp_svc: "com.dbank.business.getmailcontacts",
                anticache: Math.floor(Math.random() * 1000),
                email: v.email,
                password: v.password,
                vercode: v.vercode
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var t = function (u) {
            if (!u.param) {
                if (u.error) {
                    u.error(1001, "parameter invalid")
                }
                return
            }
            return nsp.netdisk.nsp_invoke(u.param, function (v) {
                u.success(v)
            }, u.error)
        };
    var p = function (v) {
            var u = {
                nsp_svc: "com.dbank.signin.mget",
                anticache: Math.floor(Math.random() * 1000),
                start: v.start,
                size: v.pagesize
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var n = function (v) {
            var u = {
                nsp_svc: "com.dbank.business.mgetinviter",
                anticache: Math.floor(Math.random() * 1000),
                start: v.start,
                size: v.pagesize
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var j = function (v) {
            var u = {
                nsp_svc: "com.dbank.business.invitecontacts",
                anticache: Math.floor(Math.random() * 1000),
                emails: v.emails
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var f = function (v) {
            var u = {
                nsp_svc: "com.dbank.business.getinvitenum",
                anticache: Math.floor(Math.random() * 1000)
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var m = function (v) {
            var u = {
                nsp_svc: "com.dbank.business.getpaycapacity",
                anticache: Math.floor(Math.random() * 1000)
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var c = function (v) {
            var u = {
                nsp_svc: "com.dbank.business.getDirectFlow"
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var a = function (v) {
            var u = {
                nsp_svc: "com.dbank.message.countunread",
                anticache: Math.floor(Math.random() * 1000)
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var l = function (v) {
            var u = {
                nsp_svc: "com.dbank.message.mget",
                anticache: Math.floor(Math.random() * 1000),
                start: v.start,
                size: v.size
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var d = function (v) {
            var u = {
                nsp_svc: "com.dbank.message.updatesubsinfo",
                anticache: Math.floor(Math.random() * 1000),
                attrs: v.attrs
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    var h = function (v) {
            var u = {
                nsp_svc: "com.dbank.message.init"
            };
            return nsp.netdisk.nsp_invoke(u, function (w) {
                v.success(w)
            }, v.error)
        };
    nsp.main_index.getUserPoint_api = o;
    nsp.main_index.issign = g;
    nsp.main_index.signin = q;
    nsp.main_index.signtoweibo = b;
    nsp.main_index.mget = p;
    nsp.main_index.getmailcontacts = s;
    nsp.main_index.invitecontacts = j;
    nsp.main_index.getinvitenum = f;
    nsp.main_index.getpaycapacity = m;
    nsp.main_index.inviteget = n;
    nsp.main_index.ajaxnspfunc = t;
    nsp.main_index.getMsgs = l;
    nsp.main_index.getunreadmc = a;
    nsp.main_index.updatemsg = d;
    nsp.main_index.initMsg = h;
    nsp.main_index.getDlinkFlow = c
})();
if (!dbank) {
    var dbank = {}
}
if (!dbank.ui) {
    dbank.ui = {}
}
if (!dbank.ui.plugin) {
    dbank.ui.plugin = {}
}
dbank.ui.plugin.base_op = function () {
    var j, d, r, t, p, h, g, q, u;
    var a;
    var m, b;
    var l = this;
    var o = function (v) {
            var w = false;
            if (v) {
                $.each(v, function () {
                    if (this.dbank_systemType == 201 || this.dbank_systemType == 202 || this.path == "/Netdisk/文档" || this.path == "/Netdisk/照片" || this.path == "/Netdisk/我的应用" || this.path == "/Netdisk/我的应用/PublicFiles") {
                        w = true
                    }
                })
            }
            return w
        };
    var c = function (v, y) {
            if ($.isArray(v)) {
                var w = {
                    items: v,
                    to: y
                }
            } else {
                var w = v
            }
            var x = $.loading();
            a.movefile({
                files: w.items,
                pid: w.to.id,
                success: function () {
                    var z = nsp.netdisk.checkCacheStatus("nsp.user.getInfo");
                    if (z) {
                        var A = new Array();
                        A[0] = "nsp.user.profile.{" + $.cookie("session") + "}";
                        A[1] = "nsp.user.product.{" + $.cookie("session") + "}";
                        A[2] = "nsp.user.user.{" + $.cookie("session") + "}";
                        nsp.netdisk.removeCache(A)
                    }
                    x.close();
                    $.notify({
                        message: "移动成功"
                    });
                    if (w && typeof w.success == "function") {
                        w.success()
                    }
                },
                error: function (A, z) {
                    x.close();
                    if (10014 == A) {
                        $.warning({
                            message: "不能把一个文件夹移动到它的子文件夹"
                        })
                    } else {
                        if (11111 == A) {
                            $.warning({
                                message: z
                            })
                        } else {
                            $.warning({
                                message: "移动失败"
                            })
                        }
                    }
                    if (w && typeof w.error == "function") {
                        w.error()
                    }
                }
            })
        };
    var f = function (v, y) {
            if ($.isArray(v)) {
                var w = {
                    items: v,
                    to: y
                }
            } else {
                var w = v
            }
            var x = $.loading();
            a.copyfile({
                files: w.items,
                pid: w.to.id,
                success: function () {
                    x.close();
                    $.notify({
                        message: "复制成功"
                    });
                    if (w && typeof w.success == "function") {
                        w.success()
                    }
                },
                error: function (A, z) {
                    x.close();
                    if (10025 == A) {
                        $.warning({
                            message: "不能把一个文件夹复制到它的子文件夹"
                        })
                    } else {
                        if (11111 == A) {
                            $.warning({
                                message: z
                            })
                        } else {
                            if (10072 == A) {
                                $.warning({
                                    message: z
                                })
                            } else {
                                $.warning({
                                    message: "复制失败"
                                })
                            }
                        }
                    }
                    if (w && typeof w.error == "function") {
                        w.error()
                    }
                }
            })
        };
    this.init = function (w) {
        a = w;
        j = a.create_function_button({
            name: "上传文件",
            cls: "upload-btn-normal",
            contextmenu: "none",
            image_url: "http://st1.dbank.com/netdisk/images/upload.png?v=2.5.9",
            callback: function () {
                var z = null;
                var y = function () {
                        $("#dbank_upload_win div.dialogHeader h4").html("上传文件到“" + dbank.util.str_trim(m.directory.name, 13) + "”文件夹");
                        $("#dbkuploadfile").upload({
                            directory: m.directory,
                            explorer: a
                        });
                        $("#dbank_upload_start").show();
                        $("#dbank_upload_sure").hide();
                        $("#dbank_upload_cancel").hide()
                    };
                var x = function () {
                        $.confirm({
                            key: "dbank_upload_iscancel",
                            title: "上传文件",
                            message: "要取消正在上传中的文件吗？"
                        }, function (B) {
                            if (B) {
                                z.cancelQueue();
                                A.close();
                                A.enable()
                            }
                        })
                    };
                var A = $.window({
                    show: y,
                    title: "上传文件到“" + dbank.util.str_trim(m.directory.name, 13) + "”文件夹",
                    url: "html/dialog/upload.html?v=1.0",
                    key: "dbank_upload",
                    buttons: [{
                        value: "关闭",
                        attr: {
                            id: "dbank_upload_start"
                        },
                        callback: l.check_uploadtips
                    }, {
                        value: "完成",
                        attr: {
                            id: "dbank_upload_sure"
                        }
                    }, {
                        value: "取消",
                        attr: {
                            id: "dbank_upload_cancel",
                            style: "display:none"
                        },
                        callback: function () {
                            x();
                            return false
                        }
                    }]
                }, function () {
                    $("#dbkuploadfile").config("start_handler", function (B) {
                        $("body").data("dbank_isuploading", true);
                        $("#dbank_upload_start").hide();
                        $("#dbank_upload_sure").hide();
                        $("#dbank_upload_cancel").show();
                        z = B.swf_uploader;
                        A.disable()
                    });
                    $("#dbkuploadfile").config("finish_handler", function (B) {
                        var D = B.uploadingFileCount();
                        var C = B.uploadQueueCount();
                        if (C == 0) {
                            $("body").data("dbank_isuploading", false);
                            $("#dbank_upload_start").show();
                            $("#dbank_upload_cancel").hide();
                            $("#dbank_upload_sure").hide();
                            A.enable()
                        } else {
                            if (B.uploadingFileCount() == 0) {
                                $("body").data("dbank_isuploading", false);
                                $("#dbank_upload_start").hide();
                                $("#dbank_upload_cancel").hide();
                                $("#dbank_upload_sure").show();
                                A.enable()
                            }
                        }
                    })
                })
            }
        });
        j.hide();
        r = a.create_function_button({
            name: "新建文件夹",
            contextmenu: "none",
            image_url: "images/newfile.png?v=2.5.9",
            callback: function () {
                $.prompt({
                    title: "新建文件夹",
                    message: "请输入文件夹名"
                }, function (x) {
                    var y = dbank.util.process_filename(x, 255);
                    if (y.msg) {
                        $.alert({
                            title: "新建文件夹出错",
                            message: y.msg
                        });
                        return
                    }
                    x = y.name;
                    var z;
                    if (m.directory && m.directory.path) {
                        z = dbank.util.str_trim(m.directory.path + "/" + x, 203);
                        if (z.substring(z.length - 3) === "...") {
                            $.alert({
                                title: "新建文件夹出错",
                                message: "文件夹路径长度不能超过200位字符"
                            });
                            return
                        }
                    }
                    z = dbank.util.str_trim(x, 19);
                    var A = $.loading();
                    a.mkdir({
                        name: x,
                        success: function () {
                            var B = nsp.netdisk.checkCacheStatus("nsp.user.getInfo");
                            if (B) {
                                var C = new Array();
                                C[0] = "nsp.user.profile.{" + $.cookie("session") + "}";
                                C[1] = "nsp.user.product.{" + $.cookie("session") + "}";
                                C[2] = "nsp.user.user.{" + $.cookie("session") + "}";
                                nsp.netdisk.removeCache(C)
                            }
                            A.close();
                            $.notify({
                                message: "新建文件夹“" + z + "”成功"
                            })
                        },
                        error: function (C, B) {
                            A.close();
                            if (301 == C) {
                                var D = "存在同名文件"
                            } else {
                                if (302 == C) {
                                    var D = "存在同名文件夹"
                                } else {
                                    if (10003 == C) {
                                        var D = "该" + type + "数据已经损坏"
                                    } else {
                                        if (10004 == C) {
                                            var D = "超过系统的文件夹路径长度限制"
                                        } else {
                                            if (401 == C) {
                                                var D = B
                                            }
                                        }
                                    }
                                }
                            }
                            $.warning({
                                message: "新建文件夹“" + z + "”失败：" + (D ? D : "系统忙，请稍后重试")
                            })
                        }
                    })
                })
            }
        });
        r.hide();
        d = a.create_function_button({
            name: "下载",
            category: "filesop",
            image_url: "images/download.png?v=2.5.9",
            callback: function () {
                if (!$("#dbank_download_iframe")[0]) {
                    this.ifr_dl = document.createElement("iframe");
                    this.ifr_dl.setAttribute("id", "dbank_download_iframe");
                    this.ifr_dl.style.display = "none";
                    $("body").append(this.ifr_dl)
                }
                if (m.items[0].url) {
                    $("#dbank_download_iframe").attr("src", m.items[0].url)
                } else {
                    $.warning("系统忙，请稍后重试")
                }
            }
        });
        d.hide();
        btn_clear = a.create_function_button({
            name: "清空",
            contextmenu: "none",
            image_url: "images/restore.png?v=2.5.9",
            callback: function () {
                $.confirm({
                    title: "清空回收站",
                    message: "清空后，回收站内的文件将被永久删除！"
                }, function (x) {
                    if (x) {
                        var y = $.loading();
                        a.clr_recycle({
                            success: function () {
                                b = null;
                                btn_clear.hide();
                                y.close();
                                $.notify({
                                    message: "清空回收站成功"
                                });
                                l.pwd_change(m.directory)
                            },
                            error: function (A, z) {
                                y.close();
                                $.alert({
                                    title: "清空回收站出错",
                                    message: "删除失败！"
                                })
                            }
                        })
                    }
                })
            }
        });
        btn_clear.hide();
        t = a.create_function_button({
            name: "重命名",
            image_url: "images/Rename.png?v=2.5.9",
            category: "editop",
            shortcut: {
                keyCode: 113,
                ctrlKey: false,
                shiftKey: false
            },
            callback: function () {
                if (m && m.items && m.directory && m.items.length) {
                    if (1 == m.items.length && 5 != m.directory.dbank_systemType && 201 != m.items[0].dbank_systemType && 202 != m.items[0].dbank_systemType && m.items[0].path != "/Netdisk/文档" && m.items[0].path != "/Netdisk/照片" && m.items[0].path != "/Netdisk/我的应用" && m.items[0].path != "/Netdisk/我的应用/PublicFiles") {
                        var C = (m.items[0].type == "File") ? "文件" : "文件夹";
                        var y = $("tr.selected");
                        var A = $("tr.selectable").index(y);
                        var z = m;
                        var D = function (E) {
                                var F = dbank.util.process_filename(E, C === "文件" ? 250 : 250);
                                if (F.msg) {
                                    $.alert({
                                        title: "重命名" + C + "出错",
                                        message: C + F.msg
                                    });
                                    return
                                }
                                E = F.name;
                                var I;
                                if (C === "文件夹" && z.directory.path) {
                                    I = dbank.util.str_trim(z.directory.path + "/" + E, 203);
                                    if (I.substring(I.length - 3) === "...") {
                                        $.alert({
                                            title: "重命名出错",
                                            message: "文件夹路径长度不能超过200位字符"
                                        });
                                        return
                                    }
                                }
                                var G = z.items[0].name;
                                I = dbank.util.str_trim(G, 19);
                                if (E == G) {
                                    $.notify({
                                        message: "重命名" + C + "“" + I + "”成功"
                                    });
                                    return
                                }
                                var H = function () {
                                        var K = true;
                                        var L = z.directory.childList;
                                        if (L && L.length > 0) {
                                            $.each(L, function () {
                                                var N = this.name;
                                                if (N == E) {
                                                    var M = this.type == "文件" ? "存在同名文件" : "存在同名文件夹";
                                                    $.warning({
                                                        title: "重命名出错",
                                                        message: "重命名" + C + "“" + I + "”失败：" + (M ? M : "系统忙，请稍后重试")
                                                    });
                                                    K = false
                                                }
                                            })
                                        }
                                        return K
                                    };
                                if (!H()) {
                                    return
                                }
                                var J = $.loading();
                                a.rename({
                                    id: z.items[0].id,
                                    name: E,
                                    success: function (K) {
                                        J.close();
                                        $.notify({
                                            message: "重命名" + C + "“" + I + "”成功"
                                        });
                                        $("tr.selectable").eq(A).click()
                                    },
                                    error: function (L, K) {
                                        J.close();
                                        if (301 == L) {
                                            var M = "存在同名文件"
                                        } else {
                                            if (302 == L) {
                                                var M = "存在同名文件夹"
                                            } else {
                                                if (10003 == L) {
                                                    var M = "该" + C + "数据已经损坏"
                                                }
                                            }
                                        }
                                        $.warning({
                                            title: "重命名出错",
                                            message: "重命名" + C + "“" + I + "”失败：" + (M ? M : "系统忙，请稍后重试")
                                        })
                                    }
                                })
                            };
                        var x = document.createElement("input");
                        x.value = z.items[0].name;
                        x.className = "renameinput";
                        var B = function (G) {
                                if (G.keyCode === 13 || G.type === "blur") {
                                    var F = G.target;
                                    var E = F.value;
                                    $(F).parent().html(z.items[0].name);
                                    D(E)
                                } else {
                                    if (G.keyCode === 46) {
                                        G.stopPropagation()
                                    }
                                }
                            };
                        $(x).bind("keydown blur", B).bind("dblclick click mousedown mouseover mouseenter", function (E) {
                            E.stopPropagation()
                        });
                        y.removeClass("selected").find("strong").html(x);
                        $(x).focus().select()
                    } else {
                        if (m.items.length > 1) {
                            $.warning("不能一次重命名多个文件")
                        } else {
                            if (201 == m.items[0].dbank_systemType || 202 == m.items[0].dbank_systemType) {
                                $.warning("系统文件夹不能重命名")
                            } else {
                                if (m.items[0].path === "/Netdisk/文档" || m.items[0].path === "/Netdisk/照片") {
                                    $.warning("系统文件夹不能重命名")
                                } else {
                                    if (m.items[0].path === "/Netdisk/我的应用" || m.items[0].path === "/Netdisk/我的应用/PublicFiles") {
                                        $.warning("系统文件夹不能重命名")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        t.hide();
        p = a.create_function_button({
            name: "复制",
            category: "editop",
            shortcut: {
                keyCode: 67,
                ctrlKey: true,
                shiftKey: false
            },
            image_url: "images/editcopy.png?v=2.5.9",
            callback: function () {
                if (m && m.items && m.items.length && m.directory && m.directory.dbank_systemType != 5) {
                    var x = o(m.items);
                    if (!x) {
                        b = m;
                        b.op = "copy";
                        g.show();
                        $.notify({
                            message: "已经复制到剪贴板"
                        })
                    } else {
                        if (x) {
                            $.warning("系统文件夹不能复制")
                        }
                    }
                }
            }
        });
        p.hide();
        h = a.create_function_button({
            name: "剪切",
            category: "editop",
            image_url: "images/cut.png?v=2.5.9",
            shortcut: {
                keyCode: 88,
                ctrlKey: true,
                shiftKey: false
            },
            callback: function () {
                if (m && m.items && m.items.length) {
                    var x = o(m.items);
                    if (!x) {
                        b = m;
                        b.op = "cut";
                        g.hide();
                        $.notify({
                            message: "已经剪切到剪贴板"
                        })
                    } else {
                        if (x) {
                            $.warning("系统文件夹不能移动")
                        }
                    }
                }
            }
        });
        h.hide();
        g = a.create_function_button({
            name: "粘贴",
            category: "editop",
            image_url: "images/zt.png?v=2.5.9",
            shortcut: {
                keyCode: 86,
                ctrlKey: true,
                shiftKey: false
            },
            callback: function () {
                if (!b) {
                    return
                }
                var z = false;
                var y = false;
                if (b && b.items) {
                    $.each(b.items, function () {
                        if (a.check_parent_relation(this.id, m.directory.id)) {
                            z = true
                        }
                        if (this.id == m.directory.id) {
                            y = true
                        }
                    })
                }
                if (b.op === "cut" && (z || b.directory.id === m.directory.id || y)) {
                    return
                } else {
                    if (b.op === "copy" && (z || y)) {
                        return
                    }
                }
                if (m.directory.path == "/Netdisk/我的应用") {
                    $.warning({
                        message: "不允许" + (b.op == "cut" ? "剪切" : "复制") + "到“我的应用”"
                    });
                    return
                }
                var x = b;
                if (5 == m.directory.dbank_systemType) {
                    if (x.op === "cut") {
                        m.items = x.items;
                        return v.callback({
                            source: "self.cut"
                        })
                    } else {
                        if (x.op === "copy") {
                            $.warning({
                                message: "不允许复制到回收站"
                            });
                            return
                        }
                    }
                }
                b = null;
                g.hide();
                if (x.op === "cut") {
                    if (x.directory.id === m.directory.id) {
                        return
                    }
                    var A = $.loading();
                    a.movefile({
                        files: x.items,
                        pid: m.directory.id,
                        success: function () {
                            A.close();
                            $.notify({
                                message: "粘贴操作成功"
                            });
                            l.pwd_change(m.directory)
                        },
                        error: function (C, B) {
                            A.close();
                            if (10014 == C) {
                                $.warning({
                                    message: "不能把一个文件夹移动到它的子文件夹"
                                })
                            } else {
                                if (11111 == C) {
                                    $.warning({
                                        message: B
                                    })
                                } else {
                                    $.warning({
                                        message: "粘贴操作失败"
                                    })
                                }
                            }
                        }
                    })
                } else {
                    if (x.op === "copy") {
                        var A = $.loading();
                        a.copyfile({
                            files: x.items,
                            pid: m.directory.id,
                            success: function () {
                                var B = nsp.netdisk.checkCacheStatus("nsp.user.getInfo");
                                if (B) {
                                    var C = new Array();
                                    C[0] = "nsp.user.profile.{" + $.cookie("session") + "}";
                                    C[1] = "nsp.user.product.{" + $.cookie("session") + "}";
                                    C[2] = "nsp.user.user.{" + $.cookie("session") + "}";
                                    nsp.netdisk.removeCache(C)
                                }
                                A.close();
                                $.notify({
                                    message: "粘贴操作成功"
                                });
                                l.pwd_change(m.directory)
                            },
                            error: function (C, B) {
                                A.close();
                                if (10025 == C) {
                                    $.warning({
                                        message: "不能把一个文件夹复制到它的子文件夹"
                                    })
                                } else {
                                    if (11111 == C) {
                                        $.warning({
                                            message: B
                                        })
                                    } else {
                                        if (10072 == C) {
                                            $.warning({
                                                message: B
                                            })
                                        } else {
                                            $.warning({
                                                message: "粘贴操作失败"
                                            })
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
            }
        });
        g.hide();
        var v = {
            name: "删除",
            category: "editop",
            image_url: "images/delete.png?v=2.5.9",
            shortcut: {
                keyCode: 46,
                ctrlKey: false,
                shiftKey: false
            },
            callback: function (y) {
                if (m && m.items && m.items.length) {
                    if (!o(m.items)) {
                        var A = "删除文件";
                        var z = "您确定要删除吗？";
                        var x = (!(y && y.source === "self.cut") && 5 == m.directory.dbank_systemType);
                        if (m.items.length == 1) {
                            if (m.items[0].type == "Directory") {
                                A = "删除文件夹";
                                z = x ? "文件夹被删除后将不可恢复，您确定要删除吗？" : "确定要把文件夹“" + dbank.util.str_trim(m.items[0].name, 35) + "”和里面的所有内容放入回收站么？"
                            } else {
                                A = "删除文件";
                                z = x ? "文件被删除后将不可恢复，您确定要删除吗？" : "确定要把文件“" + dbank.util.str_trim(m.items[0].name, 35) + "”放入回收站么？"
                            }
                        } else {
                            A = "删除多个文件";
                            z = x ? "这 " + m.items.length + " 项被删除后将不可恢复，您确定要删除吗？" : "确定要把这 " + m.items.length + " 项放入回收站么？"
                        }
                        $.confirm({
                            title: A,
                            message: z
                        }, function (B) {
                            if (B) {
                                var C = m.items;
                                var D = $.loading();
                                a.rmfile({
                                    files: C,
                                    success: function () {
                                        var E = nsp.netdisk.checkCacheStatus("nsp.user.getInfo");
                                        if (E) {
                                            var F = new Array();
                                            F[0] = "nsp.user.profile.{" + $.cookie("session") + "}";
                                            F[1] = "nsp.user.product.{" + $.cookie("session") + "}";
                                            F[2] = "nsp.user.user.{" + $.cookie("session") + "}";
                                            nsp.netdisk.removeCache(F)
                                        }
                                        if (m.items) {
                                            $.each(C, function () {
                                                for (var G = 0; G < m.items.length; G++) {
                                                    if (this.id == m.items[G].id) {
                                                        m.items = m.items.slice(0, G).concat(m.items.slice(G + 1))
                                                    }
                                                }
                                            })
                                        }
                                        $("#btn_cate_filesop").hide();
                                        b = null;
                                        g.hide();
                                        D.close();
                                        $.notify({
                                            message: "删除成功"
                                        });
                                        l.pwd_change(m.directory)
                                    },
                                    error: function (F, E) {
                                        D.close();
                                        if (11111 == F) {
                                            $.warning({
                                                message: E
                                            })
                                        } else {
                                            $.warning({
                                                title: A,
                                                message: "删除失败"
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    } else {
                        $.warning("系统文件夹不允许删除")
                    }
                }
            }
        };
        q = a.create_function_button(v);
        q.hide();
        u = a.create_function_button({
            name: "还原",
            image_url: "images/restore.png?v=2.5.9",
            callback: function () {
                if (m && m.items && m.items.length) {
                    var x = $.loading();
                    a.restorefile({
                        files: m.items,
                        success: function () {
                            x.close();
                            $.notify({
                                message: "还原成功"
                            });
                            m.items = undefined;
                            b = undefined;
                            g.hide()
                        },
                        error: function (z, y) {
                            x.close();
                            if (11111 == z) {
                                $.warning({
                                    message: y
                                })
                            } else {
                                $.notify({
                                    message: "还原失败"
                                })
                            }
                        }
                    })
                }
            }
        });
        u.hide();
        return true
    };
    this.items_selected = function (v, w) {
        var x = false;
        $.each(v, function () {
            if (this.dbank_systemType == 201 || this.dbank_systemType == 202) {
                x = true
            }
            if (this.path === "/Netdisk/文档" || this.path === "/Netdisk/照片" || this.path === "/Netdisk/我的应用" || this.path === "/Netdisk/我的应用/PublicFiles") {
                x = true
            }
        });
        if (1 == v.length && 5 != w.dbank_systemType && "File" == v[0].type) {
            d.show()
        } else {
            d.hide()
        }
        if (!x && v.length > 0) {
            if (v.length == 1 && 5 != w.dbank_systemType) {
                t.show()
            } else {
                t.hide()
            }
            h.show();
            q.show()
        } else {
            t.hide();
            h.hide();
            q.hide()
        }
        if (5 == w.dbank_systemType) {
            p.hide();
            if (v.length > 0) {
                u.show()
            } else {
                u.hide()
            }
        } else {
            if (!x && v.length > 0) {
                p.show()
            } else {
                p.hide()
            }
            u.hide()
        }
        m = {
            items: v,
            directory: w
        }
    };
    var n;
    this.pwd_change = function (v) {
        if (n) {
            n.hide()
        }
        j.setClass("upload-btn-normal");
        if (5 == v.dbank_systemType) {
            j.hide();
            r.hide();
            if (parseInt(v.fileCount) > 0 || parseInt(v.dirCount) > 0) {
                btn_clear.show()
            } else {
                btn_clear.hide()
            }
        } else {
            if (v.path == "/Netdisk/我的应用") {
                j.hide();
                r.hide()
            } else {
                j.show();
                l.check_uploadtips();
                r.show();
                btn_clear.hide()
            }
        }
        if (v.path == "/Netdisk/我的应用/PublicFiles") {
            $("#publicFilesTips").html("这是公开文件夹，文件可能被他人下载！请勿存储违规文件，一经发现封号并上报公安机关！").show()
        } else {
            $("#publicFilesTips").hide()
        }
        t.hide();
        p.hide();
        h.hide();
        q.hide();
        u.hide();
        d.hide();
        m = {
            directory: v
        };
        var w = false;
        if (b && b.items) {
            $.each(b.items, function () {
                if (a.check_parent_relation(this.id, m.directory.id) || this.id == m.directory.id) {
                    w = true
                }
            })
        }
        if (!b || (b.op === "cut" && (b.directory.id === m.directory.id || w)) || (b.op === "copy" && (5 == v.dbank_systemType || (b.directory.id === m.directory.id || w)) || v.path == "/Netdisk/我的应用")) {
            g.hide()
        } else {
            g.show()
        }
    };
    this.items_change = function (v, w) {
        this.pwd_change(w)
    };
    var s = function (v, z, w) {
            if (o(v)) {
                return true
            }
            var x = false;
            var y = false;
            if (v) {
                $.each(v, function () {
                    if (a.check_parent_relation(this.id, z.id)) {
                        x = true
                    }
                    if (this.id == z.id) {
                        y = true
                    }
                })
            }
            if (!w && (x || v[0].pid === z.id || y)) {
                return true
            }
            if (5 == z.dbank_systemType && w) {
                return true
            }
            return false
        };
    this.items_drag = function (v, x, w) {
        if (typeof w.hasSysFile == "undefined") {
            w.hasSysFile = o(v)
        }
        if (w.hasSysFile) {
            a.drag_n_drop.setDragClass("op-none")
        } else {
            if (x.ctrlKey) {
                a.drag_n_drop.setDragClass("op-add")
            } else {
                a.drag_n_drop.setDragClass()
            }
        }
    };
    this.items_drop_hover = function (v, z, x, w) {
        var y = z.id + x.ctrlKey;
        if (typeof w[y] == "undefined") {
            w[y] = s(v, z, x.ctrlKey)
        }
        if (w[y]) {
            a.drag_n_drop.setDropClass("op-none")
        } else {
            if (x.ctrlKey) {
                a.drag_n_drop.setDropClass("op-add")
            } else {
                a.drag_n_drop.setDropClass()
            }
        }
    };
    this.items_drop = function (z, D, v, B) {
        var A = D.id + v.ctrlKey;
        if (typeof B[A] == "undefined") {
            B[A] = s(z, D, v.ctrlKey)
        }
        if (!B[A]) {
            if (v.ctrlKey) {
                f(z, D)
            } else {
                var x = D;
                if (5 == x.dbank_systemType) {
                    if (m && m.items && m.items.length) {
                        if (!o(m.items)) {
                            var C = "删除文件";
                            var w = "您确定要删除吗？";
                            var y = (5 == m.directory.dbank_systemType);
                            if (m.items.length == 1) {
                                if (m.items[0].type == "Directory") {
                                    C = "删除文件夹";
                                    w = y ? "文件夹被删除后将不可恢复，您确定要删除吗？" : "确定要把文件夹“" + dbank.util.str_trim(m.items[0].name, 35) + "”和里面的所有内容放入回收站么？"
                                } else {
                                    C = "删除文件";
                                    w = y ? "文件被删除后将不可恢复，您确定要删除吗？" : "确定要把文件“" + dbank.util.str_trim(m.items[0].name, 35) + "”放入回收站么？"
                                }
                            } else {
                                C = "删除多个文件";
                                w = y ? "这 " + m.items.length + " 项被删除后将不可恢复，您确定要删除吗？" : "确定要把这 " + m.items.length + " 项放入回收站么？"
                            }
                            $.confirm({
                                title: C,
                                message: w
                            }, function (E) {
                                if (E) {
                                    var F = m.items;
                                    var G = $.loading();
                                    a.rmfile({
                                        files: F,
                                        success: function () {
                                            if (m.items) {
                                                $.each(F, function () {
                                                    for (var H = 0; H < m.items.length; H++) {
                                                        if (this.id == m.items[H].id) {
                                                            m.items = m.items.slice(0, H).concat(m.items.slice(H + 1))
                                                        }
                                                    }
                                                })
                                            }
                                            b = null;
                                            g.hide();
                                            G.close();
                                            $.notify({
                                                message: "删除成功"
                                            });
                                            l.pwd_change(m.directory)
                                        },
                                        error: function (I, H) {
                                            G.close();
                                            if (11111 == I) {
                                                $.warning({
                                                    message: H
                                                })
                                            } else {
                                                $.warning({
                                                    title: C,
                                                    message: "删除失败"
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        } else {
                            $.warning("系统文件夹不允许删除")
                        }
                    }
                } else {
                    c(z, D)
                }
            }
        }
    };
    this.check_uploadtips = function () {
        nsp.netdisk.userinfo({
            success: function (w) {
                if (w.useredSpace == 0 && !$.cookie("upload_tips")) {
                    j.setClass("upload-btn");
                    if (n) {
                        n.show()
                    } else {
                        var v = j.offset();
                        n = $.tip({
                            title: "<p style='color:#BA8D54;'>使用技巧:</p>",
                            message: "<b>您的网盘里什么都没有哦。</b>点击“上传文件”按钮，就可以存储你的文档、照片、音乐和软件啦。",
                            state: "top",
                            axis: 18,
                            css: {
                                left: v.left,
                                top: v.top + j.height() + 14,
                                width: 280,
                                color: "#64645A",
                                backgroundColor: "#FFFDB4",
                                border: "#FFFD84",
                                zIndex: 1000
                            },
                            buttons: [{
                                value: "我知道了",
                                callback: function () {
                                    $.cookie("upload_tips", "1", {
                                        expires: 365
                                    });
                                    j.setClass("upload-btn-normal");
                                    n = null
                                }
                            }]
                        })
                    }
                } else {
                    if (n) {
                        n.close();
                        n = null
                    }
                    j.setClass("upload-btn-normal");
                    if (!$.cookie("upload_tips")) {
                        $.cookie("upload_tips", "1", {
                            expires: 365
                        })
                    }
                }
            },
            error: function () {
                if (window.console) {
                    console.log("check_uploadtips error!")
                }
            }
        })
    }
};
dbank.util.str_trim = function (c, a) {
    var d = 0;
    for (var b = 0; b < c.length; b++) {
        d++;
        if (c.charCodeAt(b) > 255) {
            d++
        }
        if (d + 3 > a) {
            return c.substr(0, b) + "..."
        }
    }
    return c
};
dbank.util.process_filename = function (a, d) {
    a = $.trim(a);
    if (a.charAt(0) == "." || a.charAt(0) == "．") {
        return {
            name: "",
            msg: "名称不能以.开头"
        }
    }
    a = $.trim(a.replace(/(\.)+$/g, ""));
    if (a.match(/[<>:"\/\\|\?\*]+/g)) {
        return {
            name: "",
            msg: '名称不能包含下列任何字符之一: <br/> \\ / ? " < > | * : '
        }
    }
    var c = a.match(/^((CON|PRN|AUX|NUL|COM\d|LPT\d|CLOCK\$)\s*)(\.\S*)?$/gi);
    if (c) {
        return {
            name: "",
            msg: "名称中不能使用系统保留字：" + c
        }
    }
    var f = a.length;
    for (var b = 0; b < a.length; b++) {
        c = a.charCodeAt(b);
        if (c < 32) {
            return {
                name: "",
                msg: "名称中不能使用特殊字符"
            }
        }
        f += (c > 255) ? 1 : 0
    }
    c = (d) ? d : 255;
    if (f > c || f < 1) {
        return {
            name: "",
            msg: "名称只允许1-" + c + "位字符"
        }
    }
    return {
        name: a,
        msg: ""
    }
};
if (!dbank) {
    var dbank = {}
}
if (!dbank.ui) {
    dbank.ui = {}
}
if (!dbank.ui.plugin) {
    dbank.ui.plugin = {}
}
dbank.ui.plugin.history = function () {
    var f, j;
    if (document.all && !/MSIE 6.0/ig.test(navigator.appVersion)) {
        if (!document.getElementById("dbkhistory")) {
            var c = document.createElement("iframe");
            c.style.display = "none";
            c.id = "dbkhistory";
            document.body.appendChild(c)
        }
        setInterval(function () {
            var l = document.getElementById("dbkhistory").document || document.getElementById("dbkhistory").contentWindow.document;
            if (l && l.location.hash != location.hash) {
                location.hash = l.location.hash
            }
        }, 500)
    }
    var d = function (l) {
            location.hash = l;
            if (document.all && !/MSIE 6.0/ig.test(navigator.appVersion)) {
                var m = document.getElementById("dbkhistory").contentWindow.document;
                if (m) {
                    m.open();
                    m.close();
                    m.location.hash = l
                }
            }
        };
    var g = null;
    var h = function () {
            g = f.pwd();
            d(g);
            j = setInterval(a, 1000)
        };
    var b = function () {
            var l = window.location.href.indexOf("#");
            if (l != -1 && l < window.location.href.length - 1) {
                var m = window.location.href.substr(l + 1)
            }
            if (m) {
                return decodeURIComponent(m)
            }
        };
    var a = function () {
            var l = b();
            if ((!l || l == "") && g && g != "") {
                d(g)
            }
            if (l && g != l) {
                window.clearInterval(j);
                f.cd(l, h, h)
            } else {
                var m = f.pwd();
                if (m && m != "" && m != g) {
                    g = m;
                    d(g)
                }
            }
        };
    this.init = function (l) {
        f = l;
        g = b();
        j = setInterval(a, 1000)
    }
};


var reader = {};


reader.openRead = function() {
	
	
	alert(dbank.ui.plugin.base_op);
	/*
	var a = yunpan.fo.getSelectFile();
	$('#ifrDownload').load(function() {
		  alert("the iframe has been loaded");
		});
	
	$("#hidDLPath").val(a[0].attr("data-path"));
	
	$("#frmDownload").submit();
	
	*/
	/*
	
	
	
	
	$('#frmPackDownload').bind("submit", function() {
		alert(1);
	});
	
	*/
	
	/*
	 $.ajax({
		   type: 'HEAD',
		   dataType: "json",
		   url:"http://c4.yunpan.360.cn/file/download?fname=" + a[0].attr("data-path"),
		   success: function(data, textStatus) {
			   alert(textStatus);
		        if (data.redirect) {
		            // data.redirect contains the string URL to redirect to
		            window.location.href = data.redirect;
		        }
		        else {
		            // data.form contains the HTML for the replacement form
		            $("#myform").replaceWith(data.form);
		        }
		    }	
	});
	*/
	 /*,
		   complete: function(jqXHR, textStatus) {
			   alert(jqXHR.getResponseHeader("Location"));
			   alert(textStatus);
		   }
		   */
	 /*
		   success: function(data, textStatus, XMLHttpRequest){
		        alert(XMLHttpRequest.getResponseHeader('Location'));
		   },
		   error: function (XMLHttpRequest, textStatus, errorThrown) {
			   alert(XMLHttpRequest.getResponseHeader('Location'));
		   }
	  */
	 
	 
	 
	 /*
	 var url = "http://dl4.yunpan.360.cn/intf.php?method=Sync.downloadFile"
		  + "&qid=" + document.getElementById("frmPackDownload").qid.value
		  + "&fname=" + a[0].attr("data-path")
		  + "&rtick=" + new Date().getTime()
		  + "&sign=" + a[0].attr("data-fhash")
		  + "&devtype=web&v=1.0.1";
		  */
	 //http://dl4.yunpan.360.cn/intf.php?method=Sync.downloadFile&qid=143970357&fname=%2F%E4%B9%A6%E7%B1%8D%2F%E5%B0%8F%E8%AF%B4%2F%EF%BC%91%E5%8F%B7%E4%B8%93%E6%A1%88%E7%BB%84.txt&rtick=13412137675793&devtype=web&v=1.0.1&sign=1ba69a94bbe1ab30d5f11c24a0ffcf22&
		 
		 
	//window.open(url);
}



reader.openRead();

