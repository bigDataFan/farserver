math = ['abs','acos','asin','atan','atan2','ceil','cos','exp','floor','log','max','min','pow','random','round','sin','sqrt','tan'];
for (f in math)
    eval('var ' + math[f] + " = Math." + math[f]);
var pi = Math.PI;
var e = Math.E;
var ln = log;

 
var funRegex = /^ *([a-zA-Z$_][a-zA-Z0-9$_]*) *\( *([a-zA-Z$_][a-zA-Z0-9$_]*) *\) *= *(.+)/;

function isFunction(what) {
    return what.match(funRegex);
}

function handleFunction(what) {
    return what.replace(funRegex, "$1 = function($2) { return $3 }");
}

var current = 0;
    
function compute(expr) {
   var hex = expr.match(/in hex$/);
   if (hex)
       expr = expr.replace(/in hex$/, '');
   var oct = expr.match(/in oct$/);
   if (oct)
       expr = expr.replace(/in oct$/, '');

   //echo(expr);
   
   var expr = expr.replace(/(\d)deg([^a-zA-Z0-9$_]|$)/, '$1 * (2 * pi / 360)$2');
   var actualExpr = handleFunction(expr);
   try {
       currentVar = "r" + current;
       var result = eval(currentVar + "=" + actualExpr);

       if (abs(result) < 2.5e-16) {
           result = 0;
       }
   } catch(err) {
	   
   }

   if (isFunction(expr))
       insert(current, expr);
   else {
       if (hex)
           result = "0x" + result.toString(16);
       if (oct)
           result = "0" + result.toString(8);

           insert(current, expr, result);
   }
   ++current;
}

var model;

function insert(a, b, c) {
	var array = session.get("cal");
	if (array==null) {
		array = new Array();
	}
	
	array.push(b + " = " + c);
	session.set("cal", array);
	
	model = array;
}


compute(params.expr);
model;