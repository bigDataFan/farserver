<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>编辑</title>


<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>

<script type="text/javascript" src="../editor/jquery.wysiwyg.js"></script>
<link rel="stylesheet" href="../editor/jquery.wysiwyg.css" type="text/css" />
<link rel="stylesheet" href="../main.css" type="text/css" />

<script>


var date = new Date();
var tag = date.getTime();
$(document).ready(function () {
   $('#content').wysiwyg();
   $('#content').wysiwyg('setContent',$('#content').val());
});

function cancel() {
	location.href="index.gs";
}

function save() {
	document.forms[0].submit();	
}


function remove(uuid) {

	$.get('remove', 
	       {'uuid':uuid},
	       function (data) {
	 			location.href="index.gs";      	
	       }
	 );
}

function saveDraft() {
	$.post("savedraft",
	{
	    "title": $('#title').val(),
	    "content": $('#content').val()
	},
	function(data) {
	   alert("草稿保存成功");
	})
}


</script>

</head>
<body>

<div id="header">
	<div class="wrapper">
		<h1><a href="#">博文编辑</a></h1>
		
		<ul>
			<li><a href="index.gs">首页</a>
			</li>
		</ul>
	</div>
</div>
	<form method="post" action="update">
	
	<div id="pagebody">
		<div class="wrapper">
				<h3>标题 ： <input name="title" id="title" type="text" value="<#if model.post??>${model.post.title}</#if>"></h3> <br> 
				<div style="display:none"> <input name="id" value="<#if model.post??>${model.post.id}</#if>"></div>
				<textarea id="content" name="content" rows="20" cols="100"><#if model.post??>${model.post.content}</#if></textarea><br>
				<span>分类 ： <input name="categories" type="text"/></span> <BR>
				<br>
				<button onclick="save()">保存修改</button><button onclick="cancel()">取消修改</button> 
				<#if model.post??>
				<button onclick="remove('${model.post.id}');return false">删除文章</button>
				</#if>
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