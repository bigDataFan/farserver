String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

$(function() {

    var current = 1;
    var hist = [];
    var histpos = 0;

    function load() {
        hist = JSON.parse(localStorage.hist);
    }

    function save() {
        localStorage.hist = JSON.stringify(hist);
        localStorage.histpos = histpos;
        localStorage.current = current;
    }

    function clear() {
        current = 1;
        hist = [];
        histpos = 0;
        $("#out-inner").html('');

        localStorage.clear();
    }

    math = ['abs','acos','asin','atan','atan2','ceil','cos','exp','floor','log','max','min','pow','random','round','sin','sqrt','tan'];
    for (f in math)
        eval('var ' + math[f] + " = Math." + math[f]);

    var pi = Math.PI;
    var e = Math.E;
    var ln = log;

    if (localStorage.hist != undefined) {
        load();
        for (var i = 0; i < hist.length; ++i) {
            got(hist[i]);
        }
    }

    function htmlify(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function scrollToEnd() {
        $("#out-scroll").scrollTop($("#out-inner").height());
    }

    function echo(msg) {
        $("#out-inner").append(
            "<span class='echo'>" + htmlify(msg.toString()) + "</span><br>");
        scrollToEnd();
    }

    function message(msg) {
        $("#out-inner").append((msg.toString()) + "<br>");
        scrollToEnd();
    }

    function beautify(s) {
        s = s.replace(/(\W|^)pi(\W|$)/g, '$1π$2').replace(/\*/g, '×').replace(/-/g, '−');
       
        return s;
    }

    // Handle a lineful.
    function got(line) {
        line = line.trim();
        if (line === 'quit' || line == 'q') {
            echo('quit');
            message('Good night<span class="f">, milady</span><span class="m">, sir</span>. It has been a pleasure.');
            setTimeout(function() {
                window.open('', '_self', '');
                window.close();
            }, 1300);
        } else if (line == 'help' || line == 'h' || line == '?') {
            echo('help');
            message("输入数学表达式. 例如: <b>1 * 2 + 3 / 4</b>");
            message("支持的运算包括: <b>+ − * / %</b>");
            message("支持以下位操作符: <b>& | ^ ~ << >> >>></b>");
            message("可以定义变量 例如: <b>a = 1 + 2 * 3</b>");
            message("还可以定义函数 例如: <b>f(x) = pow(x, 2)</b>");
            message("而且，以下的数学函数可以直接调用: <b>" + math.join(" ") + "</b>");
            message("三角函数中，要使用角度，使用deg。 例如: <b>sin(45deg)</b>");
            message("另外这2个常量可以直接使用： <b>pi</b> and <b>e</b>.");
            //message("You can input hexadecimal values (<b>0x1234abcd</b>) and octal values (<b>0755</b>).");
            //message("To convert numbers to hex or oct, try: <b>100 in hex</b> or <b>0x1ff in oct</b>");
            message("要清屏，请使用: <b>clear</b>");
            message("最后，想说点什么，输入 ：say 这个应用不错");
            message('');
            //message("That is all I know. Now, what else could one ask for?");
        } else if (line == 'clear') {
            clear();
        } else if (line.match(/^ *$/)) {
            //message("Shall I calculate something for you<span class='f'>, milady</span><span class='m'>, sir</span>?");
        } else {
            compute(line);
        }

        save();
    }

    var funRegex = /^ *([a-zA-Z$_][a-zA-Z0-9$_]*) *\( *([a-zA-Z$_][a-zA-Z0-9$_]*) *\) *= *(.+)/;

    function isFunction(what) {
        return what.match(funRegex);
    }

    function handleFunction(what) {
        return what.replace(funRegex, "$1 = function($2) { return $3 }");
    }

    function insert(resultIndex, formula, result) {
        var nice = htmlify(beautify(formula));
        var resultOrNothing = result != undefined ? " = <span class='result final'>" + result + "</span>" : "";
        $("#out-inner").append(
            "<div class='left'>r" + resultIndex + " = </div><div class='result'><span class='expr'>" + nice + "</span>"
            + resultOrNothing + "</div>");

        scrollToEnd();
    }
    
    function compute(expr) {
    	 if (expr.indexOf("say")==0) {
     		echo("你说 " + expr.substring(3));
     		++current;
     		return;
     	}

        var hex = expr.match(/in hex$/);
        if (hex)
            expr = expr.replace(/in hex$/, '');
        var oct = expr.match(/in oct$/);
        if (oct)
            expr = expr.replace(/in oct$/, '');

        echo(expr);
        var expr = expr.replace(/(\d)deg([^a-zA-Z0-9$_]|$)/, '$1 * (2 * pi / 360)$2');
        var actualExpr = handleFunction(expr);
        try {
            currentVar = "r" + current;
            var result = eval(currentVar + "=" + actualExpr);

            if (abs(result) < 2.5e-16) {
                result = 0;
            }
        } catch(err) {
            message(err + ". (Terribly sorry<span class='f'>, milady</span><span class='m'>, sir</span>.)");
            return;
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

    $('#in input').keydown(function(e) {
        var it = $(this);
        var code = e.keyCode ? e.keyCode : e.which;
        var what = it.attr('value');

        if (code == 13) {
            it.attr('value', '');
            histpos = hist.push(what);
            got(what);
        } else if (code == 38) {
            if (histpos > 0)
                --histpos;
            it.attr('value', hist[histpos]);
        } else if (code == 40) {
            if (histpos < hist.length - 1)
                ++histpos;
            it.attr('value', hist[histpos]);
        } else if (code == 9) {
        } else {
            return true;
        }
        
        return false;
    });

    function focus() {
        $('input').focus();
    }

    function onResize() {
        var viewportHeight = $(window).height();
        var quantized = Math.floor(viewportHeight / 20) * 20;
        $('#out-scroll').css('max-height', quantized - 100 + "px");
        scrollToEnd();
    }
    $(window).resize(onResize);
    onResize();

    focus();

    message("您好，这是一个来自10k的计算器小应用。作者是 Antti Sykäri<span class='f'>, milady</span><span class='m'>, esteemed sir</span>. ");
    message("输入 ‘help’ 获取帮助");
});
