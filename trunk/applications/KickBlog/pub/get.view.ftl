<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${model.getTitle()}</title>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>

<link rel="stylesheet" href="../main.css" type="text/css" />

<script>

var date = new Date();
var tag = date.getTime();
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
				<li><a title="" href="viewfolder">文章管理</a>
				</li>
				<li><a title="" href="viewfolder?folder=drafts">草稿箱</a>
				</li>		
			</#if>
		</ul>
	</div>
	
</div>
	<div id="pagebody">
		<div class="wrapper">
				<h3>标题 ： ${model.getTitle()} </h3>
				<br>
				
				<div class="meta">发表于 ${model.getModified()} by <a href="http://www.andrewnacin.com/">${model.getOwner()}</a>. 分类：
					<#list model.getCategories() as category>
						 <a rel="category tag" title="View all posts in Releases" href="http://wordpress.org/news/category/releases/">${category.getName()}</a>. 
					</#list>
				</div>
				
				<div class="content" style="min-height: 400px;">
					${model.getContent()}
				</div> 
				
				<div class="feedback">
					<#if user.isAppOwner()>
						<span><a href="edit?uuid=${model.getUuid()}">修改</a> | <a href="remove?uuid=${model.getUuid()}">删除</a></span>
					</#if>	
				</div>
				
				<div class="nextprev">
					<#if model.getPreviousBlog()??>
						<span class="prev"> 上一篇: <a href="view?uuid=${model.getPreviousBlog().getUuid()}">${model.getPreviousBlog().getTitle()}</a></span>
					</#if>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<#if model.getNextBlog()??>
						下一篇 <span class="next"> <a href="view?uuid=${model.getNextBlog().getUuid()}">${model.getNextBlog().getTitle()}</a></span> 
					</#if>
				</div>
				
				<br>
				
				<#list model.getComments() as comment>
					<div class="feedback">
						<div>${comment.getCreator()}说: ${comment.getTitle()}</div>
						<div>发表于： ${comment.getCreated()}</div>
						<div> ${comment.getDescription()}</div>						
					</div>
				</#list>
				<div class="comment_wrap">
					<#if user.isGuest()>
						请 <a href="/login.jsp">登录</a> 以发表评论信息
					<#else>
						<form method="POST" action="addcomment?uuid=${model.getUuid()}">
							<p><input type="text" name="title" id="title"></p>
							<p><textarea tabindex="4" rows="10" cols="100%" id="description" name="description"></textarea></p>
							<br>
							<button type="submit">发表评论</button>
					    </form>
					</#if>
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