<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>草稿箱</title>

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
				<li><a title="" href="drafts">草稿箱</a>
				</li>		
			</#if>
		</ul>
	</div>
	
</div>
	<div id="pagebody">
		<div class="wrapper">
			<table width="100%" cellspacing="0" cellpadding="0" border="0" class="date_show_list">
  				<tbody>
  				
  				<#list model.items as blog>
					<tr>
						<td width="50%">
						${blog.getTitle()} 
						<#if blog.getPublishedBlog()??> 
							<br> <font color="red"> ${blog.getPublishedBlog().getTitle()} </font>
						</#if>
						</td>
						
						<td width="30%">${blog.getModified()} </td>
						<td width="10%"><a href="new?uuid=${blog.getUuid()}">编辑</a></td>
						<td width="10%"><a href="remove?uuid=${blog.getUuid()}&page=drafts">删除</a></td>
  					</tr>
  				</#list>
			    </tbody>
			</table>				
				
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