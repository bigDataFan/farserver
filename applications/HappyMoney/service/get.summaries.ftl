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
		<h1>分类统计情况</h1>
	</div><!-- /header -->

	<div data-role="content">
		<table class="ui-shadow ui-corner-all" width="100%">
			<#list model.result as c>
				<tr class="ui-btn-up-c" >
					<td style="padding:5px">${c.name}</td>
					<td style="padding:5px">${c.sum}</td>
					<td style="padding:5px">${c.predict}</td>
				</tr>
			</#list>
			<tr class="ui-bar-b ui-corner-bottom">
				<td>总计</td>
				<td>${model.total}</td>
				<td>${model.predict}</td>
			</tr>
		</table>
	</div>
	
	<div data-role="footer" data-theme="c">
		<h4>&copy; 2010  G-QU.NET</h4>
	</div>
</div>


</body>
</html>