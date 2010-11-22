<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>新增博文</title>


<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>

<script type="text/javascript" src="../editor/jquery.wysiwyg.js"></script>
<link rel="stylesheet" href="../editor/jquery.wysiwyg.css" type="text/css" />
<link rel="stylesheet" href="../main.css" type="text/css" />

<script>
$(document).ready(function () {
   $('#content').wysiwyg();
   $('#content').wysiwyg('setContent',$('#content').val());
});

function save() {
	document.forms[0].submit();	
}

function saveDraft() {
	$.post("savedraft",
	{
	    "title": $('#title').val(),
	    "content": $('#content').val()
	},
	function(data) {
	   alert("草稿已经保存");
	   location.href="index";
	})
}


</script>

</head>
<body>

<div id="header">
	<div class="wrapper">
		<h1><a href="">${application.getOwner()}的博客</a></h1>
		
		<ul>
			<li><a href="index">首页</a>
			</li>
			
			<#if user.isAppOwner()>
				<li><a title="" href="new">新增文章</a>
				</li>
				<li><a title="" href="drafts">草稿箱</a>
				</li>		
			</#if>
		</ul>
	</div>
	
</div>
	<form method="post" action="addblog">
	
	<div id="pagebody">
		<div class="wrapper">
				<h3>标题 ： <input name="title" id="title" type="text" value="${model.title}"></h3> <br>
				<textarea id="content" name="content" rows="20" cols="100">${model.content}</textarea><br>
				<span>分类 ：
				<select name="category" id="category">
					<#list extension.getBlogService().getCategories() as cat>
						<option value="${cat}">${cat}</option>
					</#list>
				</select> 或者使用新增分类 <input name="newcat" type="text"/></span> <BR>
				
				<br>
				<button onclick="save()">发表</button> <button onclick="saveDraft();return false">保存草稿</button>
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