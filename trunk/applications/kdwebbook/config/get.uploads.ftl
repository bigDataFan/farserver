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
var collections = "uploads";
var editpage = "newpics.gs";
	
function getThumb(value,rec) {
	return '<img src="../service/upload.gs?id=' +  value  + '&w=100">';
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
					<th field="content_id"  width="120" formatter="getThumb">缩略图</th>
					<th field="name" width="100" >名称</th>
					<th field="date" width="300" editor="text">上传时间</th>
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