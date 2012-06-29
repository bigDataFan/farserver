<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="css/common.css"/>

<title>注册成为ever365的用户</title>
</head>
<body>
	
	<div id="times" class="pages">
		<div class="pagebar">
						<p class="tout">请在此注册</p>
             </div>
             
			<div class="details views" >
				<form action="/reg" id="thisform" method="post">
				<div class="label">
					账号：   <input class="text" type="text" name="username"  value="" /> 
				</div>
				<div class="label">
					密码：  <input class="text" type="password" name="pwd"  value="" />
				</div>
				
				<div class="label">
					邮件： <input class="text" type="text"  name="email"  value="" /> (可选，用于找回密码)
				</div>
				
				<!-- 
				<div class="label">
					请输入验证码：  <img src="/rndimg" id="imgg">  <input class="text" type="text"  name="randomimg"  value="" />
				</div>
				 -->
				 
				<input type="hidden"  name="from" value="/login/register.jsp">
				
				<div class="label">
					<a class="operations" href="javascript:document.forms[0].submit()">注册</a> 
					
					<%
						if (request.getParameter("error")!=null) {
							out.print("<font color='red'>注册错误：帐号要大于6位 ，并请提供邮件地址</font>");
						}	
				    %>    
					
				</div>
				
				</form>
			</div>
			
			<div class="pageFootbar">
				
			</div>
	</div>

</body>
</html>