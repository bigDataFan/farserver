<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Install Application</title>
</head>
<body>


<form method="POST" action="../service/application/install">
   应用名称  <input name="application"  value="<%=request.getParameter("app")%>"> <br>
<input type="submit">
</form>

</body>
</html>