<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>


<link rel="stylesheet" type="text/css" href="/js/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="/js/easyui/themes/icon.css">
<script type="text/javascript" src="/js/jquery-1.4.2.min.js"></script>
<script language="Javascript" type="text/javascript" src="/js/easyui/jquery.easyui.min.js"></script>
</head>
<body class="easyui-layout">

	<div region="west" split="true" title="&nbsp;" style="width:300px;">
		<ul>
			<#if model.owner>
				<LI><a href="#">员工管理</a></LI>
				<LI><a href="#">考评记录</a></LI>
			</#if>
			<li><a id="rolecfg" href="#" >考评列表</a></li>
		</ul>
	</div>
		
	<div region="center" id="main">
	</div>

</body>
</html>