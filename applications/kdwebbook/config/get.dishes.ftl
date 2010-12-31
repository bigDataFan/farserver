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
	var collections = "dishes";
	var editpage = "dish.gs"

function getThumb(value,rec) {
	return '<img src="../service/upload.gs?id=' +  value  + '&w=100">';
}

function isChecked(value,rec) {
	return value=='1'? "是" : "否";
}	
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
					<th field="short" width="100" editor="text">简写码</th>
					<th field="price" width="100" editor="text">单价</th>
					<th field="image" width="120" editor="text" formatter="getThumb">图片</th>
					<th field="type" width="100" editor="text" sortable="true">分类</th>
					<th field="pendding" width="100" editor="text" sortable="true" formatter="isChecked">停用</th>
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