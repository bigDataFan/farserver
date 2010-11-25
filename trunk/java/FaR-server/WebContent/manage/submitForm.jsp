<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>提交您的应用</title>
</head>
<body>

<form method="POST" action="../service/global/application/create">
	<p> 应用名称 <input name="name"> 
	</p>
	<p> 别名 <input name="alias"> 
	</p>
	<p> 描述 <input name="description"> 
	</p>
		
	<p> 应用类型 
		<select name="type">
			<option value="0">前台应用或插件</option>
			<option value="1">可安装的动态应用</option>
			<option value="2">单独的动态应用</option>
		</select> 
	</p>
	<p> 状态
		<select name="stage">
			<option value="1">免费安装</option>
			<option value="2">商业收费</option>
		</select> 
	</p>
	
	<p> 分类标签
		 <input name="categories">
	</p>
	
	<p> 资源库地址
		 <input name="repository">
	</p>
	
	<p> 起始页
		 <input name="start">
	</p>
	
	<p><input type="submit"></input></p>
</form>

</body>
</html>