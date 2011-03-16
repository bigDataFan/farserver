<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>点滴时间管理</title>

<link rel="stylesheet"  href="injected.css" />

</head>
<body style="background-color: graytext;">

<div id="gq_extension_wrapper" class="extension_wrapper">
	<div class="close"><a class="close" href="#">&nbsp;</a></div>
	<h1>点滴时间管理 <a class="list" href="index.gs" rel="返回到列表模式">&nbsp;</a> 
	</h1>

	<div style="" class="additem">
		<form action="service/update.gs" method="post">
			<#if model.item??>
					<input type="hidden" value="${model.item.start?c}" name="start">
					<input class="inputarea" value="${model.item.desc}" name="desc">
					<input type="submit" class="comment" value="确定"></input>
					<a href="service/delete.gs?start=${params.start}" class="cancel">&nbsp;</a>
			<#else>
					<input class="inputarea" value="请输入任务名称" name="desc">
					<a href="javascript:void(0)" onclick="document.forms[0].submit()" class="comment">确定</a>
			</#if>
		</form>
	</div>

	<div class="summary">

	</div>	
</div>

	
</body>
</html>