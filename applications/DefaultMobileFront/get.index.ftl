<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>欢迎来到G趣网</title>
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

<div class="f">您好 ${model.user} </div>
<div class="j">
	<#list model.allapps as app>
		<#if app.mobile>
			<a href="/user/${model.user}/${app.name}/${app.mobile}"> ${app.alias}</a> &nbsp; | &nbsp; 
		</#if>
	</#list>
</div>
<div class="f"><a href="/logout">退出</a> </div>
</body>
</html>