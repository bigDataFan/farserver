<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<link rel="stylesheet"  href="../jquery.mobile-1.0a1/jquery.mobile-1.0a1.min.css" />
<script src="../jquery-1.4.3.min.js"></script>
<script src="../jquery.mobile-1.0a1/jquery.mobile-1.0a1.min.js"></script>
</head>
<body>
<div data-role="page" id="main">

	<div data-role="header" data-theme="c">
		<a href="index.gs" data-icon="home">首页</a>
		<h1>分类设置</h1>
		<a href="editcat.gs" data-icon="add">新增分类</a>
	</div><!-- /header -->
	
	<div data-role="content">
		<ul data-role="listview" data-inset="true" data-theme="c" data-dividertheme="b">
				<#list model as cat>
					<li>
						<a href="editcat.gs?id=${cat._id}">${cat.name}</a>  
					</li>
				</#list>
			</ul>
	</div>
	
	
	<div data-role="footer" data-theme="c">
		<h4>&copy; 2010  G-QU.NET</h4>
	</div>
</div>


</body>
</html>