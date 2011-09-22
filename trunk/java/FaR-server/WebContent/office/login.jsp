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
	
	if (request.getParameter("oauth")!=null) {
		if ("baidu".equals(request.getParameter("oauth"))) {
			response.sendRedirect("http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=waxDdavqGbR1K3qx19pyorqg&redirect_uri=http%3A%2F%2Fwww.ever365.com%2Foauth%2Fbaidu");
			return;
		}
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
					密码：  <input type="password"" name="password" size="16" width="200">
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
					  没有账号？请 <a href="/office/register.jsp">注册</a> 
				</div>
				<div class="label other">
					 &nbsp;<img src="http://static.youku.com/v1.0.0687/partner/img/ico_sina_16x16.png" alt="新浪微博"> <a href="/login/sina.jsp">用新浪微博账号登陆</a>
				</div>
				     	  
				
				
				</form>
			</div>
			
			<div class="pageFootbar">
				
			</div>
	</div>
<script src="http://app.baidu.com/static/appstore/monitor.st"></script>
</body>
</html>