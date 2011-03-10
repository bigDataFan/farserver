<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>点滴时间管理</title>

<link rel="stylesheet"  href="injected.css" />
<script type="text/javascript" src="js/jquery-1.4.2.min.js"> </script>
<script type="text/javascript" src="js/ui.js"></script>


<script type="text/javascript">


var uidiv_global_popup;
$(document).ready(function(){
	uidiv_global_popup = $('#gq_extension_wrapper');
	
	if (!$.browser.msie) { 
		bindEvents(uidiv_global_popup);
	}
	setTimeout("scheduleUpdate()",60000);
});


</script>
</head>
<body style="background-color: graytext;">

<div id="gq_extension_wrapper" class="extension_wrapper">
	<div class="close"><a class="close" href="#">&nbsp;</a></div>
	<h1>点滴时间管理 
			<a class="graph" href="#" rel="用饼状图查看工作分配情况">&nbsp;</a>
			<a class="new" href="edit.gs" title="新建一个工作项">&nbsp;</a>
	</h1>

	<div class="list">
		<#list model.list as item>
			<div class="entry ${item.css}">
				<h4><span class="desc"> ${item.desc}</span><a href="edit.gs?start=${item.start?c}">配置</a>
					<!-- <span class="config" ></span> -->
				<a href="<#if item.running>service/stop.gs<#else>service/start.gs?id=${item.start?c}</#if>" class="rs">${item.dura}</a></h4></div>
		</#list>
	</div>
	<div class="summary">
		<h4><a id="total" class="rs">总计：${model.total}</a></h4>
	</div>	
</div>

	
</body>
</html>