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
		<a href="javascript:history.back()" data-icon="home">首页</a>
		<h1>支出列表</h1>
		<a href="editoutcome.gs" data-icon="add" data-transition="slideup">新增支出</a>
	</div><!-- /header -->
	<div data-role="content">
		<h3>按时间查看:</h3>
		<div data-role="controlgroup" data-type="horizontal">
				<a href="viewoutbyday.gs?from=${model.today}&to=2100/01/01" data-role="button">本日</a>
				<a href="viewoutbyday.gs?from=${model.week}&to=2100/01/01" data-role="button">本周</a>
				<a href="viewoutbyday.gs?from=${model.month}&to=2100/01/01" data-role="button">本月</a>
		</div>
		<ul data-role="listview" data-inset="true" data-theme="c" data-dividertheme="b">
				<li data-role="list-divider">最近10次支出</li>
				<#list model.recents as one>
					<li>
						<h3><a href="editoutcome.gs?id=${one.id}">${one.name}</a></h3>
						<p>分类:${one.category}</p>
						<p class="ui-li-aside"><strong>${one.mount}</strong></p>
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