<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>编辑</title>


<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>

<script type="text/javascript" src="editor/jquery.wysiwyg.js"></script>
<link rel="stylesheet" href="editor/jquery.wysiwyg.css" type="text/css" />
<link rel="stylesheet" href="main.css" type="text/css" />

<script>

$(document).ready(function () {
   $('#content').wysiwyg();
   $('#content').wysiwyg('setContent',$('#content').val());
});

</script>

</head>
<body>

<div id="header">
	<div class="wrapper">
		<h1><a href="#">博文编辑</a></h1>
		
		<ul>
			<li><a href="${context.basePath}/index.gs/0">首页</a>
			</li>
		</ul>
	</div>
</div>
	<form method="post" action="update.gs">
	
	<div id="pagebody">
		<div class="wrapper">
				<h3>标题 ： <input name="title" id="title" type="text" value="<#if model.post??>${model.post.title}</#if>"></h3> <br> 
				
				<#if model.post??>
					<div style="display:none"> <input name="id" value="${model.post.id}"></div>
				</#if>
				
				概要：<br>
				<textarea id="desc" name="desc" rows="6" cols="100"><#if model.post??>${model.post.desc}</#if></textarea>
				<br>
				<textarea id="content" name="content" rows="20" cols="100"><#if model.post??>${model.post.content}</#if></textarea><br>
				<span>分类 ： <input name="tags" type="text"/></span> <BR>
				<br>
				<input type="submit" value="先发布">
		</div>
	</div>
	
	</form>
	
	<div id="footer">
		<div class="wrapper">
			<p> 
				<a href="../about.html">关于</a> |
				 &copy; Copyright 2010 | 
			</p>
		</div>
	</div>
</body>
</html>