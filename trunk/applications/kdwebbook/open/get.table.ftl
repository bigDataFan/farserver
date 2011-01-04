<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="../style.css">
<script type="text/javascript" src="../js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="../js/form.js"></script>
<script type="text/javascript" src="../js/tag.js"></script>

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
		    			location.href= "table.gs";					
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

	<form action="service/update.gs" method="POST">
	<div class="container980 kform">
		<div class="cats">
			<h3>基本信息</h3>
			<div class="columns3">
				<label>餐位</label> <select name="position" id="position"></select>
			</div>
			<div class="columns3">
				<label>服务员</label> <input type="text" name="waiter">
			</div>
			<div class="columns3">
				<label >备注</label> <input type="text" name="infos">
			</div>
			<div class="columns3">
				<label >外送地址(外送情况下填写)</label> <input type="text" name="infos">
			</div>
		</div> 
		<div>
		<h3>菜品</h3>
		<table id="booked" style="width:900px;min-height:500px;" idField="id">
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
		<div class="cats">
			<div class="columns3">
				<input type="button" value="保存" onclick="saveObj()">
			</div>
			<div class="columns3">
				<input type="button" value="保存并新建" onclick="saveObj(true)">
			</div>
			<div class="columns3">
				<input type="button" value="序号递增复制" onclick="seqAdd('seq', 'copycount')"> <input size="3" name="copycount">个
			</div>
		</div>
	</div>
	</form>
</div>

<#include "../footer.ftl">


</body>
</html>