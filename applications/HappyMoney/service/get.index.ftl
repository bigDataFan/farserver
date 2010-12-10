<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>聪明小管家</title>

<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a2/jquery.mobile-1.0a2.min.css" />
<script src="http://code.jquery.com/jquery-1.4.4.min.js"></script>
<script src="http://code.jquery.com/mobile/1.0a2/jquery.mobile-1.0a2.min.js"></script>

</head>
<body>

<div data-role="page">

	<div data-role="header" data-theme="c">
		<a href="../about.html" data-icon="star">关于</a>
		<h1>聪明小管家</h1>
	</div><!-- /header -->
	<div data-role="content">
	
		<div data-role="controlgroup" data-type="horizontal">
				<a href="#" data-role="button">近3天:<font color="red">${model.threeday}</font></a>
				<a href="#" data-role="button">本月：<font color="red">${model.month}</font></a>
		</div>
		<ul data-role="listview" data-inset="true" data-theme="c" data-dividertheme="b">
			<li data-role="list-divider">操作列表</li>
			<li><a href="../service/outgoings.gs">支出</a></li>
			<li><a href="../service/categories.gs">分类及预算</a></li>
			<li><a href="../service/summaries.gs">统计信息 </a></li>
		</ul>
	</div>
		
	<div data-role="footer" data-theme="c">
		<h4>&copy; 2010  G-QU.NET</h4>
	</div><!-- /header -->
</div>

</body>
</html>