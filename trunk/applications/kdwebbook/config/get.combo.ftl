<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="../style.css">
<script type="text/javascript" src="../js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="../js/form.js"></script>
<script type="text/javascript" src="../js/tag.js"></script>


<link rel="stylesheet" type="text/css" href="../js/themes/gray/easyui.css">
<link rel="stylesheet" type="text/css" href="../js/themes/icon.css">
<script language="Javascript" type="text/javascript" src="../js/jquery.easyui.min.js"></script>


</head>

<body>
<#include "../header.ftl">

<div class="mainbody">

	<form action="service/update.gs" method="POST">
	<div class="container980 kform">
		<div class="cats">
			<h3>基本信息</h3>
			<div class="columns3">
				<label>名称</label> <input type="text" name="name">
			</div>
			<div class="columns3">
				<label >总价</label> <input type="text" name="price"> 
			</div>
			<div class="columns1">
				<input type="checkbox" name="season">时价菜 <input type="checkbox" name="temp">临时菜     <input type="checkbox" name="discount">可折价
				<input type="checkbox" name="pendding">停用 <input type="checkbox" name="webbook">可网订
			</div>

			<div class="columns2">
				<label>列表1(输入菜品简称，多个以空格分隔)<br> </label> <input type="text" name="list1">  <br>
				<label>说明 </label><br><input type="text" name="desc1">  
			</div>
			
			<div class="columns2">
				<label>列表2(输入菜品简称，多个以空格分隔)<br> </label> <input type="text" name="list2">  <br>
				<label>说明 </label><br><input type="text" name="desc2">  
			</div>
			<div class="columns2">
				<label>列表3(输入菜品简称，多个以空格分隔)<br> </label> <input type="text" name="list3">  <br>
				<label>说明 </label><br><input type="text" name="desc3">  
			</div>
			<div class="columns2">
				<label>列表4(输入菜品简称，多个以空格分隔)<br> </label> <input type="text" name="list4">  <br>
				<label>说明 </label><br><input type="text" name="desc4">  
			</div>
			<div class="columns2">
				<label>列表5(输入菜品简称，多个以空格分隔)<br> </label> <input type="text" name="list5">  <br>
				<label>说明 </label><br><input type="text" name="desc5">  
			</div>
			<div class="columns2">
				<label>列表5(输入菜品简称，多个以空格分隔)<br> </label> <input type="text" name="list6">  <br>
				<label>说明 </label><br><input type="text" name="desc6">  
			</div>
		</div> 
				
		<div class="cats">
			<div class="columns3">
				<input type="button" value="保存" onclick="saveObj()">
			</div>
			<div class="columns3">
				<input type="button" value="保存并新建" onclick="saveObj(true)">
			</div>
		</div>
	</div>
	</form>
				
</div>

<#include "../footer.ftl">


</body>
</html>