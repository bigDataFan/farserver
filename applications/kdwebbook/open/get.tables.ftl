<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>

<link rel="stylesheet" type="text/css" href="../js/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" href="../js/themes/icon.css">
<script type="text/javascript" src="../js/jquery-1.4.2.min.js"></script>
<script language="Javascript" type="text/javascript" src="../js/jquery.easyui.min.js"></script>
<link rel="stylesheet" type="text/css" href="../style.css">


<script type="text/javascript">

$(document).ready(function(){
	
	var mainMenu = $("#mainMenu > li");
	mainMenu.children("ul").hide();
	mainMenu.hover(function(){
		$(this).children("ul").fadeIn(150);
	},function(){
        $(this).children("ul").fadeOut(150);
	});

	
	
	$('#infoTable').datagrid({
			toolbar:[
		    	{
 		    		text:"开台",
 		    		iconCls:'icon-add',
 		    		handler:function(){
		    			location.href= "table.gs?";					
					}
 				}
 			],
 			onDblClickRow:function(rowIndex, rowData) {
				location.href= "table.gs?id=" + rowData.id;
			},
			pagination:false,
			rownumbers:true,
			pageSize: 100,
			url: "../service/receipts.gs"
	});
});
</script>

</head>
<body>

<#include "../header.ftl">

<div class="mainbody">
	<div class="container980" style="padding-top: 10px;">
	
		<table id="infoTable" style="width:980px;height:500px;" idField="id">
			<thead>
				<tr>
					<th field="name" width="100" >桌号</th>
					<th field="seats" width="50" editor="text">就餐人数</th>
					<th field="seats" width="200" editor="text">开台时间</th>
					<th field="seats" width="200" editor="text">上菜状态</th>
					<th field="seats" width="50" editor="text">已结帐</th>
					<th field="region" width="200" editor="text" sortable="true">操作列表</th>
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