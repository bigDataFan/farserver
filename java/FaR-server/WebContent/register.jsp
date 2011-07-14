<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="org.springframework.web.context.WebApplicationContext"%>
<%@page import="java.util.List"%>
<%@page import="com.ever365.security.BasicUserService"%>
<%@page import="com.ever365.security.Role"%><html>
<head>
<title></title>
<link rel="stylesheet" type="text/css" href="main.css">

<style type="text/css">


form {
  -moz-border-radius:5px 5px 5px 5px;
  -moz-box-shadow:0 0 6px 1px rgba(0, 0, 0, 0.1);
   margin:0 1em;
  background: url(img/zcbcg-section.gif) repeat-x scroll 0 0 rgba(255, 255, 255, 0.9); 
  } 
#name, #email{
   width:200px;
 }
#thisform {
  margin:120px auto;
  padding:3px 30px;
  width:680px;
  height:450px;
 } 
#thisform .tout{
   font-size:95%;
  font-weight:bold;
  color:#693;
  margin:15px 1px;
  padding:5px 15px;
	} 
#thisform input{
  margin:0 10px;
  padding:5px 5px;
 
  } 
#thisform p{
  margin:5px 0;
  padding:5px 3px;
  font-size:95%;
 }
p #submit {
  margin:5px 150px;
  padding:5px 25px;
	 } 	  
#thisform label{ 
  padding:3px 10px;
  font-family: "微软雅黑";
  font-weight:bold;
  color:#333;
  }
#thisform fieldest{
  padding:0 20px;
  font-size:95%;
  font-weight:bold;
  color:#333;
	 }  


  
  
  

</style>
<%

WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
BasicUserService userService = (BasicUserService) ctx.getBean("userService");

List<Role> openRoles = userService.getOpenRoles();

%>
</head>

<body>
<div class="top">
<ul id="nav">
	<li><a href="/index.html">首页</a></li>
	<li><a href="/login.html">登陆</a></li>
	<li><a href="/register.jsp">注册</a></li>
</ul>
</div>

<div id="content">

	<%if (openRoles.size()==0) { %>
				抱歉，当前服务器不允许匿名注册，请联系服务器管理员
	<%} else { %>
		<form action="/reg" id="thisform" method="post">
		<p class="tout">请在此注册</p>
		<p><label for="name" accesskey="9">用户名：</label></p>
		 <input class="text" type="text" name="username"  value="" /> <font color="red"><%=session.getAttribute("username")==null?"":session.getAttribute("username")%></font>
		<p>用户组：<select name="role">
			<% for(Role role: openRoles) {%>
				<option value="<%=role.getId().toString() %>"><%=role.getName() %></option>
			<% }%>
		</select> </p>
		<p><label for="password">密&nbsp;&nbsp;码：</label></p>
		<input class="text" type="password" name="pwd"  value="" /><font color="red"><%=session.getAttribute("pwd")==null?"":session.getAttribute("pwd")%></font>
		
		<p><label for="password">请再输一次密码：</label><br>
		</p>
		<input class="text" type="password" name="pwdcfm"  value="" /><font color="red"><%=session.getAttribute("pwdcfm")==null?"":session.getAttribute("pwdcfm")%></font>
		
		<p><label for="email">Email ：</label></p>
		<input class="text" type="text"  name="email"  value="" /><font color="red"><%=session.getAttribute("email")==null?"":session.getAttribute("email")%></font>
		<p><label for="remember">输入验证码：</label><img src="rndimg" id="imgg"> <input class="text" type="text"  name="randomimg"  value="" /><font color="red"><%=session.getAttribute("randomimg")==null?"":session.getAttribute("randomimg")%></font></p>

		<p><input id="submit" type="submit" value="立即注册" tabindex="5" /></p>
	</form>
<%} %>


</div>



<div>
<div id="footer">
<ul>
	<li><a href="/hom/">页脚</a></li>
	<li><a href="/rec/">联系</a></li>
	<li><a href="/app/">关于</a></li>
</ul>
</div>
</div>
</div>
</body>

</html>



