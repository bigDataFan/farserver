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

<div data-role="page">

	<div data-role="header" data-theme="c">
		<a href="about.html" data-icon="star">关于</a>
		<h1>聪明小管家</h1>
	</div><!-- /header -->
	<div data-role="content">
	
		<div data-role="controlgroup" data-type="horizontal">
				<a href="#" data-role="button">近3天:<font color="red">${model.threeday}</font></a>
				<a href="#" data-role="button">本月：<font color="red">${model.month}</font></a>
		</div>
		<ul data-role="listview" data-inset="true" data-theme="c" data-dividertheme="b">
			<li data-role="list-divider">操作列表</li>
			<li><a href="outgoings.gs">支出</a></li>
			<li><a href="categories.gs">分类及预算</a></li>
			<li><a href="summaries.gs">统计信息 </a></li>
			<li><a href="docs/about/intro.html">设定目标</a></li>
		</ul>
	</div>
		
	<div data-role="footer" data-theme="c">
		<h4>&copy; 2010  G-QU.NET</h4>
	</div><!-- /header -->
</div>

</body>
</html>