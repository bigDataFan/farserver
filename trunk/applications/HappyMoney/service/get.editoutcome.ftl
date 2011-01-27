<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
<#if request.getAgent().isMozilla5()>
<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0a2/jquery.mobile-1.0a2.min.css" />
<script src="http://code.jquery.com/jquery-1.4.4.min.js"></script>
<script src="http://code.jquery.com/mobile/1.0a2/jquery.mobile-1.0a2.min.js"></script>
</#if>
</head>
<body>

<div data-role="page">

	<div data-role="header" data-theme="c">
		<h1>编辑支出</h1>
	</div><!-- /header -->

		<div data-role="content">	
			<form id="outcomeForm" method="POST" action="saveoutcome.gs">
				<#if model.id??>
					<input type="hidden" name="id"  value="${model.id}">
				</#if>
				
				
				<div data-role="fieldcontain">
					<label for="name">支出条目:</label><br>
				    <input type="text" name="name" value="${model.name}"  />
				</div>
				 <div data-role="fieldcontain">   
				    <label for="name">金额: </label>
				    <input type="text" name="mount" value="${model.mount}" />
				 </div>
				 <div data-role="fieldcontain">   
				    <label for="name">时间: (Feb 12,2010)</label>
				    <input type="text" name="day" value="${model.day?date?string.medium}" />
				 </div>
				 <div data-role="fieldcontain">   
				    <label for="name">备注:</label>
				    <textarea name="comment" id="comment" value="${model.comment}" ></textarea>
				 </div>
				 <div data-role="fieldcontain">  
   				    <label for="category">分类:</label>
					<select name="category">
						<#list model.cats as cat>
							<option value="${cat.name}">${cat.name}</option>
						</#list>
					</select>
				</div></div>
				<fieldset class="ui-grid-c">
					<#if model.id??>
                            <div class="ui-block-a"><a href="deleteoutcome.gs?id=${model.id}" id="cancel" data-role="button">删除</a></div>
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