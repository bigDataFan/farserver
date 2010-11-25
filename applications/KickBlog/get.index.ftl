<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
<link rel="stylesheet" href="${context.basePath}/main.css" type="text/css" />
</head>
<body>

<div id="header">
	<div class="wrapper">
		<h1><a href="#">${model.config.blogname}</a></h1>
		
		<h3>${model.config.slogan}</h3>
		
		<ul>
			<li><a href="${context.basePath}/index.gs/0">首页</a>
			</li>
			
			<#if user.equals(owner)>
				<li><a title="" href="${context.basePath}/edit.gs">新增文章</a>
				</li>
			</#if>
		</ul>
	</div>
	
</div>
	<div id="pagebody">
		<div class="wrapper">
			<div class="col-left">
				<#list model.blogs as blog>
					<h2 class="fancy"><a href="${context.basePath}/view.gs/${blog.id}">${blog.title}</a></h2>
			
				<div class="meta">发表于 ${blog.modified?datetime} 作者 ${blog.modifier}. 分类：
					<#list blog.tags as tag>
						 <a rel="category tag" href="${context.basePath}/index.gs/tag/${tag}/0">${tag}</a>. 
					</#list>
					阅读： ${blog.visited} 回复：${blog.replied}
				</div>
				<div class="storycontent">
					${blog.desc}
				</div>
				
				<div class="feedback">
					<#if user.getName().equals(blog.modifier)>
						<span><a href="${context.basePath}/edit.gs/${blog.id}">修改</a> | <a href="${context.basePath}/remove.gs/${blog.id}">删除</a></span>
					</#if>	
				</div>								
				</#list>
				
				
				<div class="feedback">
					<table border=0 width="600px">
						<tr> 
						<td width="400px">列举第(${model.from}-${model.to})篇文章  -- 共 ${model.total}篇</td>
						<td width="100px"> 
					
					<#if model.raw??>
						<#if (model.page &gt; 0)>
							<a href="index.gs/${model.page-1}">上一页</a>	
						</#if>
						</td> <td width="100px">
						<#if (model.to &lt; model.total)>
							<a href="index.gs/${model.page+1}">下一页</a>
						</#if>
					<#else>
						<#if (model.page &gt; 0)>
							<a href="${model.page-1}">上一页</a>	
						</#if>
						</td> <td width="100px">
						<#if (model.to &lt; model.total)>
							<a href="${model.page+1}">下一页</a>
						</#if>	
					</#if>
					</td></tr>
					</table>
				</div>
			</div>		
			
			<div class="col-right">
				
				<div class="blog-categories">
					<h4>分类</h4>
					<ul>
						<#list model.tags as tag>
							<li><a href="index.gs/tag/${tag}">${tag}</a> 
							</li>
						</#list>
					</ul>
				
				</div>
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