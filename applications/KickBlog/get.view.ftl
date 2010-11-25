<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${model.blog.title}</title>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>

<link rel="stylesheet" href="${context.basePath}/main.css" type="text/css" />

<script>

var date = new Date();
var tag = date.getTime();
</script>

</head>
<body>
<div id="header">
	<div class="wrapper">
		<h1><a href="${context.basePath}/index.gs/0">${model.config.blogname}</a></h1>
	</div>
	
</div>
	<div id="pagebody">
		<div class="wrapper">
				<h2>标题 ： ${model.blog.title} </h2>
				<div class="meta">发表于 ${model.blog.modified?datetime} by ${model.blog.modifier}. 分类：
					<#list model.blog.tags as tag>
						 <a rel="category tag" title="查看此标签的所有文章" href="${context.basePath}/index.gs/${tag}/0">${tag}</a>. 
					</#list>
				</div>
				
				
				<div class="description">
					${model.blog.desc}
				</div>
				
				<div class="content" style="min-height: 400px;">
					${model.blog.content}
				</div> 
				
				<div class="feedback">
					<#if user.equals(model.blog.modifier)>
						<span><a href="${context.basePath}/edit.gs?id=${model.blog.id}">修改</a> | <a href="${context.basePath}/remove.gs?id=${model.blog.id}">删除</a></span>
					</#if>	
				</div>
				

				<div class="nextprev">
					<#if model.previous??>
						<span class="prev"> 上一篇: <a href="${context.basePath}/view.gs/${model.previous.id}">${model.previous.title}</a></span>
					</#if>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<#if model.next??>
						下一篇 <span class="next"> <a href="${context.basePath}/view.gs/${model.next.id}">${model.next.title}</a></span> 
					</#if>
				</div>

				<br>
				<#list model.comments as comment>
					<div class="feedback">
						<div>${comment.modifier}说: ${comment.title}</div>
						<div>发表于： ${comment.modified}</div>
						<div> ${comment.desc}</div>						
					</div>
				</#list>
				<div class="comment_wrap">
					<form method="POST" action="addcomment.gs">
						<input name="id" value="${model.blog.id}" type="hidden">
						<p><input type="text" name="title" id="title"></p>
						<p><textarea tabindex="4" rows="10" cols="100%" id="comment_desc" name="desc"></textarea></p>
						<br>
						<button type="submit">发表评论</button>
				    </form>
				</div>
				
		</div>
	</div>
	
	
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