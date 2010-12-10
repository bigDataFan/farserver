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
		<h1>按时间查看</h1>
	</div><!-- /header -->

	<div data-role="content">
		<ul data-role="listview" data-inset="true" data-theme="c" data-dividertheme="b">
			<#list model.list as daylist>
				<li data-role="list-divider">${daylist.day} <span class="ui-li-count">${daylist.total}</span></li>
				<#list daylist.list as one>
					<li>
						${one.name} <em>${one.category}</em> <span class="ui-li-count">${one.mount}</span>
					</li>
				</#list>
			</#list>
			<li data-role="list-divider">总计 <span class="ui-li-count">${model.total}</span> </li>
		</ul>
	</div>
	
	<div data-role="footer" data-theme="c">
		<h4>&copy; 2010  G-QU.NET</h4>
	</div>
</div>


</body>
</html>