<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="org.springframework.web.context.WebApplicationContext"%>
<%@page import="net.gqu.security.BasicUserService"%>
<%@page import="java.util.List"%>
<%@page import="net.gqu.security.Role"%><html>
<head>
<title></title>
<link rel="stylesheet" type="text/css" href="/css/simple.css">
<%

WebApplicationContext ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(config.getServletContext());
BasicUserService userService = (BasicUserService) ctx.getBean("userService");

List<Role> openRoles = userService.getOpenRoles();

%>
</head>

<body>
<div class="top">
<ul id="nav">
	<li><a href="/hom/">首页</a></li>
	<li><a href="/rec/">最新推荐</a></li>
	<li><a href="/app/">榜首应用</a></li>
	<li><a href="/for/">论坛</a></li>
	<li><a href="/com/">社区</a></li>
</ul>
</div>

<div id="content">
<div class="gutter" id="slider">

	<%if (openRoles.size()==0) { %>
				抱歉，当前服务器不允许匿名注册，请联系服务器管理员
	<%} else { %>
			
		<form action="register" id="thisform" method="post">
		<p class="tout">请在此注册</p>
		<p><label for="name" accesskey="9">用户名：</label></p>
		<br/>
		 <input class="text" type="text" name="username"  value="" /> <font color="red"><%=session.getAttribute("username")==null?"":session.getAttribute("username")%></font>
		
		<p><label for="password">密&nbsp;&nbsp;&nbsp;码：</label></p>
		<input class="text" type="password" name="pwd"  value="" /><font color="red"><%=session.getAttribute("pwd")==null?"":session.getAttribute("pwd")%></font>
		
		<p><label for="password">请再输一次密码：</label><br>
		</p>
		<input class="text" type="password" name="pwdcfm"  value="" /><font color="red"><%=session.getAttribute("pwdcfm")==null?"":session.getAttribute("pwdcfm")%></font>
		
		
		<p><label for="email">Email ：</label></p>
		<input class="text" type="text"  name="email"  value="" /><font color="red"><%=session.getAttribute("email")==null?"":session.getAttribute("email")%></font>
		



		<p><label for="remember">输入验证码：</label><img src="rndimg" id="imgg"></p>
		<br/>
	   <input class="text" type="text"  name="randomimg"  value="" /><font color="red"><%=session.getAttribute("randomimg")==null?"":session.getAttribute("randomimg")%></font>
	
	

		<p><input id="submit" type="submit" value="立即注册" tabindex="5" /></p>
	</form>
<%} %>
</div>


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






</body>
</html>