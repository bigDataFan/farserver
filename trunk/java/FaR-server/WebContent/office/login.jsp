<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="common.css"/>

<%
	if (request.getParameter("redirectTo")!=null) {
		session.setAttribute("rediretTo", request.getParameter("redirectTo"));
	}
%>
<title>请登陆ever365</title>
</head>
<body>
	
	<div id="times" class="pages">
		<div class="pagebar">
             </div>
             
			<div class="details views" >
				<form action="/login" method="POST">
				<div class="label">
					账号：  <input type="text" name="username" size="16" width="200"> 
				</div>
				<div class="label">
					密码：  <input type="text" name="password" size="16" width="200">
				</div>
				<input type="hidden"  name="from" value="/office/login.jsp">
				
				<div class="label">
					<a class="operations" href="javascript:document.forms[0].submit()">登陆</a> 
					
					<%
						if (session.getAttribute("loginError")!=null) {
							out.print("<font color='red'>" + session.getAttribute("loginError") + "</font>");
						}	
				    %>    
					
				</div>
				
				<div class="label">
					  没有账号？请 <a class="operations" href="/office/register.jsp">注册</a>  或使用其他网站账号登陆
				</div>
				</form>
			</div>
			
			<div class="pageFootbar">
				
			</div>
	</div>

</body>
</html>