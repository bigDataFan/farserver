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

	<form action="../service/upload.gs" enctype="multipart/form-data" method="POST">
	<div class="container980 kform">
		<div class="cats">
			<h3>基本信息</h3>
			<div class="columns3">
				 <input type="file" name="file"> 
			</div>
			<div class="columns3">
				<label>名称(可不填)</label> <input type="text" name="name">
			</div>
		</div> 
		
		<div class="cats">
			<div class="columns3">
				<input type="submit" value="保存">
			</div>
		</div>
	</div>
	</form>
</div>

<#include "../footer.ftl">


</body>
</html>