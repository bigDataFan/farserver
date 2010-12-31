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
	$.getJSON("../service/uploads.gs", 
		{},
		function(data) {
			var images = $('#images');
			for(var i=0; i<data.length; i++) {
				images.append('<option id="' + data[i].content_id + '">' + data[i].name + '</option>');
			};
			images.find('option').click(
				function() {
					$('input[name="image"]').val($(this).attr("id"));
					$('#displayed').attr("src", "../service/upload.gs?w=100&id=" + $(this).attr("id"));
				}
			);
		}
	);
	
	$('#displayed').attr("src", "../service/upload.gs?w=100&id=" + $('input[name="image"]').val());

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
				<label>名称</label> <input type="text" name="name">
			</div>
			<div class="columns3">
				<label >简写码</label> <input type="text" name="short"> 
			</div>
			<div class="columns3">
				<label >单价</label> <input type="text" name="price">
			</div>
			<div class="columns2">
				<label >计量单位</label> <input type="text" name="measurement" selectable="true">
			</div>
			
			<div class="columns3">
				<label >图片</label><br> <input type="text" name="image"/> <span><image id="displayed"/></span>
				<select id="images"> 
					
				</select>
			</div>
			
			<div class="columns1">
				<label >分类 </label> <input type="text" name="type" selectable="true"> 
			</div>
			<div class="columns1">
				<label >口味标签</label> <input type="text" name="taste" selectable="true" multiple="true"> 
			</div>
			
			<div class="columns1">
				<label >描述 </label> <br><textarea name="desc" rows="3" cols="80" ></textarea> 
			</div>
			
			<div class="columns1">
				<input type="checkbox" name="season">时价菜 <input type="checkbox" name="temp">临时菜     <input type="checkbox" name="discount">可折价
				<input type="checkbox" name="pendding">停用 <input type="checkbox" name="webbook">可网订
			</div>
			
			<div class="columns1">
				<input type="checkbox" name="spectial">当前特价 <br> 
				价格 <input type="text" style="width:100px" name="spectialprice">
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