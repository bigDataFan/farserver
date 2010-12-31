<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>

<link rel="stylesheet" type="text/css" href="../js/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" href="../js/themes/icon.css">
<script type="text/javascript" src="../js/jquery-1.4.2.min.js"></script>
<script language="Javascript" type="text/javascript" src="../js/jquery.easyui.min.js"></script>
<script language="Javascript" type="text/javascript" src="../js/main.js"></script>
<link rel="stylesheet" type="text/css" href="../style.css">


<script type="text/javascript">
	var collections = "tables";
	var editpage = "table.gs"
</script>

</head>
<body>

<#include "../header.ftl">

<div class="mainbody">
	<div class="container980" style="padding-top: 10px;">
	
		<table id="infoTable" style="width:980px;height:500px;" idField="id">
			<thead>
				<tr>
					<th field="name" width="100" >名称</th>
					<th field="seq" width="50" editor="text">序号</th>
					<th field="seats" width="50" editor="text">人数</th>
					<th field="type" width="200" editor="text" sortable="true">类型</th>
					<th field="region" width="200" editor="text" sortable="true">区域</th>
				</tr>
			</thead>
		</table>
	</div>
	
</div>

<div class="footer">

<div id="copyright">
    <span>&copy;2010 凯迪餐饮行业用户支持系统  <a title="凯迪餐饮行业用户支持系统 " href="mailto:liuhann@gmail.com">联系作者</a>.  </span>
</div>

</div>


</body>
</html>