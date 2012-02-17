/*{"version":"6038366","mac":"1:b28c7106c511e51c1c50969a4d6d92c9600b5e0b99b3c4b282192bd872fd5d98","created":"2011-09-19T06:18:21Z","k":"0.10.0"}*/
;(function(window,document,undefined){
var i=true,o=null,q=false;function r(a){return function(c){this[a]=c}}function s(a){return function(){return this[a]}}var t;function u(a,c){var b=arguments.length>2?Array.prototype.slice.call(arguments,2):[];return function(){b.push.apply(b,arguments);return c.apply(a,b)}}function v(a,c){this.o=a;this.f=c}t=v.prototype;
t.createElement=function(a,c,b){a=this.o.createElement(a);if(c)for(var d in c)if(c.hasOwnProperty(d))if(d=="style"&&this.f.getName()=="MSIE")a.style.cssText=c[d];else a.setAttribute(d,c[d]);b&&a.appendChild(this.o.createTextNode(b));return a};t.insertInto=function(a,c){var b=this.o.getElementsByTagName(a)[0];if(!b)b=document.documentElement;if(b&&b.lastChild){b.insertBefore(c,b.lastChild);return i}return q};t.whenBodyExists=function(a){function c(){document.body?a():setTimeout(c,0)}c()};
t.removeElement=function(a){if(a.parentNode){a.parentNode.removeChild(a);return i}return q};t.createCssLink=function(a){return this.createElement("link",{rel:"stylesheet",href:a})};t.appendClassName=function(a,c){for(var b=a.className.split(/\s+/),d=0,e=b.length;d<e;d++)if(b[d]==c)return;b.push(c);a.className=b.join(" ").replace(/^\s+/,"")};
t.removeClassName=function(a,c){for(var b=a.className.split(/\s+/),d=[],e=0,g=b.length;e<g;e++)b[e]!=c&&d.push(b[e]);a.className=d.join(" ").replace(/^\s+/,"").replace(/\s+$/,"")};t.hasClassName=function(a,c){for(var b=a.className.split(/\s+/),d=0,e=b.length;d<e;d++)if(b[d]==c)return i;return q};function w(a,c,b,d,e,g,k,h){this.R=a;this.Ra=c;this.Aa=b;this.za=d;this.La=e;this.Ka=g;this.ya=k;this.Va=h}t=w.prototype;t.getName=s("R");t.getVersion=s("Ra");t.getEngine=s("Aa");t.getEngineVersion=s("za");
t.getPlatform=s("La");t.getPlatformVersion=s("Ka");t.getDocumentMode=s("ya");function x(a,c){this.f=a;this.u=c}var aa=new w("Unknown","Unknown","Unknown","Unknown","Unknown","Unknown",undefined,q);
x.prototype.parse=function(){var a;if(this.f.indexOf("MSIE")!=-1){a=y(this,this.f,/(MSIE [\d\w\.]+)/,1);if(a!=""){var c=a.split(" ");a=c[0];c=c[1];a=new w(a,c,a,c,z(this),A(this),B(this,this.u),C(this,c)>=6)}else a=new w("MSIE","Unknown","MSIE","Unknown",z(this),A(this),B(this,this.u),q)}else{if(this.f.indexOf("Opera")!=-1)a:{c=a="Unknown";var b=y(this,this.f,/(Presto\/[\d\w\.]+)/,1);if(b!=""){c=b.split("/");a=c[0];c=c[1]}else{if(this.f.indexOf("Gecko")!=-1)a="Gecko";b=y(this,this.f,/rv:([^\)]+)/,
1);if(b!="")c=b}if(this.f.indexOf("Version/")!=-1){b=y(this,this.f,/Version\/([\d\.]+)/,1);if(b!=""){a=new w("Opera",b,a,c,z(this),A(this),B(this,this.u),C(this,b)>=10);break a}}b=y(this,this.f,/Opera[\/ ]([\d\.]+)/,1);a=b!=""?new w("Opera",b,a,c,z(this),A(this),B(this,this.u),C(this,b)>=10):new w("Opera","Unknown",a,c,z(this),A(this),B(this,this.u),q)}else{if(this.f.indexOf("AppleWebKit")!=-1){a=z(this);c=A(this);b=y(this,this.f,/AppleWebKit\/([\d\.]+)/,1);if(b=="")b="Unknown";var d="Unknown";
if(this.f.indexOf("Chrome")!=-1)d="Chrome";else if(this.f.indexOf("Safari")!=-1)d="Safari";else if(this.f.indexOf("AdobeAIR")!=-1)d="AdobeAIR";var e="Unknown";if(this.f.indexOf("Version/")!=-1)e=y(this,this.f,/Version\/([\d\.\w]+)/,1);else if(d=="Chrome")e=y(this,this.f,/Chrome\/([\d\.]+)/,1);else if(d=="AdobeAIR")e=y(this,this.f,/AdobeAIR\/([\d\.]+)/,1);var g=q;if(d=="AdobeAIR"){g=y(this,e,/\d+\.(\d+)/,1);g=C(this,e)>2||C(this,e)==2&&parseInt(g,10)>=5}else{g=y(this,b,/\d+\.(\d+)/,1);g=C(this,b)>=
526||C(this,b)>=525&&parseInt(g,10)>=13}a=new w(d,e,"AppleWebKit",b,a,c,B(this,this.u),g)}else{if(this.f.indexOf("Gecko")!=-1){c=a="Unknown";d=q;if(this.f.indexOf("Firefox")!=-1){a="Firefox";b=y(this,this.f,/Firefox\/([\d\w\.]+)/,1);if(b!=""){d=y(this,b,/\d+\.(\d+)/,1);c=b;d=b!=""&&C(this,b)>=3&&parseInt(d,10)>=5}}else if(this.f.indexOf("Mozilla")!=-1)a="Mozilla";b=y(this,this.f,/rv:([^\)]+)/,1);if(b=="")b="Unknown";else if(!d){d=C(this,b);e=parseInt(y(this,b,/\d+\.(\d+)/,1),10);g=parseInt(y(this,
b,/\d+\.\d+\.(\d+)/,1),10);d=d>1||d==1&&e>9||d==1&&e==9&&g>=2||b.match(/1\.9\.1b[123]/)!=o||b.match(/1\.9\.1\.[\d\.]+/)!=o}a=new w(a,c,"Gecko",b,z(this),A(this),B(this,this.u),d)}else a=aa;a=a}a=a}a=a}return a};function z(a){var c=y(a,a.f,/(iPod|iPad|iPhone|Android)/,1);if(c!="")return c;a=y(a,a.f,/(Linux|Mac_PowerPC|Macintosh|Windows)/,1);if(a!=""){if(a=="Mac_PowerPC")a="Macintosh";return a}return"Unknown"}
function A(a){var c=y(a,a.f,/(OS X|Windows NT|Android) ([^;)]+)/,2);if(c)return c;if(c=y(a,a.f,/(iPhone )?OS ([\d_]+)/,2))return c;if(a=y(a,a.f,/Linux ([i\d]+)/,1))return a;return"Unknown"}function C(a,c){var b=y(a,c,/(\d+)/,1);if(b!="")return parseInt(b,10);return-1}function y(a,c,b,d){if((a=c.match(b))&&a[d])return a[d];return""}function B(a,c){if(c.documentMode)return c.documentMode}function ba(a,c,b,d){this.c=a;this.k=c;this.U=b;this.n=d||"wf";this.l=new D("-")}
function E(a){a.c.removeClassName(a.k,a.l.j(a.n,"loading"));a.c.hasClassName(a.k,a.l.j(a.n,"active"))||a.c.appendClassName(a.k,a.l.j(a.n,"inactive"));F(a,"inactive")}function F(a,c,b,d){a.U[c]&&a.U[c](b,d)}function G(a,c,b,d,e){this.c=a;this.B=c;this.D=b;this.s=d;this.N=e;this.X=0;this.sa=this.fa=q}
G.prototype.watch=function(a,c,b,d){for(var e=a.length,g=0;g<e;g++){var k=a[g];c[k]||(c[k]=["n4"]);this.X+=c[k].length}if(d)this.fa=d;for(g=0;g<e;g++){k=a[g];d=c[k];for(var h=b[k],f=0,l=d.length;f<l;f++){var n=d[f],p=this.B,j=k,m=n;p.c.appendClassName(p.k,p.l.j(p.n,j,m,"loading"));F(p,"fontloading",j,m);p=u(this,this.Ba);j=u(this,this.Ca);new H(p,j,this.c,this.D,this.s,this.N,k,n,h)}}};
G.prototype.Ba=function(a,c){var b=this.B;b.c.removeClassName(b.k,b.l.j(b.n,a,c,"loading"));b.c.removeClassName(b.k,b.l.j(b.n,a,c,"inactive"));b.c.appendClassName(b.k,b.l.j(b.n,a,c,"active"));F(b,"fontactive",a,c);this.sa=i;I(this)};G.prototype.Ca=function(a,c){var b=this.B;b.c.removeClassName(b.k,b.l.j(b.n,a,c,"loading"));b.c.hasClassName(b.k,b.l.j(b.n,a,c,"active"))||b.c.appendClassName(b.k,b.l.j(b.n,a,c,"inactive"));F(b,"fontinactive",a,c);I(this)};
function I(a){if(--a.X==0&&a.fa)if(a.sa){a=a.B;a.c.removeClassName(a.k,a.l.j(a.n,"loading"));a.c.removeClassName(a.k,a.l.j(a.n,"inactive"));a.c.appendClassName(a.k,a.l.j(a.n,"active"));F(a,"active")}else E(a.B)}
function H(a,c,b,d,e,g,k,h,f){this.ua=a;this.Fa=c;this.c=b;this.D=d;this.s=e;this.N=g;this.Ja=new ca;this.Ea=new da;this.aa=k;this.$=h;this.Da=f||"BESs";this.ha=ea(this,"arial,'URW Gothic L',sans-serif");this.ia=ea(this,"Georgia,'Century Schoolbook L',serif");this.da=this.ha;this.ea=this.ia;this.na=J(this,"arial,'URW Gothic L',sans-serif");this.oa=J(this,"Georgia,'Century Schoolbook L',serif");this.Pa=g();this.V()}
H.prototype.V=function(){var a=this.D.O(this.na),c=this.D.O(this.oa);if((this.ha!=a||this.ia!=c)&&this.da==a&&this.ea==c)fa(this,this.ua);else if(this.N()-this.Pa>=5E3)fa(this,this.Fa);else{this.da=a;this.ea=c;ga(this)}};function ga(a){a.s(function(c,b){return function(){b.call(c)}}(a,a.V),25)}function fa(a,c){a.c.removeElement(a.na);a.c.removeElement(a.oa);c(a.aa,a.$)}function ea(a,c){var b=J(a,c,i),d=a.D.O(b);a.c.removeElement(b);return d}
function J(a,c,b){var d=a.Ea.expand(a.$);c=a.c.createElement("span",{style:"position:absolute;top:-999px;left:-999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;font-family:"+(b?"":a.Ja.quote(a.aa)+",")+c+";"+d},a.Da);a.c.insertInto("body",c);return c}function D(a){this.Ha=a||"-"}D.prototype.j=function(){for(var a=[],c=0;c<arguments.length;c++)a.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return a.join(this.Ha)};
function ca(){this.ma="'"}ca.prototype.quote=function(a){var c=[];a=a.split(/,\s*/);for(var b=0;b<a.length;b++){var d=a[b].replace(/['"]/g,"");d.indexOf(" ")==-1?c.push(d):c.push(this.ma+d+this.ma)}return c.join(",")};function da(){this.ka=ha;this.F=ia}var ha=["font-style","font-weight"],ia={"font-style":[["n","normal"],["i","italic"],["o","oblique"]],"font-weight":[["1","100"],["2","200"],["3","300"],["4","400"],["5","500"],["6","600"],["7","700"],["8","800"],["9","900"],["4","normal"],["7","bold"]]};
function ja(a,c,b){this.Ga=a;this.Ma=c;this.F=b}ja.prototype.expand=function(a,c){for(var b=0;b<this.F.length;b++)if(c==this.F[b][0]){a[this.Ga]=this.Ma+":"+this.F[b][1];break}};da.prototype.expand=function(a){if(a.length!=2)return o;for(var c=[o,o],b=0,d=this.ka.length;b<d;b++){var e=this.ka[b];(new ja(b,e,this.F[e])).expand(c,a.substr(b,1))}return c[0]&&c[1]?c.join(";")+";":o};function K(a,c){this.o=a;this.f=c}K.prototype=v.prototype;
K.prototype.isHttps=function(){return this.o.location.protocol=="https:"};K.prototype.getHostName=function(){return this.o.location.hostname};K.prototype.loadScript=function(a,c){var b=this.o.getElementsByTagName("head")[0];if(b){var d=this.o.createElement("script");d.src=a;var e=q;d.onload=d.onreadystatechange=function(){if(!e&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){e=i;c&&c();d.onload=d.onreadystatechange=o;d.parentNode.tagName=="HEAD"&&b.removeChild(d)}};b.appendChild(d)}};
K.prototype.createStyle=function(a){var c=this.o.createElement("style");c.setAttribute("type","text/css");if(c.styleSheet)c.styleSheet.cssText=a;else c.appendChild(document.createTextNode(a));return c};function ka(a,c){this.Na=a;this.Y=c}function la(a){for(var c=a.Na.join(","),b=[],d=0;d<a.Y.length;d++){var e=a.Y[d];b.push(e.name+":"+e.value+";")}return c+"{"+b.join("")+"}"}function L(a,c,b,d){this.C=a;this.I=c;this.v=b;this.Ua=d;this.ba={};this.Z={}}
L.prototype.w=function(a){return a?(this.ba[a.getStylesheetFormatId()]||this.I).slice(0):this.I.slice(0)};L.prototype.getId=s("v");function ma(a,c,b){for(var d=[],e=a.C.split(",")[0].replace(/"|'/g,""),g=a.w(),k,h=[],f={},l=0;l<g.length;l++){k=g[l];if(k.length>0&&!f[k]){f[k]=i;h.push(k)}}b=b.la?b.la(e,h,d):h;c=c.getStylesheetFormatId();a.ba[c]=b;a.Z[c]=d}L.prototype.watch=function(a,c,b){var d=[],e={};na(this,c,d,e);a.watch(d,e,{},b)};
function na(a,c,b,d){b.push(a.C);d[a.C]=a.w(c);a=a.Z[c.getStylesheetFormatId()]||[];for(c=0;c<a.length;c++){for(var e=a[c],g=e.C,k=q,h=0;h<b.length;h++)if(b[h]==g)k=i;if(!k){b.push(g);d[g]=e.w()}}}function oa(a,c){this.C=a;this.I=c}oa.prototype.w=s("I");function N(a,c,b){this.Oa=a;this.P=c;this.pa=b}N.prototype.buildUrl=function(a,c){var b=this.Oa&&a?"https:":"http:",d=typeof this.P=="function"?this.P(b):this.P;return b+"//"+d+(this.pa=="/"?"":this.pa)+c};
function pa(a,c){var b=new Image(1,1);b.src=c;b.onload=function(){b.onload=o}}function O(a,c,b){this.v=a;this.ra=c;this.ca=b}O.prototype.getId=s("v");O.prototype.getStylesheetFormatId=s("ra");O.prototype.isUserAgent=function(a){return this.ca?this.ca(a.getName(),a.getVersion(),a.getEngine(),a.getEngineVersion(),a.getPlatform(),a.getPlatformVersion(),a.getDocumentMode()):q};O.prototype.buildCssUrl=function(a,c,b,d){b="/"+b+"-"+this.ra+".css";if(d)b+="?"+d;return c.buildUrl(a,b)};
function P(){this.t=[]}P.prototype.addBrowser=function(a){this.getBrowserById(a.getId())||this.t.push(a)};P.prototype.getBrowserById=function(a){for(var c=0;c<this.t.length;c++){var b=this.t[c];if(a===b.getId())return b}return o};P.prototype.findBrowser=function(a){for(var c=0;c<this.t.length;c++){var b=this.t[c];if(b.isUserAgent(a))return b}return o};P.prototype.addBrowsersToBrowserSet=function(a){for(var c=0;c<this.t.length;c++)a.addBrowser(this.t[c])};
function qa(a){this.v=a;this.K=new P;this.m=[];this.L=[];this.M=this.W=this.A=o}t=qa.prototype;t.getId=s("v");t.setSecurityToken=r("qa");t.setNestedUrl=r("ga");t.setFontFilterSet=r("M");t.setKitOptions=r("Q");t.addBrowser=function(a){this.K.addBrowser(a)};t.addFontFamily=function(a){this.m.push(a)};t.addCssRule=function(a){this.L.push(a)};t.supportsBrowser=function(a){return!!this.K.getBrowserById(a.getId())};t.addBrowsersToBrowserSet=function(a){this.K.addBrowsersToBrowserSet(a)};
t.init=function(a){for(var c=[],b=0;b<this.L.length;b++)c.push(la(this.L[b]));a.insertInto("head",a.createStyle(c.join("")))};
t.load=function(a,c,b,d){if(this.M)for(var e=ra(this.M,b.getStylesheetFormatId()),g=0;g<this.m.length;g++)ma(this.m[g],b,e);if(this.A&&this.W){this.A.va(new sa(b.getStylesheetFormatId()));g=new ta(a,this.G,this.m);e=ua(this.W,b.getStylesheetFormatId(),g);for(g=0;g<e.length;g++)this.A.va(e[g]);this.A.Ta(this.qa);g=this.A.buildUrl(a.isHttps(),this.ga)}else g=b.buildCssUrl(a.isHttps(),this.ga,this.v,this.qa);a.insertInto("head",a.createCssLink(g));c&&a.whenBodyExists(function(k,h,f,l){return function(){for(var n=
0;n<k.m.length;n++)k.m[n].watch(h,f,l&&n==k.m.length-1)}}(this,c,b,d))};t.collectFontFamilies=function(a,c,b){for(var d=0;d<this.m.length;d++)na(this.m[d],a,c,b)};t.performOptionalActions=function(a,c,b){this.Q&&b.whenBodyExists(function(d,e,g,k){return function(){var h=d.Q;h.ja&&pa(h,h.ja.buildUrl(k.isHttps()));var f=d.Q;h=d.v;if(f.T){f=f.T.j(h,g,k);f.setAttribute("id","typekit-badge-"+h);k.insertInto("body",f)}}}(this,a,c,b))};
function Q(a,c,b,d,e){this.Ia=a;this.c=c;this.f=b;this.k=d;this.s=e;this.p=[]}Q.prototype.J=function(a){this.p.push(a)};Q.prototype.load=function(a,c){var b=a,d=c||{};if(typeof b=="string")b=[b];else if(b&&b.length)b=b;else{d=b||{};b=[]}if(b.length)for(var e=this,g=b.length,k=0;k<b.length;k++)this.ta(b[k],function(){--g==0&&e.S(d)});else this.S(d)};Q.prototype.ta=function(a,c){this.c.loadScript(this.Ia.buildUrl(this.c.isHttps(),"/"+a+".js"),c)};
Q.prototype.S=function(a){if(a.userAgent)this.f=(new x(a.userAgent,document)).parse();a=new ba(this.c,this.k,a);for(var c=new P,b=0;b<this.p.length;b++)this.p[b].addBrowsersToBrowserSet(c);c=c.findBrowser(this.f);for(b=0;b<this.p.length;b++)this.p[b].init(this.c);if(c){a.c.appendClassName(a.k,a.l.j(a.n,"loading"));F(a,"loading");va(this,c,a)}else E(a);this.p=[]};
function va(a,c,b){b=new G(a.c,b,{O:function(g){return g.offsetWidth}},a.s,function(){return+new Date});for(var d=0;d<a.p.length;d++){var e=a.p[d];if(e.supportsBrowser(c)){e.load(a.c,b,c,d==a.p.length-1);e.performOptionalActions(window,a.f,a.c)}}}function R(a,c,b){this.z=a;this.c=c;this.s=b;this.p=[]}R.prototype.J=function(a){this.p.push(a)};
R.prototype.load=function(){var a=this.z.__webfonttypekitmodule__;if(a)for(var c=0;c<this.p.length;c++){var b=this.p[c],d=a[b.getId()];if(d){var e=this.c,g=this.s;d(function(k,h,f){var l=new P;b.addBrowsersToBrowserSet(l);h=[];var n={};if(l=l.findBrowser(k)){b.init(e);b.load(e,o,l,g);b.collectFontFamilies(l,h,n);b.performOptionalActions(window,k,e,g)}f(!!l,h,n)})}}};function S(a,c){this.R=a;this.la=c}S.prototype.getName=s("R");
function T(a,c){for(var b=0;b<a.H.length;b++){var d=a.H[b];if(c===d.getName())return d}return o}function ra(a,c){var b=a.q[c];return b?T(a,b):o}function ua(a,c,b){var d=[];a=a.r[c]||[];for(c=0;c<a.length;c++){var e;a:switch(a[c]){case "observeddomain":e=new wa(b.c);break a;case "fontmask":e=new xa(b.G,b.m);break a;default:e=o}e&&d.push(e)}return d}function ta(a,c,b){this.c=a;this.G=c;this.m=b}function sa(a){this.Qa=a}sa.prototype.toString=s("Qa");function wa(a){this.c=a}
wa.prototype.toString=function(){var a;a=this.c.getHostName?this.c.getHostName():document.location.hostname;return encodeURIComponent(a)};function xa(a,c){this.G=a;this.m=c}xa.prototype.toString=function(){for(var a=[],c=0;c<this.m.length;c++){var b=this.m[c],d=b.w();b=b.w(this.G);for(var e=0;e<d.length;e++){var g;a:{for(g=0;g<b.length;g++)if(d[e]===b[g]){g=i;break a}g=q}a.push(g?1:0)}}a=a.join("");a=a.replace(/^0+/,"");c=[];for(d=a.length;d>0;d-=4){b=a.slice(d-4<0?0:d-4,d);c.unshift(parseInt(b,2).toString(16))}return c.join("")};
function ya(a,c,b,d){this.z=a;this.o=c;this.wa=b;this.xa=d}
ya.prototype.j=function(a,c,b){var d=this.o.createElement("img");d.setAttribute("width",62);d.setAttribute("height",25);d.setAttribute("src",this.wa.buildUrl(b.isHttps(),"/default.gif"));d.setAttribute("class","typekit-badge");d.setAttribute("alt","Fonts by Typekit");d.setAttribute("title","Information about the fonts used on this site");d.style.position="fixed";d.style.zIndex=2E9;d.style.right=0;d.style.bottom=0;d.style.cursor="pointer";d.style.border=0;if(c.getName()!="Opera")d.style.content="none";
d.style.display="inline";d.style["float"]="none";d.style.height="25px";d.style.left="auto";d.style.margin=0;d.style.maxHeight="25px";d.style.maxWidth="62px";d.style.minHeight="25px";d.style.minWidth="62px";d.style.orphans=2;d.style.outline="none";d.style.overflow="visible";d.style.padding=0;d.style.pageBreakAfter="auto";d.style.pageBreakBefore="auto";d.style.pageBreakInside="auto";d.style.tableLayout="auto";d.style.textIndent=0;d.style.top="auto";d.style.unicodeBidi="normal";d.style.verticalAlign=
"baseline";d.style.visibility="visible";d.style.widows=2;d.style.width="65px";var e=this.o,g=this.xa.buildUrl(q,"/"+a);U(this,d,"click",function(){e.location.href=g});if(c.getName()=="MSIE"){d.style.position="absolute";var k=this;a=function(){var h=za(k,"scrollLeft","scrollTop"),f=za(k,"clientWidth","clientHeight");d.style.bottom="auto";d.style.right="auto";d.style.top=h[1]+f[1]-25+"px";d.style.left=h[0]+f[0]-3-62+"px"};U(this,this.z,"scroll",a);U(this,this.z,"resize",a)}c=c.getPlatform();if(c=="iPhone"||
c=="iPod"||c=="iPad"||c=="Android")d.style.display="none";return d};function za(a,c,b){var d=0,e=0;a=a.o;if(a.documentElement&&(a.documentElement[c]||a.documentElement[b])){d=a.documentElement[c];e=a.documentElement[b]}else if(a.body&&(a.body[c]||a.body[b])){d=a.body[c];e=a.body[b]}return[d,e]}function U(a,c,b,d){if(c.attachEvent){var e=a.z;c["e"+b+d]=d;c[b+d]=function(){c["e"+b+d](e.event)};c.attachEvent("on"+b,c[b+d])}else c.addEventListener(b,d,q)}var V=new P;
V.addBrowser(new O("safari-osx","b",function(a,c,b,d,e,g,k){var h=q;h=h||function(f,l,n,p,j,m){f=/^([0-9]+)(_|.)([0-9]+)/.exec(m);if(j=="Macintosh"&&f){j=parseInt(f[1],10);m=parseInt(f[3],10);return j>10||j==10&&m>=4}else return j=="Macintosh"&&m=="Unknown"?i:q}(a,c,b,d,e,g,k);if(!h)return q;return function(f,l,n,p,j){if(f=="Safari"&&n=="AppleWebKit"||f=="Unknown"&&n=="AppleWebKit"&&(j=="iPhone"||j=="iPad"))if(f=/([0-9]+.[0-9]+)/.exec(p))return parseFloat(f[1])>=525.13;return q}(a,c,b,d,e,g,k)}));
V.addBrowser(new O("safari-android-ipad-iphone-win2003-win7plus-winvista-winxp","a",function(a,c,b,d,e,g,k){var h=q;h=(h=(h=(h=(h=(h=(h=h||(e=="Windows"&&g=="5.1"?i:q))||(e=="Windows"&&g=="5.2"?i:q))||(e=="Windows"&&g=="6.0"?i:q))||function(f,l,n,p,j,m){f=/^([0-9]+).([0-9]+)/.exec(m);if(j=="Windows"&&f){j=parseInt(f[1],10);f=parseInt(f[2],10);return j>6||j==6&&f>=1}else return q}(a,c,b,d,e,g,k))||function(f,l,n,p,j,m){f=/([0-9]+).([0-9]+)/.exec(m);if(j=="Android"&&f){j=parseInt(f[1]);f=parseInt(f[2]);
return j>2||j==2&&f>=2}else return q}(a,c,b,d,e,g,k))||function(f,l,n,p,j,m){if(j=="iPad")if(l=/^([0-9]+)_([0-9]+)/.exec(m)){f=parseInt(l[1],10);l=parseInt(l[2],10);return f>4||f==4&&l>=2}else return q;else return q}(a,c,b,d,e,g,k))||function(f,l,n,p,j,m){if(j=="iPhone"||j=="iPod")if(l=/^([0-9]+)_([0-9]+)/.exec(m)){f=parseInt(l[1],10);l=parseInt(l[2],10);return f>4||f==4&&l>=2}else return q;else return q}(a,c,b,d,e,g,k);if(!h)return q;return function(f,l,n,p,j){if(f=="Safari"&&n=="AppleWebKit"||f==
"Unknown"&&n=="AppleWebKit"&&(j=="iPhone"||j=="iPad"))if(f=/([0-9]+.[0-9]+)/.exec(p))return parseFloat(f[1])>=525.13;return q}(a,c,b,d,e,g,k)}));
V.addBrowser(new O("air-linux-osx-win","a",function(a,c,b,d,e,g,k){var h=q;h=(h=(h=h||function(f,l,n,p,j,m){f=/^([0-9]+)(_|.)([0-9]+)/.exec(m);if(j=="Macintosh"&&f){j=parseInt(f[1],10);m=parseInt(f[3],10);return j>10||j==10&&m>=4}else return j=="Macintosh"&&m=="Unknown"?i:q}(a,c,b,d,e,g,k))||(e=="Ubuntu"||e=="Linux"?i:q))||(e=="Windows"&&g=="Unknown"?i:q);if(!h)return q;return function(f,l){if(f=="AdobeAIR"){var n=/([0-9]+.[0-9]+)/.exec(l);if(n)return parseFloat(n[1])>=2.5}return q}(a,c,b,d,e,g,k)}));
V.addBrowser(new O("ie6to8-win2003-win7plus-winvista-winxp","i",function(a,c,b,d,e,g,k){var h=q;h=(h=(h=(h=h||(e=="Windows"&&g=="5.1"?i:q))||(e=="Windows"&&g=="5.2"?i:q))||(e=="Windows"&&g=="6.0"?i:q))||function(f,l,n,p,j,m){f=/^([0-9]+).([0-9]+)/.exec(m);if(j=="Windows"&&f){j=parseInt(f[1],10);f=parseInt(f[2],10);return j>6||j==6&&f>=1}else return q}(a,c,b,d,e,g,k);if(!h)return q;return function(f,l,n,p,j,m,M){if(f=="MSIE"){if(f=/([0-9]+.[0-9]+)/.exec(l))return parseFloat(f[1])>=6&&(M===undefined||
M<9);return q}}(a,c,b,d,e,g,k)}));V.addBrowser(new O("ff35-osx","b",function(a,c,b,d,e,g,k){var h=q;h=h||function(f,l,n,p,j,m){f=/^([0-9]+)(_|.)([0-9]+)/.exec(m);if(j=="Macintosh"&&f){j=parseInt(f[1],10);m=parseInt(f[3],10);return j>10||j==10&&m>=4}else return j=="Macintosh"&&m=="Unknown"?i:q}(a,c,b,d,e,g,k);if(!h)return q;return function(f,l,n,p){if(n=="Gecko"){f=/1.9.1b[1-3]{1}/;return/1.9.1/.test(p)&&!f.test(p)}return q}(a,c,b,d,e,g,k)}));
V.addBrowser(new O("opera-osx","b",function(a,c,b,d,e,g,k){var h=q;h=h||function(f,l,n,p,j,m){f=/^([0-9]+)(_|.)([0-9]+)/.exec(m);if(j=="Macintosh"&&f){j=parseInt(f[1],10);m=parseInt(f[3],10);return j>10||j==10&&m>=4}else return j=="Macintosh"&&m=="Unknown"?i:q}(a,c,b,d,e,g,k);if(!h)return q;a=a=="Opera"?parseFloat(c)>=10.54:q;return a}));
V.addBrowser(new O("ff35-linux-win2003-win7plus-winvista-winxp","a",function(a,c,b,d,e,g,k){var h=q;h=(h=(h=(h=(h=h||(e=="Windows"&&g=="5.1"?i:q))||(e=="Windows"&&g=="5.2"?i:q))||(e=="Windows"&&g=="6.0"?i:q))||function(f,l,n,p,j,m){f=/^([0-9]+).([0-9]+)/.exec(m);if(j=="Windows"&&f){j=parseInt(f[1],10);f=parseInt(f[2],10);return j>6||j==6&&f>=1}else return q}(a,c,b,d,e,g,k))||(e=="Ubuntu"||e=="Linux"?i:q);if(!h)return q;return function(f,l,n,p){if(n=="Gecko"){f=/1.9.1b[1-3]{1}/;return/1.9.1/.test(p)&&
!f.test(p)}return q}(a,c,b,d,e,g,k)}));
V.addBrowser(new O("ff36plus-linux-osx-win2003-win7plus-winvista-winxp","d",function(a,c,b,d,e,g,k){var h=q;h=(h=(h=(h=(h=(h=h||(e=="Windows"&&g=="5.1"?i:q))||(e=="Windows"&&g=="5.2"?i:q))||(e=="Windows"&&g=="6.0"?i:q))||function(f,l,n,p,j,m){f=/^([0-9]+).([0-9]+)/.exec(m);if(j=="Windows"&&f){j=parseInt(f[1],10);f=parseInt(f[2],10);return j>6||j==6&&f>=1}else return q}(a,c,b,d,e,g,k))||function(f,l,n,p,j,m){f=/^([0-9]+)(_|.)([0-9]+)/.exec(m);if(j=="Macintosh"&&f){j=parseInt(f[1],10);m=parseInt(f[3],
10);return j>10||j==10&&m>=4}else return j=="Macintosh"&&m=="Unknown"?i:q}(a,c,b,d,e,g,k))||(e=="Ubuntu"||e=="Linux"?i:q);if(!h)return q;return function(f,l,n,p){if(n=="Gecko")if(l=/([0-9]+.[0-9]+)(.([0-9]+)|)/.exec(p)){f=parseFloat(l[1]);l=parseInt(l[3],10);return f>1.9||f>=1.9&&l>1}return q}(a,c,b,d,e,g,k)}));
V.addBrowser(new O("chrome6plus-linux-osx-win2003-win7plus-winvista-winxp","d",function(a,c,b,d,e,g,k){var h=q;h=(h=(h=(h=(h=(h=h||(e=="Windows"&&g=="5.1"?i:q))||(e=="Windows"&&g=="5.2"?i:q))||(e=="Windows"&&g=="6.0"?i:q))||function(f,l,n,p,j,m){f=/^([0-9]+).([0-9]+)/.exec(m);if(j=="Windows"&&f){j=parseInt(f[1],10);f=parseInt(f[2],10);return j>6||j==6&&f>=1}else return q}(a,c,b,d,e,g,k))||function(f,l,n,p,j,m){f=/^([0-9]+)(_|.)([0-9]+)/.exec(m);if(j=="Macintosh"&&f){j=parseInt(f[1],10);m=parseInt(f[3],
10);return j>10||j==10&&m>=4}else return j=="Macintosh"&&m=="Unknown"?i:q}(a,c,b,d,e,g,k))||(e=="Ubuntu"||e=="Linux"?i:q);if(!h)return q;return function(f,l){if(f=="Chrome"){var n=/([0-9]+.[0-9]+).([0-9]+).([0-9]+)/.exec(l);if(n)if(parseFloat(n[1])>=6)return i}}(a,c,b,d,e,g,k)}));
V.addBrowser(new O("ie9plus-win7plus-winvista","d",function(a,c,b,d,e,g,k){var h=q;h=(h=h||function(l,n,p,j,m,M){l=/^([0-9]+).([0-9]+)/.exec(M);if(m=="Windows"&&l){m=parseInt(l[1],10);l=parseInt(l[2],10);return m>6||m==6&&l>=1}else return q}(a,c,b,d,e,g,k))||(e=="Windows"&&g=="6.0"?i:q);if(!h)return q;var f;if(a=="MSIE")f=k>=9;return f}));
V.addBrowser(new O("opera-linux-win2003-win7plus-winvista-winxp","a",function(a,c,b,d,e,g,k){var h=q;h=(h=(h=(h=(h=h||(e=="Windows"&&g=="5.1"?i:q))||(e=="Windows"&&g=="5.2"?i:q))||(e=="Windows"&&g=="6.0"?i:q))||function(f,l,n,p,j,m){f=/^([0-9]+).([0-9]+)/.exec(m);if(j=="Windows"&&f){j=parseInt(f[1],10);f=parseInt(f[2],10);return j>6||j==6&&f>=1}else return q}(a,c,b,d,e,g,k))||(e=="Ubuntu"||e=="Linux"?i:q);if(!h)return q;a=a=="Opera"?parseFloat(c)>=10.54:q;return a}));
V.addBrowser(new O("chrome4to5-linux-osx-win2003-win7plus-winvista-winxp","a",function(a,c,b,d,e,g,k){var h=q;h=(h=(h=(h=(h=(h=h||(e=="Windows"&&g=="5.1"?i:q))||(e=="Windows"&&g=="5.2"?i:q))||(e=="Windows"&&g=="6.0"?i:q))||function(f,l,n,p,j,m){f=/^([0-9]+).([0-9]+)/.exec(m);if(j=="Windows"&&f){j=parseInt(f[1],10);f=parseInt(f[2],10);return j>6||j==6&&f>=1}else return q}(a,c,b,d,e,g,k))||function(f,l,n,p,j,m){f=/^([0-9]+)(_|.)([0-9]+)/.exec(m);if(j=="Macintosh"&&f){j=parseInt(f[1],10);m=parseInt(f[3],
10);return j>10||j==10&&m>=4}else return j=="Macintosh"&&m=="Unknown"?i:q}(a,c,b,d,e,g,k))||(e=="Ubuntu"||e=="Linux"?i:q);if(!h)return q;return function(f,l){if(f=="Chrome"){var n=/([0-9]+.[0-9]+).([0-9]+).([0-9]+)/.exec(l);if(n){var p=parseFloat(n[1]),j=parseInt(n[2],10);n=parseInt(n[3],10);if(p>=6)return q;else if(p>4)return i;else if(p==4&&j>249)return i;else if(p==4&&j==249&&n>=4)return i}}return q}(a,c,b,d,e,g,k)}));var W=new function(){this.H=[];this.q={}},Aa=new S("AllFonts",function(a,c){return c});
T(W,Aa.getName())||W.H.push(Aa);
var Ba=new S("DefaultFourFontsWithSingleFvdFamilies",function(a,c,b){for(var d=0;d<c.length;d++){var e=c[d],g=a.replace(/(-1|-2)$/,"").slice(0,28)+"-"+e;b.push(new oa(g,[e]))}a={};for(e=0;e<c.length;e++){b=c[e];d=b.charAt(1);(a[d]||(a[d]=[])).push(b)}b=[[4,3,2,1,5,6,7,8,9],[7,8,9,6,5,4,3,2,1]];d=[];for(e=0;e<b.length;e++){g=b[e];for(var k=0;k<g.length;k++){var h=g[k];if(a[h]){d=d.concat(a[h]);break}}}b=d;d={};a=[];for(e=0;e<b.length;e++){g=b[e];if(!d[g]){d[g]=i;a.push(g)}}b=[];for(d=0;d<c.length;d++){e=
c[d];for(g=0;g<a.length;g++){k=a[g];k==e&&b.push(k)}}return b});T(W,Ba.getName())||W.H.push(Ba);W.q.a="AllFonts";W.q.b="AllFonts";W.q.d="AllFonts";W.q.e="AllFonts";W.q.g="AllFonts";W.q.h="AllFonts";W.q.i="DefaultFourFontsWithSingleFvdFamilies";var X=new function(){this.r={}};X.r.a=[];X.r.b=[];X.r.d=[];X.r.e=[];X.r.g=["observeddomain"];X.r.h=["observeddomain"];X.r.i=["observeddomain","fontmask"];
if(!window.Typekit){var Ca=new N(q,"use.typekit.com","/"),Da=(new x(navigator.userAgent,document)).parse(),Ea=new K(document,Da),Fa=function(a,c){setTimeout(a,c)},Y=new Q(Ca,Ea,Da,document.documentElement,Fa),Z=new R(window,Ea,Fa);window.Typekit=Y;window.Typekit.load=Y.load;window.Typekit.addKit=Y.J}var Ga,Ha=o,Ia=o,Ja=o,Ka,$;Ga=new N(q,"use.typekit.com","/k");Ha=new N(q,"use.typekit.com","/badges");Ia=new N(q,"typekit.com","/colophons");Ja=new ya(window,document,Ha,Ia);
Ka=new function(a,c,b){this.T=a;this.Sa=o;this.ja=b}(Ja,o,o);$=new qa("iwa7uay");$.setSecurityToken("3bb2a6e53c9684ffdc9a9aff1d5b2a62de246c40fc2071e052ac61b666d1eab4dd2cc77d682c4332dcd00a8bc9db4b34b50b5928fbfc9d1c6ead5a0feac1ba3fa09d420ff1d22507844e652413099de5c6b8ca7e8161d5ec64dbf2144253359516");$.setNestedUrl(Ga);$.setKitOptions(Ka);$.addFontFamily(new L("legitima",["n5"]));$.addFontFamily(new L("gesta",["n4","n7"]));$.addCssRule(new ka([".tk-legitima"],[{value:"legitima,serif",name:"font-family"}]));
$.addCssRule(new ka([".tk-gesta"],[{value:"gesta,sans-serif",name:"font-family"}]));$.addBrowser(V.getBrowserById("air-linux-osx-win"));$.addBrowser(V.getBrowserById("chrome4to5-linux-osx-win2003-win7plus-winvista-winxp"));$.addBrowser(V.getBrowserById("chrome6plus-linux-osx-win2003-win7plus-winvista-winxp"));$.addBrowser(V.getBrowserById("ff35-linux-win2003-win7plus-winvista-winxp"));$.addBrowser(V.getBrowserById("ff35-osx"));$.addBrowser(V.getBrowserById("ff36plus-linux-osx-win2003-win7plus-winvista-winxp"));
$.addBrowser(V.getBrowserById("ie6to8-win2003-win7plus-winvista-winxp"));$.addBrowser(V.getBrowserById("ie9plus-win7plus-winvista"));$.addBrowser(V.getBrowserById("opera-linux-win2003-win7plus-winvista-winxp"));$.addBrowser(V.getBrowserById("opera-osx"));$.addBrowser(V.getBrowserById("safari-android-ipad-iphone-win2003-win7plus-winvista-winxp"));$.addBrowser(V.getBrowserById("safari-osx"));$.setFontFilterSet(W);if(Z&&Z.z.__webfonttypekitmodule__){Z.J($);Z.load()}else window.Typekit.addKit($);
})(this,document);