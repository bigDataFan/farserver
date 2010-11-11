<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Index.jsp</title>
</head>
<body>

<form method="POST" action="login">
用户名 <input name="username"> <br>
密码<input name="password"> <br>

<input type="submit">  <a href="register.jsp">注册</a>
</form>


<hr>
安装 <br>

<form method="POST" action="service/application/install">

应用名称 <input name="application"> <br>

<input type="submit">
</form>

</body>
</html>