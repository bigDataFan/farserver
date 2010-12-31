<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="../style.css">
<script type="text/javascript" src="../js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="../js/form.js"></script>
<script type="text/javascript" src="../js/tag.js"></script>


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
				<label >序号</label> <input type="text" name="seq">
			</div>
			<div class="columns3">
				<label >人数</label> <input type="text" name="seats">
			</div>
			<div class="columns1">
				<label >类型 </label> <input type="text" name="type" selectable="true"> 
			</div>
			<div class="columns1">
				<label >区域 </label> <input type="text" name="region" selectable="true"> 
			</div>
			
			<div class="columns1">
				<label >介绍</label><br> <textarea name="desc" selectable="true" rows="3" cols="80"></textarea> 
			</div>
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