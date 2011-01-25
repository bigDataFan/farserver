<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>表达式计算器</title>
<style type="text/css">
	body,form{font-family:Arial,Helvetica,sans-serif;padding:0;margin:0;}
	img{border:none}
	a,a:visited{color:#00e;text-decoration:none;}
	a:hover{text-decoration:underline;color:#f00}
	.b,.j,.c{border-bottom:1px #6dba2b solid}
	.c{background:#fcfef9 repeat-x left bottom;}
	.e,.j{padding:5px 0}
	.e a,.j a,#j4{margin-left:5px}
	.d,.f,.c{padding-left:5px;}
	.f{background-color:#f2fae7;border-bottom:1px #aee283 solid}
	.g,.h{text-align:center;}
	.h{height:7px;background-color:#ddf2c1}
	.i{padding:5px 0 20px 5px}
	.i .gr{color:#666;}
	table{width:100%;line-height:1em;}
	.f img{width:13px;height:13px}
	.h img{width:9px;height:13px}
</style>

</head>
<body>

<div class="f">表达式计算器</div>
<div class="j">
<ul>
	<#list model as result>
		<li>${result}</li>
	</#list>
</ul>

<form method="POST" action="cal.gs">
<input type="text" value="" name="expr"> <input type="submit" value="计算">
<a href="clear.gs">清除结果</a>
</form>
</div>


<div class="f">帮助</div>
<div class="j">
<ul>

	<li>输入数学表达式. 例如: <b>1 * 2 + 3 / 4</b> </li>
	<li>支持的运算包括: <b>+ − * / %</b></li>
	<li>支持以下位操作符: <b>& | ^ ~ << >> >>></b>
	<li>数学函数:abs acos asin atan atan2 ceil cos exp floor log max min pow random round sin sqrt tan</li>
	<li>角度用deg表示。 例如: sin(45deg)</li> 
	<li>另外这2个常量可以直接使用： pi and e.</li>
</ul>
</div>

</body>
</html>