<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a2/jquery.mobile-1.0a2.min.css" />
<script src="http://code.jquery.com/jquery-1.4.4.min.js"></script>
<script src="http://code.jquery.com/mobile/1.0a2/jquery.mobile-1.0a2.min.js"></script>

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