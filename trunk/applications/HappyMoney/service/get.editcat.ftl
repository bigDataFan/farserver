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

<div data-role="page">

	<div data-role="header" data-theme="c">
		<h1>编辑分类</h1>
	</div><!-- /header -->

		<div data-role="content">	
			<form id="outcomeForm" method="POST" action="savecat.gs">
				<div data-role="fieldcontain">
					<label for="name">分类名称:</label>
					<#if model.id??>
						<input type="hidden" name="id"  value="${model.id}">
					</#if>
				    <input type="text" name="name" value="${model.name}"  />
				    <label for="name">每月预算: </label>
				    <input type="text" name="predict" value="${model.predict}"  />
				</div>
				<fieldset class="ui-grid-c">
					<#if model.id??>
                            <div class="ui-block-a"><a href="deletecat.gs?id=${model.id}" id="cancel" data-role="button">删除</a></div>
                    </#if>
                            <div class="ui-block-b"><button data-theme="c" type="submit" id="submit" >保存</button></div>
                 </fieldset>	
                  
                 <h3 id="notification"></h3>
			</form>
		</div><!-- /content -->

	<div data-role="footer" data-theme="c">
		<h4>&copy; 2010  G-QU.NET</h4>
	</div>
</div>


</body>
</html>