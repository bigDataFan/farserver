<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>点滴时间管理</title>

<link rel="stylesheet"  href="simple.css" />


</script>
</head>
<body style="background-color: graytext;">

<div id="gq_extension_wrapper" class="extension_wrapper">
	<div class="head">  
		<h1>点滴时间管理</h1> 
		<div class="operbuttons">
			<a class="graph" href="#" rel="用饼状图查看工作分配情况">&nbsp;</a>
			<a class="new" href="edit.gs" title="新建一个工作项">&nbsp;</a>
		</div>
	</div>
	<div class="list">
		<#list model.list as item>
			<div class="entry ${item.css}">
				<h4> ${item.desc} <a href="edit.gs?start=${item.start?c}">配置</a></h4>
				<div> 
					<!-- <span class="config" ></span> -->
				<a href="<#if item.running>service/stop.gs<#else>service/start.gs?id=${item.start?c}</#if>" class="rs">${item.dura}</a>
				</div>
			</div>
		</#list>
	</div>
	<div class="summary">
		<h4><a id="total" class="rs">总计：${model.total}</a></h4>
	</div>	
</div>

	
</body>
</html>